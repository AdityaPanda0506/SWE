import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search, ChevronDown, ChevronUp } from 'lucide-react';
import './TodoPage.css';

const initialTodos = [
  { id: 1, text: 'Finalize Q3 marketing report', completed: false, priority: 'high', category: 'Work', dueDate: '2025-07-15' },
  { id: 2, text: 'Schedule team offsite event', completed: false, priority: 'medium', category: 'Work', dueDate: '2025-07-22' },
  { id: 3, text: 'Book flights for vacation', completed: true, priority: 'high', category: 'Personal', dueDate: '2025-06-30' },
  { id: 4, text: 'Renew gym membership', completed: false, priority: 'low', category: 'Personal', dueDate: '2025-08-01' },
  { id: 5, text: 'Update project documentation', completed: false, priority: 'medium', category: 'Work', dueDate: '2025-07-18' },
];

const TodoPage = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTodos = useMemo(() =>
    todos.filter(todo =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    ), [todos, searchTerm]);

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-table-container">
      <header className="todo-table-header">
        <h1>My Tasks</h1>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-task-button">
            <Plus size={16} />
            Add New Task
          </button>
        </div>
      </header>

      <div className="table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th className="col-status">Status</th>
              <th className="col-task">Task</th>
              <th className="col-priority">Priority</th>
              <th className="col-due-date">Due Date</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map(todo => (
              <tr key={todo.id} className={`${todo.completed ? 'completed' : ''}`}>
                <td className="col-status">
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => toggleTodo(todo.id)}
                    className="task-checkbox"
                  />
                </td>
                <td className="col-task">
                  <div className="task-details">
                    <span className="task-text">{todo.text}</span>
                    <span className="task-category">{todo.category}</span>
                  </div>
                </td>
                <td className="col-priority">
                  <span className={`priority-badge ${todo.priority}`}>{todo.priority}</span>
                </td>
                <td className="col-due-date">{todo.dueDate}</td>
                <td className="col-actions">
                  <button className="action-btn edit-btn"><Edit size={16} /></button>
                  <button className="action-btn delete-btn" onClick={() => deleteTodo(todo.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTodos.length === 0 && (
          <div className="empty-state">
            <p>No tasks found. Try a different search or add a new task!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;