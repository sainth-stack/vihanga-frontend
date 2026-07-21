import React from 'react';
import InfoCardHeader from '../../components/header';
import DotHeading from '../../components/dotText';
import { Box, Paper } from '@mui/material';
import StepperCardGroup from '../../components/steperGroup/steperCardGroup';
import Fotter from '../../components/fotter';

const steps = [
  { label: 'Line Manager', initial: 'J' },
 
 
];

const Card3 = ({ sx = {} }) => {
  const handleLeaveRequest = () => {
    console.log('Leave Request clicked');
  };

  return (
    <Paper
      sx={{
        p: 2,
        m: 2, // padding on all sides
        borderRadius: "16px",
        backgroundColor: "fffff",
        boxSizing: "border-box",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        ...sx, // merge external styles
      }}
    >
      <Box>
        <InfoCardHeader
          title="Timesheet Approval"
          subtitle="Approval Process for Leave (more than 1 week)"
          buttonText="Timesheet"
          onButtonClick={handleLeaveRequest}
        />

        <DotHeading text="Approval Flow" />

        <Box sx={{ mt: 1 }}>
          <StepperCardGroup steps={steps} />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Fotter
            createdDate="23 Mar 2025"
            onEdit={() => console.log("Edit clicked")}
            onDelete={() => console.log("Delete clicked")}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Card3;
