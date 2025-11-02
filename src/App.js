import React from 'react';
import { Routes, Route } from 'react-router-dom';

// New Components
import HomePage from './homepages/HomePage.jsx';
import Dock from './components/Dock.jsx';

// Page Components
import PomodoroPage from './homepages/PomodoroPage.jsx';
import TodoPage from './homepages/TodoPage';
import HabitsPage from './homepages/HabitsPage';
import NotesPage from './homepages/NotesPage';
import StatsPage from './homepages/StatsPage';
import Session from './pages/Session';
import Dashboard from './pages/Dashboard';

import './App.css';
import { NotesProvider } from './contexts/NotesContext';
import { StatsProvider } from './contexts/StatsContext';
import { TodoProvider } from './contexts/TodoContext';

function App() {
  return (
    <NotesProvider>
      <StatsProvider>
        <TodoProvider>
          <div className="app-container">
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pomodoro" element={<PomodoroPage />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/session" element={<Session />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <Dock />
          </div>
        </TodoProvider>
      </StatsProvider>
    </NotesProvider>
  );
}

export default App;