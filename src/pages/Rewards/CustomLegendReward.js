import React from 'react'

export default function CustomLegendReward({ title, color }) {
  return (
    <div className='d-flex p-1'>
      <button className='dot m-2' style={{ backgroundColor: color }} />
      <p className='m-1'>{title}</p>
    </div>
  )
}