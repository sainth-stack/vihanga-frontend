import React, { useState } from 'react'
import MultiSlider, { Progress } from 'react-multi-bar-slider';
export default function Slider(props) {
  const [progress, setProgress] = useState(props.progressStatus ? props.progressStatus : 0);
  const handleSlide = newProgress => {
    if (!props.disabled) {
      setProgress(newProgress);
      props.onChange(newProgress);
    }
  }
  const variantColor = () => {
    let color = "red";
    if (progress > 0 && progress <= parseInt(props.bronze / 10)) {
      color = "red"
    } else if (progress > (parseInt(props.bronze / 10)) && progress <= parseInt(props.silver / 10)) {
      color = "orange"
    } else if (progress > parseInt(props.silver / 10)) {
      color = "green"
    }
    return color;
  }
  return (
    <MultiSlider
      height={10}
      slidableZoneSize={40}
      backgroundColor="lightgray"
      equalColor={variantColor()}
      onSlide={handleSlide}
      roundedCorners
      disabled={props.disabled}
    >
      <Progress color="green" progress={progress} >
      </Progress>
    </MultiSlider>
  )
}
