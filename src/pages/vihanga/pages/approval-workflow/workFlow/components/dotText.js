import React from 'react';
import { Box, Typography } from '@mui/material';

const DotHeading = ({ text, dotColor = '#BEA781' }) => {
  return (
    <Box display="flex" alignItems="center" sx={{ml:"40px"}}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: dotColor,
          mr: 1.5,
        }}
      />
      <Typography  sx={{color:"#0E0E0E",fontFamily:"Montserrat", fontWeight:"600",fontSize:"16px",color:'#0E0E0E'}}>
        {text}
      </Typography>
    </Box>
  );
};

export default DotHeading;
