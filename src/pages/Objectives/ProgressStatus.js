/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

import "./styles.scss";
import { useSelector } from "react-redux";
import Tooltip from '@mui/material/Tooltip';

export default function ProgressStatus({
  percent = "50",
  updatedAt = new Date(),
  onEdit,
  readOnly = false,
  row = undefined
}) {
  let threshold = useSelector((store) => store.user.threshold);
  const [danger, setDanger] = useState("light");
  const [text, setText] = useState("Off Track");
  useEffect(() => {
    if (threshold) {
      if (Number(percent) >= Number(threshold[0].lowValueRange[0].min) && Number(percent) <= Number(threshold[0].lowValueRange[0].max)) {
        setDanger("danger");
        setText("Off Track");
      } else if (Number(percent) >= Number(threshold[0].midValueRange[0].min) && Number(percent) <= Number(threshold[0].midValueRange[0].max)) {
        setDanger("warning");
        setText("At Risk");
      } else if (Number(percent) >= Number(threshold[0].highValueRange[0].min) && Number(percent) <= Number(threshold[0].highValueRange[0].max)) {
        setDanger("success");
        setText("On Track");
      } else {
        setDanger("success");
        setText("On Track");
      }
    }
  }, [percent, setDanger]);
  return (
    <div onClick={() => onEdit()}>
      <div className="d-flex justify-content-between align-items-center">
        <p className={"text-" + danger}>{percent == 0 ? "0" : percent}%</p>
        <p className={"text-white text-center rounded circle p-1 bg-" + danger}>
          {text}
        </p>
      </div>
      <div className={`progress1 bg-${danger} rounded`} style={{ height: 5 }}>
        {readOnly && !!row.eachPercentage && row.eachPercentage.length > 0 ? <div className='d-flex w-100' style={{
          height: '5px',
          marginBottom: '10px',
          borderRadius: '10px',
          backgroundColor: 'lightgray'
        }}>
          {row.eachPercentage.map((item, index) => (
            <Tooltip title={
              <React.Fragment>
                <div className='p-1 text-center'>
                  {row.IndividualNames[index]}<br />
                  {row.IndividualProgress[index]}%
                </div>
              </React.Fragment>
            } arrow placement='top'>
              <div
                style={{
                  borderRadius: index === 0 ? '10px 0px 0px 10px' : index === row.eachPercentage.length - 1 ? '0px 10px 10px 0px' : '',
                  width: `${item}%`,
                  backgroundColor: row.randomColors[index],
                  cursor: 'pointer'
                }}
              >
              </div>
            </Tooltip>
          ))}
        </div> :
          <div className={"progress-bar bg-" + danger} role="progressbar" style={{ width: percent + "%" }} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"></div>}
      </div>
      <small>Updated {window.moment(updatedAt).fromNow()}</small>
    </div>
  );
}
