import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';


export const MuiStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    // top: 10,
    left: 'calc(-50% + 30px)',
    right: 'calc(50% + 30px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#e9e9ef',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#e9e9ef',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#e9e9ef',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));


export const MuiStepIconRoot = styled('div')(({ theme, ownerState }) => ({
      color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
      display: 'flex',
      height: 22,
      alignItems: 'center',
      ...(ownerState.active && {
        color: '#784af4',
      }),
      '& .StepIcon-completedIcon': {
        color: 'white',
        zIndex: 1,
        fontSize: 20,
        position: "relative",
        bottom: "13px"
      },
      '& .StepIcon-circle': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
      },
      '& .StepIcon-numeric': {
        width: '30px',
        height: '30px',
        lineHeight: '56px',
        fontSize: '20px',
        textAlign: 'center',
        color: 'white',
        border: '1px solid rgba(28,132,238,.2)',
        borderRadius: '50%',
        cursor: "pointer"
      },
      '& .StepIcon-numeric-active':{
        backgroundColor: '#837F39',
        borderColor: '#837F39',
        color: 'white'
      },
      '& .step-arrows-active': {
        position: "relative",
        bottom: "48px"
      }
    }),
  );

  export const MuiStepIconBasedRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
    }),
  }));

