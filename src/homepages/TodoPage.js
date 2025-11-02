import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import './TodoPage.css';

const initialTodos = [
  { id: 1, text: 'Finalize Q3 marketing report', completed: false, priority: 'high', category: 'Work', dueDate: '2025-07-15' },
  { id: 2, text: 'Schedule team offsite event', completed: false, priority: 'medium', category: 'Work', dueDate: '2025-07-22' },
  { id: 3, text: 'Book flights for vacation', completed: true, priority: 'high', category: 'Personal', dueDate: '2025-06-30' },
];

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState(task);

  React.useEffect(() => {
    setFormData(task);
  }, [task]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task.id ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task</label>
            <input type="text" name="text" value={formData.text} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TodoPage = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

  const handleOpenModal = (task = null) => {
    setEditingTask(task || { text: '', priority: 'medium', category: '', dueDate: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      setTodos(todos.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTodos([...todos, { ...taskData, id: Date.now(), completed: false }]);
    }
    handleCloseModal();
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
          <button className="add-task-button" onClick={() => handleOpenModal()}>
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
                  <button className="action-btn edit-btn" onClick={() => handleOpenModal(todo)}><Edit size={16} /></button>
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

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveTask} 
        task={editingTask || { text: '', priority: 'medium', category: '', dueDate: '' }}
      />
    </div>
  );
};

export default TodoPage;