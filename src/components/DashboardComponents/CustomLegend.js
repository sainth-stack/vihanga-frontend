import React from 'react'

export default function CustomLegend({ title, color }) {
  return (
    <div className='d-flex align-items-center p-2'>
      <button className='dot m-1' style={{ backgroundColor: color }} />
      <p className='m-1 fs12'>{title}</p>
    </div>
  )
}