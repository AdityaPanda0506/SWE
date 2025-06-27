import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import './PomodoroPage.css';

const PomodoroPage = () => {
  const modes = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  };

  const [mode, setMode] = useState('pomodoro');
  const [minutes, setMinutes] = useState(modes[mode]);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  const totalSeconds = modes[mode] * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * circumference;
  const progressOffset = circumference - progress;

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setIsActive(false);
    setMinutes(modes[newMode]);
    setSeconds(0);
  }, [modes]);

  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      if (mode === 'pomodoro') {
        const newSessions = sessions + 1;
        setSessions(newSessions);
        switchMode(newSessions % 4 === 0 ? 'longBreak' : 'shortBreak');
      } else {
        switchMode('pomodoro');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode, sessions, switchMode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    switchMode(mode);
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-page">
      <div className="pomodoro-container">
        <div className="timer-mode">
          <button onClick={() => switchMode('pomodoro')} className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}>Focus</button>
          <button onClick={() => switchMode('shortBreak')} className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}>Short Break</button>
          <button onClick={() => switchMode('longBreak')} className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}>Long Break</button>
        </div>

        <div className="timer-display">
          <svg className="timer-svg" width="250" height="250" viewBox="0 0 250 250">
            <defs>
              <linearGradient id="progress-gradient">
                <stop offset="0%" stopColor="var(--primary-color)" />
                <stop offset="100%" stopColor="var(--secondary-color)" />
              </linearGradient>
            </defs>
            <circle className="timer-circle background" cx="125" cy="125" r={radius} />
            <circle
              className="timer-circle progress"
              cx="125"
              cy="125"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
            />
          </svg>
          <div className="time-text">{formatTime(minutes, seconds)}</div>
        </div>

        <div className="timer-controls">
          <button onClick={toggleTimer} className="control-btn primary">
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer} className="control-btn secondary">
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        <div className="session-counter">
          <p>Completed Sessions: {sessions}</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;
