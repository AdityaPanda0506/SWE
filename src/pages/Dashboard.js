import React, { useContext, useMemo } from 'react';
import { BarChart3, Clock, Zap, AlertTriangle, Activity, BrainCircuit } from 'lucide-react';
import './Dashboard.css';
import WeeklyBarChart from './WeeklyBarChart';
import { StatsContext } from '../contexts/StatsContext';

const Dashboard = () => {
  const { sessionHistory, clearHistory } = useContext(StatsContext);

  const studyStats = useMemo(() => {
    if (sessionHistory.length === 0) {
      return {
        avgScore: '0',
        totalTimeMinutes: '0',
        distractionEntries: '0',
        confusionEntries: '0',
      };
    }

    const totalScore = sessionHistory.reduce((sum, entry) => sum + parseFloat(entry.score), 0);
    const avgScore = (totalScore / sessionHistory.length);
    const distractionEntries = sessionHistory.filter(e => e.state === "Tired" || e.state === "Frustrated").length;
    const confusionEntries = sessionHistory.filter(e => e.state === "Confused").length;
    const totalTimeMinutes = Math.round(sessionHistory.length / 60);

    return {
      avgScore: avgScore.toFixed(2),
      totalTimeMinutes,
      distractionEntries,
      confusionEntries,
    };
  }, [sessionHistory]);

  const sessionLog = useMemo(() => {
    const grouped = {};
    sessionHistory.forEach(entry => {
      const timestamp = new Date(entry.timestamp).getTime();
      const key = Math.floor(timestamp / (5 * 60 * 1000)) * (5 * 60 * 1000); // Group by 5-minute intervals
      if (!grouped[key]) {
        grouped[key] = { entries: [] };
      }
      grouped[key].entries.push(entry);
    });

    const mode = (arr) => arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop() || 'N/A';

    return Object.keys(grouped).map(key => {
      const group = grouped[key];
      const intervalStart = new Date(parseInt(key)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const scores = group.entries.map(e => parseFloat(e.score));
      const emotions = group.entries.map(e => e.emotion);
      const states = group.entries.map(e => e.state);

      return {
        interval: intervalStart,
        avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
        mostCommonEmotion: mode(emotions),
        mostCommonState: mode(states),
      };
    }).reverse();
  }, [sessionHistory]);

  const SummaryCard = ({ icon, title, value, unit, color }) => (
    <div className="summary-card" style={{ '--card-color': color }}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <p className="card-value">{value} <span className="card-unit">{unit}</span></p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <BarChart3 size={32} />
        <h1>Your Learning Dashboard</h1>
      </header>

      <div className="dashboard-grid">
        <div className="summary-card-grid">
          <SummaryCard icon={<Zap size={24} />} title="Average Focus Score" value={studyStats.avgScore} unit="/ 6" color="#00aaff" />
          <SummaryCard icon={<Clock size={24} />} title="Total Study Time" value={studyStats.totalTimeMinutes} unit="mins" color="#33cc33" />
          <SummaryCard icon={<AlertTriangle size={24} />} title="Distraction Alerts" value={studyStats.distractionEntries} unit="times" color="#ffaa00" />
          <SummaryCard icon={<BrainCircuit size={24} />} title="Confusion Alerts" value={studyStats.confusionEntries} unit="times" color="#ff4d4d" />
        </div>

        <div className="chart-container">
          <div className="container-header">
            <Activity size={22} />
            <h2>Weekly Progress</h2>
          </div>
          {sessionHistory.length > 0 ? <WeeklyBarChart sessionHistory={sessionHistory} /> : <p className="no-data">No data to display. Start a session to see your stats!</p>}
        </div>

        <div className="log-container">
          <div className="container-header">
            <BrainCircuit size={22} />
            <h2>Session Log</h2>
          </div>
          {sessionLog.length > 0 ? (
            <table className="log-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Avg. Focus</th>
                  <th>Dominant Emotion</th>
                  <th>Dominant State</th>
                </tr>
              </thead>
              <tbody>
                {sessionLog.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry.interval}</td>
                    <td>{entry.avgScore}</td>
                    <td>{entry.mostCommonEmotion}</td>
                    <td>{entry.mostCommonState}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="no-data">No session logs available.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;