import React from 'react'
import "./styles.scss";

export default function ProgressStatus({ percent, updatedAt = new Date(), onEdit }) {
  let status = "danger";
  let progressValue = percent;
  if (progressValue > 0 && progressValue <= 60) {
    status = "danger"
  } else if (progressValue > 60 && progressValue <= 80) {
    status = "warning"
  } else if (progressValue > 80) {
    status = "success"
  }
  return (
    <div onClick={() => onEdit()}>
      <div className='d-flex justify-content-between align-items-center'>
        <p className={'text-' + status}>{percent == 0 ? "0" : percent}%</p>
        <p className={'text-white rounded circle p-1 bg-' + status}>On Track</p>
      </div>
      <div className="progress " style={{ height: 5 }}>
        <div className={"progress-bar bg-" + status} role="progressbar" style={{ width: percent + "%" }} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <small>Updated {window.moment(updatedAt).fromNow()}</small>
    </div>
  )
}
