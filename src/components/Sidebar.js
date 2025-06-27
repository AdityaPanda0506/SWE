import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Timer, CheckSquare, Repeat, FileText, BarChart2, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { to: '/', icon: <Home size={20} />, text: 'Home' },
    { to: '/session', icon: <PlayCircle size={20} />, text: 'Session' },
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/pomodoro', icon: <Timer size={20} />, text: 'Pomodoro' },
    { to: '/todos', icon: <CheckSquare size={20} />, text: 'Todo List' },
    { to: '/habits', icon: <Repeat size={20} />, text: 'Habits' },
    { to: '/notes', icon: <FileText size={20} />, text: 'Notes' },
    { to: '/stats', icon: <BarChart2 size={20} />, text: 'Stats' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="logo-text">{!isCollapsed && 'FocusFlow'}</h1>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="nav-item" activeClassName="active">
            <div className="nav-icon">{item.icon}</div>
            {!isCollapsed && <span className="nav-text">{item.text}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
