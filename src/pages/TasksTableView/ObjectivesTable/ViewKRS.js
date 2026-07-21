import React from 'react'
import { Link } from 'react-router-dom';

export default function ViewKRSComponent({ row, companyInfo, privileges }) {
  return (
    <div className="d-flex flex-wrap">
      <div className="dropdown actionDropdown">
        <Link
          to={{
            pathname: "/admin/objectives/okrdetails",
            state: {
              data: {
                ...row,
                objectiveId: row._id,
                ownerName: companyInfo,
                privileges,
                viewkr: true
              },
            },
          }}>
          <button className="dropdown-hide d-toggle">
            <i className='fa fa-external-link text-green' />
          </button>
        </Link>
      </div>
    </div>
  )
}
