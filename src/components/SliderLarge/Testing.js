import { getSimilarObjectives } from 'action/UserAct';
import React, { useState } from 'react'
import { useEffect } from 'react';
import MultiSlider, { Progress } from 'react-multi-bar-slider';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingIndicator } from 'utilities';
import Tooltip from '@mui/material/Tooltip';

//Can delete this component once slider testing is done.
export default function SliderLarge(
  //props
) {
  let props = {
    disabled: true,
    value: 60,
    onChange: () => { },
    readOnly: false,
    objectiveId: "64db6a430662b20008e4baf9",
    progressStatus: 60,
  }
  let threshold = useSelector((store) => store.user.threshold);
  let currentTab = useSelector((store) => store.user.currentTab);
  const [progress, setProgress] = useState(0);
  const [avgPercentage, setAvgPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [percentages, setPercentages] = useState([]);
  const [individualPercentages, setIndividualPercentages] = useState([]);
  const [users, setUsers] = useState([]);
  const [colors, setColors] = useState(["green", "purple", 'red', 'blue']);
  const dispatch = useDispatch();
  const handleSlide = newProgress => {
    if (props.disabled) return;
    setProgress(newProgress);
    props.onChange(newProgress);
  }
  // const colors = ["green", "purple", 'red', 'blue'];
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
  const variantColor2 = () => {
    let color = "lightgray";
    let progressStatus = progress ? progress : (avgPercentage ? avgPercentage : props.value);
    if (threshold) {
      if (Number(progressStatus) > 0 && Number(progressStatus) >= Number(threshold[0].lowValueRange[0].min) && Number(progressStatus) <= Number(threshold[0].lowValueRange[0].max)) {
        color = "danger"
      } else if (Number(progressStatus) >= Number(threshold[0].midValueRange[0].min) && Number(progressStatus) <= Number(threshold[0].midValueRange[0].max)) {
        color = "warning"
      } else if (Number(progressStatus) >= Number(threshold[0].highValueRange[0].min) && Number(progressStatus) <= Number(threshold[0].highValueRange[0].max)) {
        color = "success"
      }
    }
    return color;
  }

  // const getRandomBarColor = () => {
  //   // Define lower and upper bounds for darkness
  //   const darknessLowerBound = 0x333333;
  //   const darknessUpperBound = 0x888888;

  //   // Generate a random color value within the specified darkness range
  //   const randomColor = Math.floor(Math.random() * (darknessUpperBound - darknessLowerBound + 1)) + darknessLowerBound;

  //   return '#' + randomColor.toString(16);
  // }
  let previousHue = null;

  const getRandomBarColor = () => {
    const minHueDifference = 60;
    let newHue;

    do {
      newHue = Math.floor(Math.random() * 360); // Generate a random hue (0-359)
    } while (previousHue !== null && Math.abs(newHue - previousHue) < minHueDifference);

    previousHue = newHue;
    return `hsl(${newHue}, 70%, 50%)`; // Fixed saturation and lightness for vibrancy
  }
  const fetchSimilarObjectives = () => {
    try {
      let user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
      setLoading(true);
      let response = dispatch(getSimilarObjectives(user.role, props.objectiveId, undefined, currentTab));
      response.then(({ data, message }) => {
        const filterData = data.filter((item) => item.userType !== 'Testing')
        if (filterData !== undefined && filterData.length > 0) {
          let IndividualProgress = filterData.map(item => item.progressStatus);
          const avgPercentage = IndividualProgress.reduce((a, b) => a + b, 0) / IndividualProgress.length;
          const eachPercentage = filterData.map(item => item.progressStatus / IndividualProgress.length);
          //add previous percentage to next percentage
          for (let i = 0; i < eachPercentage.length; i++) {
            if (i > 0) {
              eachPercentage[i] = eachPercentage[i] + eachPercentage[i - 1];
            }
          }
          let IndividualNames = filterData.map(item => item.employeeName);
          const randomColors = eachPercentage.map(item => getRandomBarColor());
          setColors(randomColors)
          setPercentages(eachPercentage)
          setIndividualPercentages(IndividualProgress)
          setUsers(IndividualNames)
          setAvgPercentage(avgPercentage)
          setLoading(false);
        } else if (data.length === 0) {
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (props.progressStatus >= 0) {
      setProgress(props.progressStatus);
    }
  }, [props.progressStatus])
  useEffect(() => {
    if (props.disabled) {
      fetchSimilarObjectives();
    }
  }, [props.disabled])
  if (!props.disabled) {
    return (
      <MultiSlider
        height={10}
        slidableZoneSize={0}
        backgroundColor="lightgray"
        equalColor={variantColor()}
        onSlide={handleSlide}
        roundedCorners
      >
        <Progress color="green" progress={progress > 100 ? 100 : progress}>
        </Progress>
      </MultiSlider>
    )
  } else if (props.disabled) {
    return (
      <div className='mt-5 pt-5 m-4 p-4'>
        {loading ? <div className='text-center'>
          <LoadingIndicator size='3' />
        </div> :
          <>
            <span className={`text-${variantColor2()}`}>
              {avgPercentage ? avgPercentage : props.value}
            </span>
            {/* <MultiSlider
              // width={600}
              width={'100%'}
              height={10}
              slidableZoneSize={10}
              backgroundColor="lightgray"
              equalColor="blue"
              style={{ marginBottom: 40 }}
              onSlide={handleSlide}
              roundedCorners
            > */}
            {/* {percentages.map((item, index) => (
                <Progress color={colors[index]} progress={item} />
              ))} */}
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
                      {percentages[index]}%
                    </div>
                  </React.Fragment>
                } arrow placement='top' key={index}>
                  <div
                    style={{
                      borderRadius: index === 0 ? '5px 0px 0px 5px' : index === percentages.length - 1 ? '0px 5px 5px 0px' : '',
                      width: `${item}%`,
                      backgroundColor: colors[index],
                      cursor: 'pointer'
                    }}
                  // onClick={() => console.log('itemm', index)}
                  >
                  </div>
                </Tooltip>
              ))}
            </div>
            {/* </MultiSlider> */}
            <div className='d-flex flex-wrap'>
              {users.map((item, index) => (
                <div className='d-flex align-items-center' key={index}>
                  <div style={{ width: 25, height: 25, backgroundColor: colors[index] }} className='m-2' />
                  <div className='m-2'>
                    <small>{item}</small><br />
                    <small>({percentages[index]}%)</small>
                  </div>
                </div>
              ))}
            </div>
          </>}
      </div>
    )
  }
}
