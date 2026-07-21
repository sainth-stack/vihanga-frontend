import React, { useState } from 'react'
import MultiSlider, { Progress } from 'react-multi-bar-slider';
export default function SliderRewards(props) {
  const [progress, setProgress] = useState(0);
  const handleSlide = newProgress => {
    setProgress(newProgress);
    props.onChange(newProgress);
  }
  const variantColor = () => {
    let color = "lightgray";
    if (progress > 0 && progress <= 60) {
      color = "red"
    } else if (progress > 60 && progress <= 80) {
      color = "orange"
    } else if (progress > 80) {
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
    >
      <Progress color="green" progress={progress} />
    </MultiSlider>
  )
}
