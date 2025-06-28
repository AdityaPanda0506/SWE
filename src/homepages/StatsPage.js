import React from 'react';
import { BarChart3, TrendingUp, Zap, CheckCircle, Target, Award, Calendar, ChevronDown, Lightbulb } from 'lucide-react';
import './StatsPage.css';

// Mock Data
const mockData = {
  kpis: {
    focusTime: { value: '3h 45m', trend: '+15%' },
    tasksCompleted: { value: 12, trend: '+5%' },
    habitStreak: { value: '8 days', trend: 'same' },
    avgFocusScore: { value: 88, trend: '+3%' },
  },
  focusTrend: [65, 70, 85, 80, 90, 75, 95],
  activity: Array.from({ length: 180 }, () => Math.floor(Math.random() * 5)),
  goals: {
    dailyFocus: { current: 225, goal: 300 },
    weeklyTasks: { current: 45, goal: 50 },
  },
  insights: [
    'You are most productive in the morning. Schedule your most important tasks then.',
    'Your focus drops after 90 minutes. Try taking short breaks.',
    'Consistency is key! You have maintained your reading habit for 8 days straight.',
  ]
};

const KPICard = ({ icon, title, value, trend }) => {
  const trendColor = trend.startsWith('+') ? 'text-green-400' : trend.startsWith('-') ? 'text-red-400' : 'text-gray-400';
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <p className="kpi-title">{title}</p>
        <p className="kpi-value">{value}</p>
      </div>
      <p className={`kpi-trend ${trendColor}`}>{trend}</p>
    </div>
  );
};

const ActivityHeatmap = ({ data }) => (
  <div className="activity-heatmap">
    <div className="heatmap-grid">
      {data.map((level, i) => (
        <div key={i} className="heatmap-cell" data-level={level} />
      ))}
    </div>
  </div>
);

const RadialProgress = ({ percentage, label }) => {
  const strokeDasharray = 2 * Math.PI * 45;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
  return (
    <div className="radial-progress">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" className="progress-bg" />
        <circle cx="50" cy="50" r="45" className="progress-bar" style={{ strokeDasharray, strokeDashoffset }} />
      </svg>
      <div className="progress-text">{percentage}%</div>
      <p className="progress-label">{label}</p>
    </div>
  );
};

const StatsPage = () => {
  return (
    <div className="stats-page-container">
      <header className="stats-header">
        <div className="header-left">
          <BarChart3 size={28} />
          <h1>Your Analytics Dashboard</h1>
        </div>
        <div className="header-right">
          <button className="date-range-btn">
            <span>Last 7 Days</span>
            <ChevronDown size={20} />
          </button>
        </div>
      </header>

      <main className="stats-main-grid">
        <div className="kpi-grid">
          <KPICard icon={<Zap size={24} />} title="Total Focus Time" value={mockData.kpis.focusTime.value} trend={mockData.kpis.focusTime.trend} />
          <KPICard icon={<CheckCircle size={24} />} title="Tasks Completed" value={mockData.kpis.tasksCompleted.value} trend={mockData.kpis.tasksCompleted.trend} />
          <KPICard icon={<Target size={24} />} title="Current Habit Streak" value={mockData.kpis.habitStreak.value} trend={mockData.kpis.habitStreak.trend} />
          <KPICard icon={<Award size={24} />} title="Avg. Focus Score" value={mockData.kpis.avgFocusScore.value} trend={mockData.kpis.avgFocusScore.trend} />
        </div>

        <div className="chart-container">
          <h2>Focus Trend</h2>
          {/* Placeholder for a proper chart library */}
          <div className="line-chart-placeholder">
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M0,50 L50,30 L100,45 L150,25 L200,40 L250,60 L300,50" fill="none" stroke="#8a4fff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="side-panel">
          <div className="panel-widget">
            <h3>Daily Activity</h3>
            <ActivityHeatmap data={mockData.activity} />
          </div>

          <div className="panel-widget">
            <h3>Goal Progress</h3>
            <div className="goals-grid">
              <RadialProgress percentage={Math.round((mockData.goals.dailyFocus.current / mockData.goals.dailyFocus.goal) * 100)} label="Daily Focus" />
              <RadialProgress percentage={Math.round((mockData.goals.weeklyTasks.current / mockData.goals.weeklyTasks.goal) * 100)} label="Weekly Tasks" />
            </div>
          </div>

          <div className="panel-widget">
            <h3>Insights</h3>
            <ul className="insights-list">
              {mockData.insights.slice(0, 2).map((insight, i) => (
                <li key={i}><Lightbulb size={16} /><span>{insight}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatsPage;