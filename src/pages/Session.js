// src/pages/Session/Session.js

import React, { useEffect, useState, useRef } from 'react';
import './Session.css';

// Components
import VideoInput from '../components/VideoInput';
import WebcamFeed from '../components/WebcamFeed';
import BreakModal from '../components/BreakModal';
import QuizModal from '../components/QuizModal';
import SleepModal from '../components/SleepModal';

export default function Session() {
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("...");
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState({
    message: "",
    resource: "",
  });
  const [breakTime, setBreakTime] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);

  // Frame capture every second
  useEffect(() => {
    const interval = setInterval(captureAndSendFrame, 1000);
    return () => clearInterval(interval);
  }, []);

  const captureAndSendFrame = async () => {
    if (!canvasRef.current || !document.querySelector('video')) return;

    const video = document.querySelector('video');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL('image/jpeg');

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await res.json();

      if (data.emotion && data.score !== undefined) {
        setEmotion(data.emotion);
        setScore(data.score.toFixed(2));
        setConfidence(data.confidence || 0.6);
        setIsSleeping(data.is_sleeping || false);

        if (data.feedback?.action === "break") {
          setShowBreakModal(true);
        } else if (data.learning_state === "Confused") {
          setShowQuizModal(true);
        } else if (data.is_sleeping) {
          setShowSleepModal(true);
        }
      }

    } catch (err) {
      console.error("Failed to send frame:", err);
    }
  };

  const handleContinue = () => setShowBreakModal(false);
  const handleTakeAction = () => {
    setShowBreakModal(false);
    setBreakTime(true);
  };

  const handleTakeQuiz = () => {
    alert("Redirecting to quiz");
    setShowQuizModal(false);
  };

  const handleRest = () => {
    alert("Taking a break...");
    setShowSleepModal(false);
  };

  return (
    <div className="youtube-layout">
      {/* Top Bar */}
      <div className="top-bar">
        <h1>🧠 AI Learning Coach</h1>
        <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Search topic or video..." />
          <button type="submit">🔍</button>
        </form>
      </div>

      {/* Main Content Area - Left: Video | Right: Webcam */}
      <div className="main-content">
        {/* Left Side - YouTube Player */}
        <div className="left-panel">
          <VideoInput breakTime={breakTime} />
        </div>

        {/* Right Side - Webcam Feed & Stats */}
        <div className="right-panel">
          <WebcamFeed emotion={emotion} score={score} confidence={confidence} isSleeping={isSleeping} />

          <div className="stats-box">
            <h3>🎯 Focus Score: {(10/6)*score}/10</h3>
            {isSleeping && <p style={{ color: 'red' }}><strong>Sleep Detected!</strong></p>}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBreakModal && feedback.message && (
        <BreakModal
          message={feedback.message}
          onContinue={handleContinue}
          onTakeBreak={handleTakeAction}
        />
      )}

      {showQuizModal && <QuizModal onTakeQuiz={handleTakeQuiz} onSkip={() => setShowQuizModal(false)} />}
      {showSleepModal && <SleepModal onConfirm={handleRest} />}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}