import React from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  LayoutDashboard,
  FileText,
  Timer,
  CheckSquare,
  Target,
  ArrowRight
} from 'lucide-react';
import './HomePage.css';

const Widget = ({ to, icon, title, description }) => (
  <Link to={to} className="widget">
    <div className="widget-icon">{icon}</div>
    <div className="widget-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <ArrowRight className="widget-arrow" size={20} />
  </Link>
);

const HomePage = () => {
  const widgets = [
    {
      to: '/session',
      icon: <BrainCircuit size={32} />,
      title: 'AI Learning Coach',
      description: 'Start a focused session with AI-powered feedback.'
    },
    {
      to: '/dashboard',
      icon: <LayoutDashboard size={32} />,
      title: 'Dashboard',
      description: 'Review your learning stats and progress over time.'
    },
    {
      to: '/notes',
      icon: <FileText size={32} />,
      title: 'Notes',
      description: 'Capture your thoughts and ideas seamlessly.'
    },
    {
      to: '/pomodoro',
      icon: <Timer size={32} />,
      title: 'Pomodoro Timer',
      description: 'Boost your productivity with focused work intervals.'
    },
    {
      to: '/habits',
      icon: <Target size={32} />,
      title: 'Habit Tracker',
      description: 'Build and maintain positive daily habits.'
    },
    {
      to: '/todo',
      icon: <CheckSquare size={32} />,
      title: 'To-Do List',
      description: 'Organize your tasks and stay on top of your goals.'
    }
  ];

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Your Productivity Hub</h1>
        <p>Everything you need to stay focused, organized, and motivated.</p>
      </header>
      <div className="widget-grid">
        {widgets.map((widget, index) => (
          <Widget
            key={index}
            to={widget.to}
            icon={widget.icon}
            title={widget.title}
            description={widget.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
