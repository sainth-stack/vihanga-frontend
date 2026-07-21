import React, { useState } from 'react'
import { useEffect } from 'react';
import MultiSlider, { Progress } from 'react-multi-bar-slider';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';

export default function SliderLarge({
  disabled = false,
  onChange,
  progressStatus = 0,
  percentages = [],
  users = [],
  individualPercentages = [],
  colors = []
}) {
  let threshold = useSelector((store) => store.user.threshold);
  const [progress, setProgress] = useState(0);

  const handleSlide = (newProgress) => {
    if (disabled) return;
    setProgress(newProgress);
    onChange(newProgress);
  }
  const variantColor = () => {
    let color = "lightgray";
    let progressStatus = progress;
    if (threshold) {
      if (Number(progressStatus) > 0 && Number(progressStatus) >= Number(threshold[0].lowValueRange[0].min) && Number(progressStatus) <= Number(threshold[0].lowValueRange[0].max)) {
        color = "red"
      } else if (Number(progressStatus) >= Number(threshold[0].midValueRange[0].min) && Number(progressStatus) <= Number(threshold[0].midValueRange[0].max)) {
        color = "orange"
      } else if (Number(progressStatus) >= Number(threshold[0].highValueRange[0].min) && Number(progressStatus) <= Number(threshold[0].highValueRange[0].max)) {
        color = "green"
      }
    }
    return color;
  }
  useEffect(() => {
    if (progressStatus >= 0) {
      setProgress(progressStatus);
    }
  }, [progressStatus])
  if (!disabled || (percentages.length === 0)) {
    return (
      <MultiSlider
        height={10}
        slidableZoneSize={0}
        backgroundColor="lightgray"
        equalColor={variantColor()}
        onSlide={handleSlide}
        roundedCorners
      >
        <Progress color="green" progress={progress >= 100 ? 100 : progress}>
        </Progress>
      </MultiSlider>
    )
  } else if (disabled) {
    return (
      <div>
        <div className='d-flex w-100' style={{
          height: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          backgroundColor: 'lightgray'
        }}>
          {percentages.map((item, index) => (
            <Tooltip title={
              <React.Fragment>
                <div className='p-1 text-center'>
                  {users[index]}<br />
                  {individualPercentages[index]}%
                </div>
              </React.Fragment>
            } arrow placement='top'>
              <div
                style={{
                  borderRadius: index === 0 ? '5px 0px 0px 5px' : index === percentages.length - 1 ? '0px 5px 5px 0px' : '',
                  width: `${item}%`,
                  backgroundColor: colors[index],
                  cursor: 'pointer'
                }}
              >
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    )
  }
}
