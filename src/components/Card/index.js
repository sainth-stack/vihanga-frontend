import React from 'react'
import "./styles.scss"

export default function Card({ icon, heading, subheading }) {
  return (
    <div className='bg-white text-center shadow rounded p-2 m-2 w280'>
      <img src={icon} alt="cardicon" className='iconSize' />
      <h3 className='heading'>{heading}</h3>
      <h6 className='subheading'>{subheading}</h6>
    </div>
  )
}
