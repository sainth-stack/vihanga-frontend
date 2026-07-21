//sections

import React from 'react'
import TopKpiCards from './top-kpi-section'
import TaskDashboard from './task-dashboard'
import { Grid } from '@mui/material';
import OKRProgress from './okr-progress/index';
import AttendanceCard from './today-attendance/index';
import PerformanceChartCard from './performance-trend-dashboard/index';
import { BirthdayList } from './birthday-list/index';
import AvailableRewards from './available-rewards/index';
import RecentUpdates from './recent-updates/index';
import AnniversaryList from './anniversary-list';

const AllSections = () => {
  return (
    <>

      <TopKpiCards />
      {/*--------------------------- task top cards--------------------------- */}

      <TaskDashboard />

      {/* ------------------------okr Progress section------------- */}
      <Grid container spacing={2} sx={{ padding: ".5rem 1rem .8rem 1rem" }} alignItems="flex-start">
        <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column" }}>
          <OKRProgress />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column" }}>
          <AttendanceCard />
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: "flex", flexDirection: "column",margin:" 0" }}>
          <PerformanceChartCard />
          <AvailableRewards />
          <RecentUpdates />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column" }} >
          <BirthdayList />
          <AnniversaryList />
        </Grid>
      </Grid>

      {/*--------------------------- Dashboard Section--------------------------- */}

    </>

  )
}

export default AllSections
