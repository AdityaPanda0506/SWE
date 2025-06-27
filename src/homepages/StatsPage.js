import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import './StatsPage.css';

const StatsPage = () => {
  const stats = {
    todayFocus: 120,
    weeklyGoal: 600,
    tasksCompleted: 8,
    habitsStreak: 5,
    weeklyTasks: [12, 8, 15, 10, 8, 6, 0]
  };

  const focusProgress = (stats.todayFocus / (stats.weeklyGoal / 7)) * 100;

  return (
    <div className="stats-page">
      <nav className="nav-bar">
        <Link to="/" className="nav-link">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </nav>

      <div className="stats-container">
        <div className="stats-card">
          <div className="stats-header">
            <BarChart3 size={24} />
            <h1>Productivity Analytics</h1>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon orange">
                <Zap size={20} />
              </div>
              <div className="stat-content">
                <h3>Focus Time</h3>
                <p className="stat-value">{stats.todayFocus} min</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${focusProgress}%` }}></div>
                </div>
                <p className="stat-subtitle">Goal: {Math.round(stats.weeklyGoal / 7)}min/day</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon blue">
                <Calendar size={20} />
              </div>
              <div className="stat-content">
                <h3>Tasks Completed</h3>
                <p className="stat-value">{stats.tasksCompleted}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '80%' }}></div>
                </div>
                <p className="stat-subtitle">Great progress today!</p>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon purple">
                <TrendingUp size={20} />
              </div>
              <div className="stat-content">
                <h3>Habit Streak</h3>
                <p className="stat-value">{stats.habitsStreak} days</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                <p className="stat-subtitle">Keep it going! 🔥</p>
              </div>
            </div>
          </div>

          <div className="weekly-overview">
            <h3>This Week's Performance</h3>
            <div className="chart-container">
              <div className="chart">
                {stats.weeklyTasks.map((tasks, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar"
                      style={{ height: `${Math.max((tasks / 15) * 100, 5)}%` }}
                    ></div>
                    <span className="bar-label">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="insights">
            <h3>Weekly Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Most Productive Day</h4>
                <p>Wednesday with 15 tasks</p>
              </div>
              <div className="insight-card">
                <h4>Focus Sessions</h4>
                <p>Average 2.5 hours/day</p>
              </div>
              <div className="insight-card">
                <h4>Improvement</h4>
                <p>+20% vs last week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;