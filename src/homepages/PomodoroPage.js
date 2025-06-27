import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import './PomodoroPage.css';

const PomodoroPage = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  useEffect(() => {
    let interval = null;
    
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      setIsActive(false);
      if (!isBreak) {
        setSessions(sessions + 1);
        setIsBreak(true);
        setMinutes(5);
      } else {
        setIsBreak(false);
        setMinutes(25);
      }
      setSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak, sessions]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(isBreak ? 5 : 25);
    setSeconds(0);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-page">
      <nav className="nav-bar">
        <Link to="/" className="nav-link">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </nav>

      <div className="pomodoro-container">
        <div className="pomodoro-card">
          <div className="pomodoro-header">
            {isBreak ? <Coffee size={24} /> : <Brain size={24} />}
            <h1>{isBreak ? 'Break Time' : 'Focus Session'}</h1>
          </div>

          <div className="timer-display">
            <div className="time-text">
              {formatTime(minutes, seconds)}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="timer-controls">
            <button
              onClick={toggleTimer}
              className={`control-btn primary ${isActive ? 'pause' : 'play'}`}
            >
              {isActive ? <Pause size={20} /> : <Play size={20} />}
              {isActive ? 'Pause' : 'Start'}
            </button>
            
            <button onClick={resetTimer} className="control-btn secondary">
              <RotateCcw size={20} />
              Reset
            </button>
          </div>

          <div className="session-counter">
            <p>Sessions completed today: <span className="session-count">{sessions}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;