import React from 'react';
import { Link } from 'react-router-dom';
import { Home, CheckSquare, Book, Clock, BarChart2, PlayCircle, LayoutDashboard } from 'lucide-react';
import './Dock.css';

const navItems = [
  { to: '/todo', icon: <CheckSquare size={32} />, label: 'Todo' },
  { to: '/notes', icon: <Book size={32} />, label: 'Notes' },
  { to: '/session', icon: <PlayCircle size={32} />, label: 'Session' },
  { to: '/', icon: <Home size={48} />, label: 'Home' },
  { to: '/dashboard', icon: <LayoutDashboard size={32} />, label: 'Dashboard' },
  { to: '/pomodoro', icon: <Clock size={32} />, label: 'Pomodoro' },
  { to: '/stats', icon: <BarChart2 size={32} />, label: 'Stats' },
];

const Dock = () => {
  return (
    <nav className="dock-container">
      <div className="dock">
        {navItems.map((item, index) => (
          <Link to={item.to} key={index} className="dock-item" aria-label={item.label}>
            {item.icon}
            <span className="tooltip">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Dock;
