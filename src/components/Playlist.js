import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import './Playlist.css';

const Playlist = () => {
  const [items, setItems] = useState([
    { id: 1, title: 'Introduction to React Hooks' },
    { id: 2, title: 'State Management with Redux' },
  ]);
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() === '') return;
    setItems([...items, { id: Date.now(), title: newItem.trim() }]);
    setNewItem('');
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="playlist-container">
      <h3>Playlist</h3>
      <form onSubmit={handleAddItem} className="add-item-form">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a video title..."
        />
        <button type="submit"><Plus size={18} /></button>
      </form>
      <ul className="playlist-list">
        {items.map((item) => (
          <li key={item.id} className="playlist-item">
            <span className="playlist-item-title">{item.title}</span>
            <button onClick={() => handleRemoveItem(item.id)} className="remove-item-btn">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
