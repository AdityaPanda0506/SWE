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
        <div className="pomodoro-modes">
          <button onClick={() => switchMode('pomodoro')} className={`mode-btn ${mode === 'pomodoro' ? 'active' : ''}`}>Focus</button>
          <button onClick={() => switchMode('shortBreak')} className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}>Short Break</button>
          <button onClick={() => switchMode('longBreak')} className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}>Long Break</button>
        </div>

        <div className="pomodoro-timer">
          <svg width="250" height="250" viewBox="0 0 250 250">
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6D28D9" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
            <circle className="timer-background" cx="125" cy="125" r={radius} />
            <circle
              className="timer-progress"
              cx="125"
              cy="125"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={progress}
            />
          </svg>
          <div className="pomodoro-time">{formatTime(minutes, seconds)}</div>
        </div>

        <div className="pomodoro-controls">
          <button onClick={toggleTimer} className="control-btn primary">
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>
          <button onClick={resetTimer} className="control-btn">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="pomodoro-sessions">
          <p>Completed Sessions: <strong>{sessions}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroPage;
