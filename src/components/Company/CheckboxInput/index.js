import React from 'react';
import "./styles.scss"

export default function CheckboxInput({ label = "", placeholder = "", style = '', name = "", value = "", onChangeText }) {
  return (
    <div style={{ margin: `${style.mt}px 0 0 ${style.ml}px` }} className='d-flex align-items-center '>
      <input type="checkbox" className='checkbo-box' placeholder={placeholder} name={name} value={value} onChange={() => onChangeText({ target: { name, value: !value } })} id={`checkboxInput${label}`} checked={value} />
      <label className='label fs14 ml-2 m-0' style={{ width: `${style.width}px` }} htmlFor={`checkboxInput${label}`}>{label}</label>
    </div>
  )
}
