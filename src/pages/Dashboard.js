import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, Zap, AlertTriangle, Activity, BrainCircuit } from 'lucide-react';
import './Dashboard.css';
import LineChart from './LineChart'; // Assuming LineChart is in the same folder

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [studyStats, setStudyStats] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sessionHistory")) || [];

    if (stored.length > 0) {
      const totalScore = stored.reduce((sum, entry) => sum + parseFloat(entry.score), 0);
      const avgScore = (totalScore / stored.length);
      const tiredEntries = stored.filter(e => e.state === "Tired" || e.state === "Frustrated").length;
      const confusedEntries = stored.filter(e => e.state === "Confused").length;
      const firstEntryTime = new Date(stored[0].timestamp).getTime();
      const lastEntryTime = new Date(stored[stored.length - 1].timestamp).getTime();
      const totalTimeMinutes = Math.round((lastEntryTime - firstEntryTime) / 60000);

      setStudyStats({
        avgScore: avgScore.toFixed(2),
        tiredEntries,
        confusedEntries,
        totalTimeMinutes,
      });

      const grouped = {};
      stored.forEach(entry => {
        const timestamp = new Date(entry.timestamp).getTime();
        const key = Math.floor(timestamp / (30 * 60 * 1000)) * (30 * 60 * 1000);
        if (!grouped[key]) {
          grouped[key] = { entries: [] };
        }
        grouped[key].entries.push(entry);
      });

      const tableData = Object.keys(grouped).map(key => {
        const group = grouped[key];
        const intervalStart = new Date(parseInt(key)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const intervalEnd = new Date(parseInt(key) + 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const scores = group.entries.map(e => parseFloat(e.score));
        const emotions = group.entries.map(e => e.emotion);
        const states = group.entries.map(e => e.state);

        return {
          interval: `${intervalStart} - ${intervalEnd}`,
          avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
          mostCommonEmotion: mode(emotions),
          mostCommonState: mode(states),
        };
      });

      setHistory(tableData);
    }
  }, []);

  const mode = (arr) => arr.sort((a, b) => arr.filter(v => v === a).length - arr.filter(v => v === b).length).pop() || 'N/A';

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
          <SummaryCard icon={<Zap size={24} />} title="Average Focus Score" value={studyStats.avgScore || '0'} unit="/ 10" color="#00aaff" />
          <SummaryCard icon={<Clock size={24} />} title="Total Study Time" value={studyStats.totalTimeMinutes || '0'} unit="mins" color="#33cc33" />
          <SummaryCard icon={<AlertTriangle size={24} />} title="Distraction Alerts" value={studyStats.tiredEntries || '0'} unit="times" color="#ffaa00" />
          <SummaryCard icon={<BrainCircuit size={24} />} title="Confusion Alerts" value={studyStats.confusedEntries || '0'} unit="times" color="#ff4d4d" />
        </div>

        <div className="chart-container">
          <div className="container-header">
            <Activity size={22} />
            <h2>Focus Over Time</h2>
          </div>
          {history.length > 0 ? <LineChart data={history} /> : <p className="no-data">No data to display.</p>}
        </div>

        <div className="log-container">
          <div className="container-header">
            <BrainCircuit size={22} />
            <h2>Session Log</h2>
          </div>
          {history.length > 0 ? (
            <table className="log-table">
              <thead>
                <tr>
                  <th>Time Interval</th>
                  <th>Avg. Focus</th>
                  <th>Dominant Emotion</th>
                  <th>Dominant State</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, i) => (
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