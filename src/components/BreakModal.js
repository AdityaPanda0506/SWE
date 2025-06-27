import React from 'react';
import './BreakModal.css';

export default function BreakModal({ message, onContinue, onTakeBreak }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>🧠 Suggestion</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onContinue}>Continue Watching</button>
          <button onClick={onTakeBreak}>Take Action</button>
        </div>
      </div>
    </div>
  );
}