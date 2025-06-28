import React, { useState } from 'react';
import { Plus, X, StickyNote } from 'lucide-react';
import './NotesPage.css';

const NotesPage = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'Remember to call mom this weekend', createdAt: new Date() },
    { id: 2, content: 'Book ideas:\n- Productivity system\n- Morning routines', createdAt: new Date() }
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        createdAt: new Date(),
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>Quick Notes</h1>
      </div>

      <form className="add-note-form" onSubmit={addNote}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="What's on your mind?"
          className="note-textarea"
        />
        <button type="submit" className="add-note-btn">
          <Plus size={18} />
          <span>Add Note</span>
        </button>
      </form>

      <div className="notes-grid">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="note-item">
              <button
                onClick={() => deleteNote(note.id)}
                className="delete-note-btn"
              >
                <X size={16} />
              </button>
              <p className="note-content">
                {note.content}
              </p>
              <div className="note-footer">
                <span className="note-time">
                  {note.createdAt.toLocaleDateString()} - {note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <StickyNote size={48} />
            <p>No notes yet. Add one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
