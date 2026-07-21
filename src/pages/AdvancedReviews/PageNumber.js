import Logo from 'components/Logo'
import React from 'react'

export default function PageNumber({ pageNumber = 1 }) {
  return (
    <div className='d-flex justify-content-between align-items-center p-3 m-3'>
      <Logo />
      <p className='h4'><b>{pageNumber < 10 ? "0" + pageNumber : pageNumber}</b></p>
    </div>
  )
}
