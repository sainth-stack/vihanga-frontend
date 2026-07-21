import React from 'react'

export default function ViewKRSComponent({ row, companyInfo, privileges, handleOpenPopup }) {
  return (
    <div className='cursor-pointer text-center' onClick={() => {
      handleOpenPopup({
        data: {
          ...row,
          objectiveId: row._id,
          ownerName: companyInfo,
          privileges,
          viewkr: true,
          polarity: row.polarity ? row.polarity : 'Positive',
        },
      })
    }}>
      <i className='fa fa-plus-circle text-green fs-20' title="Add KR" />
    </div>
  )
}
