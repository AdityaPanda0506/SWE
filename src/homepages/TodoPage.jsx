import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import './TodoPage.css';

const TodoPage = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Complete project proposal', completed: false },
    { id: 2, text: 'Review team feedback', completed: false },
    { id: 3, text: 'Plan weekend trip', completed: true }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
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

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todo-page">
      <div className="todo-header">
        <h1>Task Manager</h1>
      </div>

      <form className="add-todo-form" onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          <Plus size={20} />
          <span>Add</span>
        </button>
      </form>

      <div className="todo-section">
        <h2>Pending ({pendingTodos.length})</h2>
        <div className="todo-list">
          {pendingTodos.length > 0 ? (
            pendingTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`check-btn ${todo.completed ? 'checked' : ''}`}
                >
                  {todo.completed && <Check size={16} />}
                </button>
                
                <p className="todo-text">{todo.text}</p>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                >
                  <X size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No pending tasks. Great job!</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="todo-section">
        <h2>Completed ({completedTodos.length})</h2>
        <div className="todo-list">
          {completedTodos.length > 0 ? (
            completedTodos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`check-btn ${todo.completed ? 'checked' : ''}`}
                >
                  {todo.completed && <Check size={16} />}
                </button>
                
                <p className="todo-text">{todo.text}</p>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-btn"
                >
                  <X size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks completed yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
