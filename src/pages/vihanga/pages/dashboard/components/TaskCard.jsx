import React from 'react';
import { Box, Typography, Chip, Stack, LinearProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function TaskCard({ 
  title, 
  dueDate, 
  kpi, 
  priority, 
  progress, 
  icon: IconComponent, 
  borderColor, 
  cardBg, 
  status,
  onTitleClick,
  ...props 
}) {
  const priorityColors = {
    'High Level': '#DB5930',
    'Medium Level': '#EBBE2E',
    'Low Level': '#837F39',
    High: '#DB5930',
    Medium: '#EBBE2E',
    Low: '#837F39',
  };

  const statusColors = {
    'notstarted': '#DB5930',
    'inprogress': '#EBBE2E',
    'completed': '#837F39',
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: cardBg,
        padding: '12px 16px',
        borderRadius: '16px',
        width: '100%',
        boxSizing: 'border-box',
        borderLeft: `5px solid ${borderColor || '#D95C2C'}`,
      }}
      {...props}
    >
      {/* Left Section */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <img
          src={IconComponent}
          alt="icon"
          style={{ width: "20px", height: "20px" }}
        />

        <Box>
          <Typography 
            variant="subtitle2" 
            fontWeight={600}
            sx={{ cursor: onTitleClick ? 'pointer' : 'default' }}
            onClick={onTitleClick}
          >
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <AccessTimeIcon sx={{ fontSize: 14, color: '#C1A875' }} />
            <Typography variant="caption" sx={{ color: '#C1A875' }}>
              {dueDate}
            </Typography>
            {kpi && (
              <Typography variant="caption" sx={{ color: '#C1A875' }}>
                • KPI : {kpi}
              </Typography>
            )}
          </Stack>
        </Box>
      </Stack>

      {/* Right Section */}
      <Stack direction="row" alignItems="center" justifyContent={"center"} spacing={2}>
        <Chip
          label={priority}
          size="small"
          sx={{
            backgroundColor: priorityColors[priority] || '#D95C2C',
            color: '#fff',
            borderRadius: '1rem',
            fontWeight: 'bold',
            height: '24px',
          }}
        />
        <Stack direction="column" alignItems="center" spacing={1}>
          <Typography variant="caption" fontWeight={500}>
            {progress}%
          </Typography>
          <Box sx={{ width: 80 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: '10px',
                borderRadius: '4px',
                backgroundColor: '#EAE7DC',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: priorityColors[priority] || '#D95C2C',
                },
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
