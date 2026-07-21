import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import AllSections from "./sections";

const Dashboard = () => {
  return (
    <DashboardProvider>
      <AllSections />
    </DashboardProvider>
  );
};

export default Dashboard;