// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Session from './pages/Session';
import Dashboard from './pages/Dashboard';
import PomodoroPage from './homepages/PomodoroPage.jsx';
import TodoPage from './homepages/TodoPage';
import HabitsPage from './homepages/HabitsPage';
import NotesPage from './homepages/NotesPage';
import StatsPage from './homepages/StatsPage';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session" element={<Session />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/todos" element={<TodoPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;