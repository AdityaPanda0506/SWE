import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklyBarChart = ({ sessionHistory }) => {
  const processDataForChart = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = days.map(day => ({
      day,
      studyTime: 0,
      distractions: 0,
    }));

    sessionHistory.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      const dayIndex = entryDate.getDay();
      weeklyData[dayIndex].studyTime += 1; // Each entry is 1 second of study

      if (entry.state === "Tired" || entry.state === "Confused") {
        weeklyData[dayIndex].distractions += 1;
      }
    });

    // Convert study time from seconds to minutes
    weeklyData.forEach(day => {
      day.studyTime = Math.round(day.studyTime / 60);
    });

    return {
      labels: weeklyData.map(d => d.day),
      datasets: [
        {
          label: 'Study Time (minutes)',
          data: weeklyData.map(d => d.studyTime),
          backgroundColor: 'rgba(0, 170, 255, 0.6)',
        },
        {
          label: 'Distractions',
          data: weeklyData.map(d => d.distractions),
          backgroundColor: 'rgba(255, 170, 0, 0.6)',
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Weekly Study Stats',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar options={options} data={processDataForChart()} />;
};

export default WeeklyBarChart;