import React, { createContext, useState, useEffect } from 'react';

export const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [sessionHistory, setSessionHistory] = useState([]);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('sessionHistory')) || [];
      setSessionHistory(savedHistory);
    } catch (error) {
      console.error("Failed to parse session history from localStorage", error);
      setSessionHistory([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  const logData = (data) => {
    const newLogEntry = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    setSessionHistory(prevHistory => [...prevHistory, newLogEntry]);
  };

  const clearHistory = () => {
    setSessionHistory([]);
    localStorage.removeItem('sessionHistory');
  };

  return (
    <StatsContext.Provider value={{ sessionHistory, logData, clearHistory }}>
      {children}
    </StatsContext.Provider>
  );
};
