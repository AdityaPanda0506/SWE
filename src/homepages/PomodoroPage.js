import React, { useState, useEffect, useContext } from 'react';
import { Settings, Plus, Play, Pause, RotateCcw } from 'lucide-react';
import { TodoContext } from '../contexts/TodoContext';
import './PomodoroPage.css';

const PomodoroPage = () => {
  const { todos, addTodo } = useContext(TodoContext);
  
  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [minutes, setMinutes] = useState(settings.pomodoro);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            // Simple browser notification
            alert(`${mode.replace(/([A-Z])/g, ' $1').trim()} session is over!`);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    // Update document title with the time
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - Focus App`;

    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(settings[mode]);
    setSeconds(0);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setMinutes(settings[newMode]);
    setSeconds(0);
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const applySettings = () => {
    setShowSettings(false);
    // Re-apply current mode with new settings
    setMinutes(settings[mode]);
    setSeconds(0);
    setIsActive(false);
  }

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      addTodo({ text: newTask, completed: false });
      setNewTask('');
    }
  };

  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-main">
        <div className="timer-card">
          <div className="timer-modes">
            <button onClick={() => switchMode('pomodoro')} className={mode === 'pomodoro' ? 'active' : ''}>Pomodoro</button>
            <button onClick={() => switchMode('shortBreak')} className={mode === 'shortBreak' ? 'active' : ''}>Short Break</button>
            <button onClick={() => switchMode('longBreak')} className={mode === 'longBreak' ? 'active' : ''}>Long Break</button>
          </div>
          <div className="timer-display">{timeDisplay}</div>
          <p className="task-focusing">{selectedTask ? `Focusing on: ${todos.find(t => t.id === selectedTask)?.text}` : "Select a task to begin"}</p>
          <div className="timer-controls">
            <button onClick={toggleTimer} className="start-btn" data-mode={mode}>
              {isActive ? <Pause size={24} /> : <Play size={24} />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </button>
            <button onClick={resetTimer} className="reset-btn"><RotateCcw size={20} /></button>
          </div>
        </div>
        <div className="task-card">
          <h3>Focus on a Task</h3>
          <div className="task-selection">
            <div className="task-list">
              {todos.filter(t => !t.completed).length > 0 ? (
                todos.filter(t => !t.completed).map(todo => (
                  <div 
                    key={todo.id} 
                    className={`task-item ${selectedTask === todo.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTask(todo.id)}
                  >
                    {todo.text}
                  </div>
                ))
              ) : (
                <p className="no-tasks">No active tasks. Add one below!</p>
              )}
            </div>
            <form onSubmit={handleAddTask} className="add-task-form">
              <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
              />
              <button type="submit"><Plus size={20} /></button>
            </form>
          </div>
        </div>
      </div>
      <div className="pomodoro-sidebar">
        <button onClick={() => setShowSettings(true)} className="settings-btn">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>

      {showSettings && (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Timer Settings</h2>
            <div className="settings-group">
              <label>Pomodoro (min)</label>
              <input type="number" name="pomodoro" value={settings.pomodoro} onChange={handleSettingsChange} />
            </div>
            <div className="settings-group">
              <label>Short Break (min)</label>
              <input type="number" name="shortBreak" value={settings.shortBreak} onChange={handleSettingsChange} />
            </div>
            <div className="settings-group">
              <label>Long Break (min)</label>
              <input type="number" name="longBreak" value={settings.longBreak} onChange={handleSettingsChange} />
            </div>
            <button onClick={applySettings} className="apply-btn">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroPage;