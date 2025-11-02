import React, { useContext, useMemo } from 'react';
import { BarChart3, Zap, CheckCircle, Target, Award, Lightbulb, ChevronDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './StatsPage.css';
import { StatsContext } from '../contexts/StatsContext';
import { TodoContext } from '../contexts/TodoContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- Helper Components from the original UI ---

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
      {data.map(({ date, level }) => (
        <div key={date} className="heatmap-cell" data-level={level} title={`${date}: ${level} hours`} />
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


// --- Main StatsPage Component ---

const StatsPage = () => {
  const { sessionHistory } = useContext(StatsContext);
  const { tasks } = useContext(TodoContext);

  const { dailyStats, focusTrend, activityData } = useMemo(() => {
    const statsByDate = {};

    (sessionHistory || []).forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (!statsByDate[date]) {
        statsByDate[date] = { scoreSum: 0, count: 0 };
      }
      statsByDate[date].scoreSum += log.score;
      statsByDate[date].count += 1; // Each log is 1 second
    });

    const sortedDates = Object.keys(statsByDate).sort();

    // Data for Focus Trend (last 7 days with activity)
    const lastSevenActiveDays = sortedDates.slice(-7);
    const focusTrendData = {
      labels: lastSevenActiveDays.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Average Focus Score',
          data: lastSevenActiveDays.map(d => (statsByDate[d].scoreSum / statsByDate[d].count)),
          borderColor: '#8a4fff',
          backgroundColor: 'rgba(138, 79, 255, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // Data for Activity Heatmap (last 180 days)
    const heatmapData = [];
    const today = new Date();
    for (let i = 179; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayData = statsByDate[dateString];
      const studyHours = dayData ? dayData.count / 3600 : 0;
      heatmapData.push({
        date: dateString,
        level: Math.min(4, Math.ceil(studyHours)), // Levels 0-4
      });
    }

    return { dailyStats: statsByDate, focusTrend: focusTrendData, activityData: heatmapData };
  }, [sessionHistory]);


  // --- Calculate overall KPIs ---
  const totalFocusSeconds = sessionHistory?.length || 0;
  const hours = Math.floor(totalFocusSeconds / 3600);
  const minutes = Math.floor((totalFocusSeconds % 3600) / 60);
  const focusTimeStr = `${hours}h ${minutes}m`;

  const tasksCompleted = tasks?.filter(task => task.completed).length || 0;

  const avgFocusScoreRaw = totalFocusSeconds > 0
    ? sessionHistory.reduce((sum, entry) => sum + entry.score, 0) / totalFocusSeconds
    : 0;
  const avgFocusScorePercent = Math.round((avgFocusScoreRaw / 6) * 100);

  // --- Mock/Placeholder Data for UI elements without context ---
  const mockData = {
    habitStreak: { value: '8 days', trend: 'same' }, // Placeholder
    goals: {
      dailyFocus: { current: totalFocusSeconds / 60, goal: 300 }, // Dynamic current, static goal
      weeklyTasks: { current: tasksCompleted, goal: 50 }, // Dynamic current, static goal
    },
    insights: [ // Placeholder
      'You are most productive in the morning.',
      'Your focus drops after 90 minutes. Try taking short breaks.',
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 6,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#9ca3af' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' },
      },
    },
  };

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
          <KPICard icon={<Zap size={24} />} title="Total Focus Time" value={focusTimeStr} trend="+0%" />
          <KPICard icon={<CheckCircle size={24} />} title="Tasks Completed" value={tasksCompleted} trend="+0%" />
          <KPICard icon={<Target size={24} />} title="Current Habit Streak" value={mockData.habitStreak.value} trend={mockData.habitStreak.trend} />
          <KPICard icon={<Award size={24} />} title="Avg. Focus Score" value={`${avgFocusScorePercent}%`} trend="+0%" />
        </div>

        <div className="chart-container">
          <h2>Focus Trend</h2>
          <div className="line-chart-container">
            <Line options={chartOptions} data={focusTrend} />
          </div>
        </div>

        <div className="side-panel">
          <div className="panel-widget">
            <h3>Daily Activity</h3>
            <ActivityHeatmap data={activityData} />
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
              {mockData.insights.map((insight, i) => (
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