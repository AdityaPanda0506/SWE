import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, Check, X, Star } from 'lucide-react';
import './TodoPage.css';

const TodoPage = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project proposal', completed: false, priority: 'high', category: 'Work' },
    { id: 2, text: 'Review team feedback', completed: false, priority: 'medium', category: 'Work' },
    { id: 3, text: 'Plan weekend trip', completed: true, priority: 'low', category: 'Personal' }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: 'medium',
        category: 'General'
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="todo-page">
      <nav className="nav-bar">
        <Link to="/" className="nav-link">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </nav>

      <div className="todo-container">
        <div className="todo-card">
          <div className="todo-header">
            <h1>Task Manager</h1>
            <div className="pending-badge">
              {todos.filter(t => !t.completed).length} pending
            </div>
          </div>

          <div className="add-todo">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="todo-input"
            />
            <button onClick={addTodo} className="add-btn">
              <Plus size={20} />
            </button>
          </div>

          <div className="filter-tabs">
            {['all', 'pending', 'completed'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`filter-btn ${filter === filterType ? 'active' : ''}`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          <div className="todo-list">
            {filteredTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`check-btn ${todo.completed ? 'checked' : ''}`}
                >
                  {todo.completed && <Check size={16} />}
                </button>
                
                <div className="todo-content">
                  <p className="todo-text">{todo.text}</p>
                  <div className="todo-meta">
                    <span className={`priority-badge ${todo.priority}`}>
                      {todo.priority}
                    </span>
                    <span className="category-badge">{todo.category}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {filteredTodos.length === 0 && (
            <div className="empty-state">
              <p>No tasks {filter !== 'all' ? filter : 'yet'}. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;