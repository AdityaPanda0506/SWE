import numpy as np
import mediapipe as mp
from deepface import DeepFace
import cv2
import time
from collections import deque

# === Config ===
EYE_OPEN_THRESH = 0.2
GAZE_FORWARD_THRESH = 0.1
MIN_HISTORY_FOR_STATE = 5
TIRED_DURATION_THRESHOLD = 30  # seconds

# Initialize MediaPipe Face Mesh
mp_face = mp.solutions.face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True)

# Circular buffer to smooth predictions
MAX_HISTORY = 10  # Stores last N frames
emotion_history = deque(maxlen=MAX_HISTORY)
score_history = deque(maxlen=MAX_HISTORY)

# Track how long user has been tired
tired_start_time = None
current_state = "Engaged"

# Sleep detection
EYE_CLOSED_THRESH = 0.1
eye_ratio_history = deque(maxlen=30)  # Store last 30 eye ratios (~30 sec)

def eye_openness_ratio(iris_landmarks, eye_landmarks):
    l = np.linalg.norm(np.array(eye_landmarks[1]) - np.array(eye_landmarks[5]))
    w = np.linalg.norm(np.array(eye_landmarks[0]) - np.array(eye_landmarks[3]))
    return l / w

def calculate_score(emotion, eye_ratio, gaze_offset):
    weights = {
        'neutral': 1.0, 'happy': 1.0, 'surprise': 0.8,
        'angry': 0.3, 'fear': 0.3, 'sad': 0.2, 'disgust': 0.2
    }
    score = weights.get(emotion, 0.5)
    score += max(0.0, min((eye_ratio - EYE_OPEN_THRESH) * 2, 1.0))
    gaze_score = 1.0 if abs(gaze_offset) < GAZE_FORWARD_THRESH else -0.5
    score += gaze_score
    return round(max(0.0, min(score * 2, 10.0)), 2)

def get_learning_state():
    global tired_start_time, current_state

    if len(score_history) < MIN_HISTORY_FOR_STATE:
        return current_state

    avg_score = sum(score_history) / len(score_history)
    most_common_emotion = max(set(emotion_history), key=emotion_history.count)

    new_state = ""
    if avg_score < 3:
        new_state = "Frustrated"
        tired_start_time = None
    elif avg_score < 5:
        new_state = "Confused"
        tired_start_time = None
    elif avg_score < 7:
        new_state = "Tired"
        if current_state == "Tired":
            if tired_start_time is None:
                tired_start_time = time.time()
        else:
            tired_start_time = time.time()
    elif avg_score < 9:
        new_state = "Distracted"
        tired_start_time = None
    else:
        new_state = "Engaged"
        tired_start_time = None

    current_state = new_state
    return new_state

def get_feedback(learning_state):
    if learning_state == "Frustrated":
        return {
            "action": "break",
            "message": "It looks like you're frustrated. Want to take a short break?",
            "resource": "/breathing-exercise",
            "should_pause": False
        }
    elif learning_state == "Confused":
        return {
            "action": "help",
            "message": "Looks like you might be confused. Want a quick explanation?",
            "resource": "/video-explanation",
            "should_pause": False
        }
    elif learning_state == "Tired" and tired_start_time and time.time() - tired_start_time > TIRED_DURATION_THRESHOLD:
        return {
            "action": "break",
            "message": "Your attentiveness is low. Would you like to take a 2-minute break?",
            "resource": "/mini-break",
            "should_pause": False
        }
    elif learning_state == "Distracted":
        return {
            "action": "reminder",
            "message": "You seem distracted. Want to try a mini quiz?",
            "resource": "/mini-quiz",
            "should_pause": False
        }
    else:
        return {
            "action": "continue",
            "message": "Great job staying focused!",
            "resource": "/next-topic",
            "should_pause": False
        }

def analyze_frame(frame):
    global tired_start_time, current_state, eye_ratio_history

    h, w, _ = frame.shape
    results = mp_face.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    emotion = "neutral"
    score = 0
    confidence = 0.6
    feedback = None
    learning_state = "Unknown"
    gaze_offset = 0
    eye_ratio = 0
    is_sleeping = False

    if results.multi_face_landmarks:
        mesh = results.multi_face_landmarks[0].landmark
        pts = [(int(p.x * w), int(p.y * h)) for p in mesh]

        left_eye_idx = [33, 133, 159, 145, 153, 154]
        right_eye_idx = [362, 263, 386, 374, 380, 385]
        left_iris_idx = [468, 469, 470, 471]
        right_iris_idx = [473, 474, 475, 476]

        le = [pts[i] for i in left_eye_idx]
        re = [pts[i] for i in right_eye_idx]
        li = [pts[i] for i in left_iris_idx]
        ri = [pts[i] for i in right_iris_idx]

        eye_ratio = (eye_openness_ratio(li, le) + eye_openness_ratio(ri, re)) / 2
        eye_ratio_history.append(eye_ratio)

        le_center = np.mean(le, axis=0)
        re_center = np.mean(re, axis=0)
        li_center = np.mean(li, axis=0)
        ri_center = np.mean(ri, axis=0)
        gaze_offset = ((li_center[0] - le_center[0]) + (ri_center[0] - re_center[0])) / (2 * w)

        try:
            det = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            if isinstance(det, list):
                det = det[0]
            emotion = det['dominant_emotion']
            confidence_scores = det.get("emotion", {})
            confidence = confidence_scores.get(emotion, 0.6)
        except Exception:
            emotion = 'neutral'
            confidence = 0.6

        score = calculate_score(emotion, eye_ratio, gaze_offset)

        # Update history
        emotion_history.append(emotion)
        score_history.append(score)

        # Detect sleep (eyes closed for more than 30 frames)
        if eye_ratio < EYE_CLOSED_THRESH:
            if len(eye_ratio_history) >= 30 and all(r < EYE_CLOSED_THRESH for r in eye_ratio_history):
                is_sleeping = True
        else:
            is_sleeping = False

        # Get learning state and feedback
        learning_state = get_learning_state()
        feedback = get_feedback(learning_state)

    else:
        # No face detected
        emotion = "No face"
        score = 0
        confidence = 0.0
        learning_state = "Unknown"
        feedback = {
            "action": "none",
            "message": "No face detected",
            "resource": "",
            "should_pause": False
        }
        is_sleeping = False

    return {
        "emotion": emotion,
        "score": round(score, 2),
        "learning_state": learning_state,
        "confidence": round(confidence, 2),
        "eye_ratio": round(eye_ratio, 2) if eye_ratio else 0,
        "gaze_offset": round(gaze_offset, 2) if gaze_offset else 0,
        "is_sleeping": is_sleeping,
        "feedback": feedback
    }