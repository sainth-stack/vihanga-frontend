import CardWidget from 'pages/vihanga/components/Cards/CardWidget';
import React from 'react';
import TaskCards from './Sections/TopCards';
import { Box, Grid } from '@mui/material';
import Header from 'pages/vihanga/pages/board/components/Header';
import TaskProgressCard from './Sections/TaskProgress';
import DashboardRewardLeaderboard from '../reward-points-leaderboard';
import { useDashboardContext } from '../../context/DashboardContext';
import { LoadingState, ErrorState, NoDataState } from '../../components/LoadingState';

const TaskDashboard = () => {
  const { data, loading, error, refetch } = useDashboardContext();

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ margin: '.8rem .8rem 0 .8rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <LoadingState title="Loading Task Dashboard..." height={400} />
          </Grid>
          <Grid item xs={12} md={4}>
            <LoadingState title="Loading Leaderboard..." height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ margin: '.8rem .8rem 0 .8rem' }}>
        <ErrorState 
          title="Failed to Load Task Dashboard" 
          error={error} 
          onRetry={refetch}
        />
      </Box>
    );
  }

  // Show no data state
  if (!data || !data.tasksDashboard) {
    return (
      <Box sx={{ margin: '.8rem .8rem 0 .8rem' }}>
        <NoDataState 
          title="No Task Data Available" 
          message="Task dashboard information is not available at the moment."
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: '.8rem .8rem 0 .8rem',
        borderRadius: '16px',
        paddingBottom: '10px',
        display: 'flex',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: 'stretch', // Make children stretch vertically
        }}
      >
        {/* Left side - Task Dashboard */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CardWidget
            sx={{
              height: '100%', // CardWidget takes full height
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TaskCards />
            <TaskProgressCard />
          </CardWidget>
        </Grid>

        {/* Right side - Leaderboard */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <DashboardRewardLeaderboard />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskDashboard;
