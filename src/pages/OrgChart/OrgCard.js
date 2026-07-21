import React from 'react'
import "./styles.scss"
const OrgCard = ({hline, data }) => {
  return (
    <div className={hline ? 'card-margin' : ''}>
      <img width="99px" className={`orguser-icon`} height="99px" src={data.profilePicture} alt="orguser" />
      <div className='org-card'>
        <div className='orgchart-card'>
          <p className='org-text pt-3'>{data.name}</p>
          <p className='org-text'>Employee ID - {data.employeeID}</p>
          <p className='org-text'>Role - {data.role}</p>
          <p className='org-text mt-3 pb-2'>{data.direct} Direct/ {data.subOrdinates} Sub Ordinates</p>
        </div>
      </div>
    </div>
  )
}

export default OrgCard