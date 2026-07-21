import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';

export const LoadingState = ({ title, height = 200 }) => {
  return (
    <Card sx={{ 
      height: height, 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <CircularProgress aria-label={title || 'Loading'} sx={{ color: '#837F39' }} />
      </CardContent>
    </Card>
  );
};

export const ErrorState = ({ title, error, onRetry }) => {
  return (
    <Card sx={{ 
      height: 200, 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #ffebee'
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#d32f2f' }}>
          {title || 'Error Loading Data'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
          {error || 'Something went wrong while loading the data.'}
        </Typography>
        {onRetry && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#1976d2', 
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': { color: '#1565c0' }
            }}
            onClick={onRetry}
          >
            Try Again
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const NoDataState = ({ title, message, icon: Icon }) => {
  return (
    <Card sx={{ 
      height: 200, 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e3f2fd',
      mb:2
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        {Icon && <Icon sx={{ fontSize: 48, color: '#90caf9', mb: 2 }} />}
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
          {title || 'No Data Available'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {message || 'There is no data to display at the moment.'}
        </Typography>
      </CardContent>
    </Card>
  );
};
