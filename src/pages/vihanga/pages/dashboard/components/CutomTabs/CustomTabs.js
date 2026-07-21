import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export default function CustomTabs({ value, onChange, tabs = [] }) {
  // Default tabs if none provided
  const defaultTabs = [
    { value: 'company', label: 'COMPANY' },
    { value: 'rtl', label: 'RTL' }
  ];
  
  const tabsToRender = tabs.length > 0 ? tabs : defaultTabs;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs
        value={value}
        onChange={onChange}
        aria-label="Reward Leaderboard Tabs"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: '14px',
            minWidth: 'auto',
            mr: 3,
            color: 'rgba(0, 0, 0, 0.5)',
          },
          '& .Mui-selected': {
            color: '#836F39', // Active Tab color (brownish-gold)
          },
            '& .MuiTabs-indicator': {
                backgroundColor: '#836F39', // Underline color
            },
            ':hover': {
              color: '#836F39', // Hover color for tabs
            },
        }}
        TabIndicatorProps={{
          style: {
            backgroundColor: '#836F39', // Underline color
            height: '2px',
          },
        }}
      >
        {tabsToRender.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
}
