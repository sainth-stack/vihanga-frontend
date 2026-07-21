import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Button, Divider, Grid, Avatar, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';

export default function CelebrationsModal({ 
  open, 
  onClose, 
  title = 'Celebrations', 
  items = [], 
  type = 'birthday' // 'birthday' or 'anniversary'
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysText = (daysUntil) => {
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    return `${daysUntil} days`;
  };

  const getYearsText = (item) => {
    if (type === 'anniversary') {
      const years = item.yearsOfService || 0;
      return years === 1 ? '1 year' : `${years} years`;
    }
    return '';
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#FBF9F2', borderBottom: '1px solid #EAE7DC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {type === 'birthday' ? <CakeIcon sx={{ color: '#837F39' }} /> : <WorkIcon sx={{ color: '#837F39' }} />}
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#FFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {items?.length || 0} {type === 'birthday' ? 'birthdays' : 'anniversaries'}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {(!items || items.length === 0) ? (
          <Typography variant="body2" color="text.secondary">
            No {type === 'birthday' ? 'birthdays' : 'anniversaries'} found
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} key={item.employeeId}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  backgroundColor: type === 'birthday' ? '#FFF3E0' : '#E8F5E8', 
                  p: 2, 
                  borderRadius: '16px', 
                  borderLeft: `5px solid ${type === 'birthday' ? '#FF9800' : '#4CAF50'}` 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={item.avatar} 
                      sx={{ 
                        width: 48, 
                        height: 48,
                        bgcolor: type === 'birthday' ? '#FF9800' : '#4CAF50'
                      }}
                    >
                      {item.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.employeeNumber} • {item.department || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(item.date)}
                        {type === 'anniversary' && ` • ${getYearsText(item)} of service`}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={getDaysText(item.daysUntil)} 
                      size="small"
                      sx={{ 
                        backgroundColor: type === 'birthday' ? '#FF9800' : '#4CAF50', 
                        color: '#fff', 
                        fontWeight: 600,
                        mb: 1
                      }} 
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(item.nextOccurrence || item.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
