import cv2
import numpy as np
import time
from collections import deque
from deepface import DeepFace
import mediapipe as mp
from sklearn.ensemble import RandomForestClassifier

# === Config ===
EYE_OPEN_THRESH = 0.2
GAZE_FORWARD_THRESH_X = 0.1
GAZE_FORWARD_THRESH_Y = 0.1
MIN_HISTORY_FOR_STATE = 10
TIRED_DURATION_THRESHOLD = 30  # seconds
BLINK_THRESHOLD = 0.15
PERCLOS_THRESHOLD = 0.3
MIN_BLINK_RATE = 3
MAX_BLINK_RATE = 20

# Initialize MediaPipe Face Mesh
mp_face = mp.solutions.face_mesh.FaceMesh(max_num_faces=1, refine_landmarks=True)

# Buffers
emotion_history = deque(maxlen=15)
score_history = deque(maxlen=15)
gaze_history = deque(maxlen=15)
eye_ratio_history = deque(maxlen=60)

# Timers and counters
tired_start_time = None
current_state = "Engaged"
blink_counter = 0
frame_counter = 0
blink_start_time = time.time()

# Eye openness

def eye_openness_ratio(iris_landmarks, eye_landmarks):
    l = np.linalg.norm(np.array(eye_landmarks[1]) - np.array(eye_landmarks[5]))
    w = np.linalg.norm(np.array(eye_landmarks[0]) - np.array(eye_landmarks[3]))
    return l / w if w != 0 else 0

# Gaze estimation

def estimate_gaze_direction(left_eye, right_eye, left_iris, right_iris):
    le_center = np.mean(left_eye, axis=0)
    re_center = np.mean(right_eye, axis=0)
    li_center = np.mean(left_iris, axis=0)
    ri_center = np.mean(right_iris, axis=0)
    gaze_x = ((li_center[0] - le_center[0]) + (ri_center[0] - re_center[0])) / (le_center[0] * 2)
    gaze_y = ((li_center[1] - le_center[1]) + (ri_center[1] - re_center[1])) / (le_center[1] * 2)
    return gaze_x, gaze_y

# Scoring

def calculate_score(emotion, eye_ratio, gaze_x, gaze_y):
    weights = {
        'neutral': 1.0, 'happy': 1.2, 'surprise': 0.8,
        'angry': 0.3, 'fear': 0.3, 'sad': 0.2, 'disgust': 0.2
    }
    score = weights.get(emotion, 0.5)
    score += max(0.0, min((eye_ratio - EYE_OPEN_THRESH) * 2, 1.0))
    gaze_score = 1.0 if abs(gaze_x) < GAZE_FORWARD_THRESH_X and abs(gaze_y) < GAZE_FORWARD_THRESH_Y else -0.5
    score += gaze_score
    return round(max(0.0, min(score * 2, 10.0)), 2)

# Rule-based learning state classifier

def get_learning_state(score, eye_ratio, gaze_offset, emotion):
    gaze_x, gaze_y = gaze_offset
    is_distracted = abs(gaze_x) > 0.15 or abs(gaze_y) > 0.15
    is_tired = eye_ratio < 0.18

    if emotion in ['sad', 'fear', 'angry', 'disgust']:
        return "Frustrated"
    if emotion in ['neutral', 'surprise'] and is_distracted:
        return "Distracted"
    if emotion in ['happy'] and score > 7:
        return "Engaged"

    if score >= 7:
        return "Engaged"
    elif 4 <= score < 7:
        if is_distracted:
            return "Distracted"
        elif is_tired:
            return "Tired"
        else:
            return "Confused"
    elif 2 <= score < 4:
        return "Frustrated"
    else:
        return "Tired"

# Feedback system

def get_feedback(learning_state):
    feedback_map = {
        "Frustrated": ("break", "It looks like you're frustrated. Want to take a short break?", "/breathing-exercise"),
        "Confused": ("help", "Looks like you might be confused. Want a quick explanation?", "/video-explanation"),
        "Tired": ("break", "You seem tired. Would you like to take a 2-minute break?", "/mini-break"),
        "Distracted": ("reminder", "You seem distracted. Want to try a mini quiz?", "/mini-quiz"),
        "Engaged": ("continue", "Great job staying focused!", "/next-topic")
    }
    action, message, resource = feedback_map.get(learning_state, ("none", "No face detected", ""))
    return {
        "action": action,
        "message": message,
        "resource": resource,
        "should_pause": False
    }

# Main analysis function

def analyze_frame(frame):
    global tired_start_time, current_state, eye_ratio_history
    h, w, _ = frame.shape
    results = mp_face.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    emotion = "neutral"
    score = 0
    confidence = 0.6
    feedback = None
    learning_state = "Unknown"
    gaze_offset = (0, 0)
    eye_ratio = 0
    is_sleeping_flag = False
    head_pose = {"pitch": 0, "yaw": 0, "roll": 0}

    if results.multi_face_landmarks:
        mesh = results.multi_face_landmarks[0].landmark
        pts = np.array([(int(p.x * w), int(p.y * h)) for p in mesh], dtype=np.float32)

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

        gaze_x, gaze_y = estimate_gaze_direction(le, re, li, ri)
        gaze_offset = (gaze_x, gaze_y)
        gaze_history.append(gaze_offset)

        try:
            det = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False, detector_backend='retinaface', model_name='Emotion')
            if isinstance(det, list):
                det = det[0]
            emotion = det['dominant_emotion']
            confidence_scores = det.get("emotion", {})
            confidence = confidence_scores.get(emotion, 0.6)
        except Exception:
            emotion = 'neutral'
            confidence = 0.6

        score = calculate_score(emotion, eye_ratio, gaze_x, gaze_y)
        emotion_history.append(emotion)
        score_history.append(score)

        learning_state = get_learning_state(score, eye_ratio, gaze_offset, emotion)
        feedback = get_feedback(learning_state)

    else:
        emotion = "No face"
        score = 0
        confidence = 0.0
        learning_state = "Unknown"
        feedback = get_feedback("Unknown")

    return {
        "emotion": emotion,
        "score": round(score, 2),
        "learning_state": learning_state,
        "confidence": round(confidence, 2),
        "eye_ratio": round(eye_ratio, 2),
        "gaze_offset": [round(gaze_offset[0], 2), round(gaze_offset[1], 2)],
        "is_sleeping": is_sleeping_flag,
        "head_pose": head_pose,
        "feedback": feedback
    }