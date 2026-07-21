import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const InfoCardHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  buttonColor = '#827b37',
  buttonIcon = null,
  buttonTextColor = '#FFFFFF',
  buttonBorder = 'none',
}) => {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={2}
        sx={{
          backgroundColor: '#ffffff',
          padding: '10px 0px',
          margin: '0px 10px',
        }}
      >
        {/* Title & Subtitle */}
        <Box sx={{ display: 'flex', gap: '15px', flexDirection: 'column', backgroundColor: '#FFFFFF', padding: '12px 16px', borderRadius: '8px' }}>
          <Typography
            sx={{
              color: '#1a1a1a',
              fontWeight: 500,
              fontSize: '28px',
              fontFamily: 'Montserrat',
              letterSpacing: '-0.5px',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: '#707070',
              fontWeight: 500,
              fontSize: '16px',
              fontFamily: 'Work Sans',
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Button */}
        <Button
          variant="contained"
          onClick={onButtonClick}
          startIcon={buttonIcon}
          sx={{
            fontFamily: 'Work Sans',
            fontWeight: 500,
            borderRadius: '100px',
            fontSize: '16px',
            textTransform: "none",
            px: 3,
            backgroundColor: buttonColor,
            color: buttonTextColor,
            border: buttonBorder,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: buttonColor,
              opacity: 0.9,
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default InfoCardHeader;
