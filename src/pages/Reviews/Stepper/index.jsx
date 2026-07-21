import React from 'react';
import { Stepper as MuiStepper, Step, StepLabel } from '@mui/material';
import filledDownArrow from "assets/svg/filledDownArrow.svg";
import filledUpArrow from "assets/svg/filledUpArrow.svg";
import { MuiStepConnector, MuiStepIconBasedRoot, MuiStepIconRoot } from './style';

const Stepper = ({ steps = [], children, sx, icons, isIconStepper, setActiveStep = () => { }, activeStep, handleNext, handleBack }) => {
  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleKeyDown = (step) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setActiveStep(step);
    }
  };

  const StepIcon = (props) => {
    const { active, completed, className } = props;
    return (
      <MuiStepIconRoot ownerState={{ active }} className={className}>
        <div className={`StepIcon-numeric ${completed || active ? 'StepIcon-numeric-active' : ''}`}>
          {completed || active ? (<i className="fa fa-check StepIcon-completedIcon" />) : (<></>)}
        </div>
      </MuiStepIconRoot>
    );
  }

  const MuiBasedStepIcon = (props) => {
    const { active, completed, className } = props;
    const icons = {
      1: <i className='fa fa-settings' />,
      2: <i className='fa fa-users-plus' />,
      3: <i className='fa fa-window-maximize' />,
    };
    return (
      <MuiStepIconBasedRoot ownerState={{ completed, active }} className={className}>
        {icons[props.icon]}
      </MuiStepIconBasedRoot>
    );
  }

  return <>
    <MuiStepper sx={{ ...sx }} alternativeLabel activeStep={activeStep} connector={<MuiStepConnector />}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel
            tabIndex={0}
            onClick={handleStep(index)}
            onKeyDown={handleKeyDown(index)}
            sx={index % 2 === 0 ? {
              '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': { paddingTop: "0px", marginTop: "0px" },
            } : {
              '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': { position: "relative", bottom: "98px", marginTop: "0px" },
            }}
            StepIconComponent={isIconStepper ? MuiBasedStepIcon : StepIcon}
          >
            <div className={index % 2 === 0 ? `step-arrows-even` : `step-arrows-odd`}>
              {index % 2 === 0 ? <img src={filledDownArrow} alt="filled" /> : <img src={filledUpArrow} alt="not filled" />}
            </div>
            {step.label === "Submit" ? "Self Submission" : step.label}
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  </>
}

export default Stepper;