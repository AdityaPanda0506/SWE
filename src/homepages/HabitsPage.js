import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Target, Plus, Flame } from 'lucide-react';
import './HabitsPage.css';

const HabitsPage = () => {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Read 30 min',
      streak: 5,
      target: 7,
      completed: [true, true, false, true, true, true, false],
      icon: '📚'
    },
    {
      id: 2,
      name: 'Exercise',
      streak: 3,
      target: 5,
      completed: [true, false, true, true, false, true, false],
      icon: '💪'
    },
    {
      id: 3,
      name: 'Meditate',
      streak: 7,
      target: 7,
      completed: [true, true, true, true, true, true, true],
      icon: '🧘'
    }
  ]);

  const toggleHabitToday = (id) => {
    setHabits(
      habits.map(habit => {
        if (habit.id === id) {
          const newCompleted = [...habit.completed];
          const today = 6;
          newCompleted[today] = !newCompleted[today];

          let newStreak = 0;
          for (let i = newCompleted.length - 1; i >= 0; i--) {
            if (newCompleted[i]) {
              newStreak++;
            } else {
              break;
            }
          }

          return { ...habit, completed: newCompleted, streak: newStreak };
        }
        return habit;
      })
    );
  };

  const getDayLabels = () => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  };

  return (
    <div className="habits-page">
      <nav className="nav-bar">
        <Link to="/" className="nav-link">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </nav>

      <div className="habits-container">
        <div className="habits-card">
          <div className="habits-header">
            <div className="header-title">
              <Target size={24} />
              <h1>Daily Habits</h1>
            </div>
            <button className="add-habit-btn">
              <Plus size={16} />
              Add Habit
            </button>
          </div>

          <div className="habits-list">
            {habits.map(habit => (
              <div key={habit.id} className="habit-item">
                <div className="habit-info">
                  <div className="habit-title">
                    <span className="habit-icon">{habit.icon}</span>
                    <span className="habit-name">{habit.name}</span>
                  </div>
                  <div className="habit-streak">
                    <Flame size={16} />
                    <span>{habit.streak}</span>
                  </div>
                </div>

                <div className="habit-tracker">
                  {getDayLabels().map((day, index) => (
                    <div key={day} className="day-column">
                      <div className="day-label">{day}</div>
                      <button
                        onClick={() => index === 6 && toggleHabitToday(habit.id)}
                        className={`day-circle ${habit.completed[index] ? 'completed' : ''} ${index === 6 ? 'today' : ''}`}
                      ></button>
                    </div>
                  ))}
                </div>

                <div className="habit-progress">
                  <div className="progress-info">
                    <span>Weekly Progress</span>
                    <span>{habit.completed.filter(Boolean).length}/{habit.target}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(habit.completed.filter(Boolean).length / habit.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;