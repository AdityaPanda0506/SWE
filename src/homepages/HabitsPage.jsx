import React, { useState } from 'react';
import { Target, Plus, Flame } from 'lucide-react';
import './HabitsPage.css';

const HabitsPage = () => {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: 'Read 30 min',
      streak: 5,
      target: 7,
      completed: [true, true, false, true, true, true, false], // Sun -> Sat
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
          // Use getDay() which returns 0 for Sunday, 1 for Monday, etc.
          const todayIndex = new Date().getDay();
          newCompleted[todayIndex] = !newCompleted[todayIndex];

          // Recalculate streak
          let newStreak = 0;
          // Check backwards from today
          for (let i = 0; i < 7; i++) {
            const dayIndex = (todayIndex - i + 7) % 7;
            if (newCompleted[dayIndex]) {
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
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };
  
  const todayIndex = new Date().getDay();

  return (
    <div className="habits-page">
      <div className="habits-header">
        <h1>Daily Habits</h1>
        <button className="add-habit-btn">
          <Plus size={20} />
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
                <Flame size={20} />
                <span>{habit.streak}</span>
              </div>
            </div>

            <div className="habit-tracker">
              {getDayLabels().map((day, index) => (
                <div key={day} className="day-column">
                  <div className="day-label">{day}</div>
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`day-circle ${habit.completed[index] ? 'completed' : ''} ${index === todayIndex ? 'today' : ''}`}
                    disabled={index !== todayIndex}
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
  );
};

export default HabitsPage;
