import React, { createContext, useContext, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTaskDashboardData } from '../hooks/useTaskDashboardData';

const DashboardContext = createContext();

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  // Get selected tab from localStorage
  let initialTab = 'me';
  try {
    const storedTab = localStorage.getItem('selectedTab');
    if (storedTab) {
      const parsed = JSON.parse(storedTab);
      if (parsed && parsed.tab) {
        initialTab = parsed.tab;
      }
    }
  } catch (e) {
    // fallback to 'me' if error
  }
  const [dashboardType, setDashboardType] = useState(initialTab);
  const [taskFilter, setTaskFilter] = useState('all');
  const { data, loading, error, refetch } = useDashboardData(dashboardType);
  const { data: taskData, loading: taskLoading, error: taskError, refetch: taskRefetch } = useTaskDashboardData(dashboardType, taskFilter);

  const value = {
    data,
    loading,
    error,
    refetch,
    dashboardType,
    setDashboardType,
    // task dashboard (filtered)
    taskData,
    taskLoading,
    taskError,
    taskRefetch,
    taskFilter,
    setTaskFilter,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
