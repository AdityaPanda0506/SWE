import React from 'react';
import './QuizModal.css';

export default function QuizModal({ onTakeQuiz, onSkip }) {
  return (
    <div className="quiz-modal-overlay">
      <div className="quiz-modal-content">
        <div className="icon-wrapper">
          <div className="icon-bg">
            <span role="img" aria-label="help">❓</span>
          </div>
        </div>
        <h3>Confusion Detected</h3>
        <p>It looks like you might be confused about this topic. Would you like some help?</p>

        <div className="quiz-modal-buttons">
          <button onClick={onTakeQuiz}>
            <span>📘</span> Get related resources
          </button>
          <button onClick={() => {
            alert("Rewinding video to previous section...");
            onSkip();
          }}>
            <span>↩️</span> Rewind and review
          </button>
          <button onClick={onSkip} className="secondary-btn">
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  );
}