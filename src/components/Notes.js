import React, { useState, useContext } from 'react';
import { NotesContext } from '../contexts/NotesContext';
import './Notes.css';

const Notes = () => {
  const [note, setNote] = useState('');
  const { addNote } = useContext(NotesContext);

  const handleSaveNote = () => {
    if (note.trim()) {
      addNote(note);
      setNote('');
    }
  };

  return (
    <div className="notes-container">
      <h3>Notes</h3>
      <textarea
        className="notes-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Take notes here..."
      />
      <button onClick={handleSaveNote} className="save-note-btn">Save Note</button>
    </div>
  );
};

export default Notes;
