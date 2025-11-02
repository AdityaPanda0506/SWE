import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, StickyNote, Plus, X } from 'lucide-react';
import './NotesPage.css';
import { NotesContext } from '../contexts/NotesContext';

const NotesPage = () => {
  const { notes, addNote, deleteNote } = useContext(NotesContext);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(newNote);
      setNewNote('');
      setIsAdding(false);
    }
  };

  return (
    <div className="notes-page">
      <nav className="nav-bar">
        <Link to="/" className="nav-link">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </nav>

      <div className="notes-container">
        <div className="notes-card">
          <div className="notes-header">
            <div className="header-title">
              <StickyNote size={24} />
              <h1>Quick Notes</h1>
            </div>
            <button 
              className="add-note-btn"
              onClick={() => setIsAdding(true)}
            >
              <Plus size={16} />
              Add Note
            </button>
          </div>

          {isAdding && (
            <div className="add-note-form">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note..."
                className="note-textarea"
                autoFocus
              />
              <div className="form-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn"
                  onClick={handleAddNote}
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          <div className="notes-grid">
            {notes.map(note => (
              <div
                key={note.id}
                className={`note-item ${note.color}`}
              >
                <button
                  onClick={() => deleteNote(note.id)}
                  className="delete-note-btn"
                >
                  <X size={16} />
                </button>
                <p className="note-content">
                  {note.content}
                </p>
                <div className="note-time">
                  {note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && !isAdding && (
            <div className="empty-state">
              <StickyNote size={48} />
              <p>No notes yet. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;