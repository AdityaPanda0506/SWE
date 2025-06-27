import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="page home">
      {/* Hero Section */}
      <section className="hero">
        <h1>🧠 AI Learning Coach</h1>
        <p className="subtitle">
          Track your emotions via webcam and get personalized suggestions for better learning.
        </p>
        <Link to="/session">
          <button className="primary-button">Start Learning Session</button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="features-grid">
        <Link to="/pomodoro" className="feature-card">
          <div className="card-icon">🍅</div>
          <h3>Pomodoro Timer</h3>
          <p>Stay focused with scientifically proven time blocks.</p>
        </Link>

        <Link to="/todos" className="feature-card">
          <div className="card-icon">✅</div>
          <h3>Todo List</h3>
          <p>Organize your tasks and track progress efficiently.</p>
        </Link>

        <Link to="/habits" className="feature-card">
          <div className="card-icon">📈</div>
          <h3>Habit Tracker</h3>
          <p>Build consistency with daily habit tracking.</p>
        </Link>

        <Link to="/notes" className="feature-card">
          <div className="card-icon">📝</div>
          <h3>Notes</h3>
          <p>Take and organize notes as you study.</p>
        </Link>

        <Link to="/stats" className="feature-card">
          <div className="card-icon">📊</div>
          <h3>Stats</h3>
          <p>See how your focus and emotions evolve over time.</p>
        </Link>
      </section>
    </div>
  );
}