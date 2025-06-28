import React, { useEffect, useState, useRef } from 'react';
import { Search, BrainCircuit } from 'lucide-react';
import './Session.css';

// Assuming components are in src/components
import VideoInput from '../components/VideoInput';
import WebcamFeed from '../components/WebcamFeed';
import BreakModal from '../components/BreakModal';
import QuizModal from '../components/QuizModal';
import SleepModal from '../components/SleepModal';

const Session = () => {
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState("...");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", resource: "" });
  const [breakTime, setBreakTime] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);

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
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await res.json();

      if (data.emotion && data.score !== undefined) {
        setEmotion(data.emotion);
        setScore(data.score);
        setIsSleeping(data.is_sleeping || false);

        if (data.feedback?.action === "break") {
          setFeedback({ message: data.feedback.message, resource: data.feedback.resource });
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

  const focusScorePercentage = (score / 6) * 100;

  return (
    <div className="session-page">
      <header className="session-header">
        <div className="session-title">
          <BrainCircuit size={32} />
          <h1>AI Learning Coach</h1>
        </div>
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search for a topic or video..." />
        </form>
      </header>

      <div className="session-content">
        <main className="video-panel">
          <VideoInput breakTime={breakTime} />
        </main>

        <aside className="coach-panel">
          <h2>Your Coach</h2>
          <WebcamFeed emotion={emotion} score={score} isSleeping={isSleeping} />
          <div className="focus-score-card">
            <h3>Focus Score</h3>
            <div className="focus-score-visual">
              <div className="focus-score-bar" style={{ width: `${focusScorePercentage}%` }}></div>
            </div>
            <p>{Math.round(focusScorePercentage)}%</p>
          </div>
          {isSleeping && <p className="sleep-warning">Sleep Detected!</p>}
        </aside>
      </div>

      {showBreakModal && (
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
};

export default Session;