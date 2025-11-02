import React, { useState, useEffect } from 'react'; // ✅ Added missing imports
import './BreakModal.css';

export default function BreakModal({ message, onContinue, onTakeBreak }) {
 const [showModal, setShowModal] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>🧠 Suggestion</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onContinue}>Continue Watching</button>
          <button onClick={() => window.location.href='http://127.0.0.1:5500/game.js/game.js/index.html'}>
            Take action
          </button>
        </div>
      </div>
    </div>
  );
}