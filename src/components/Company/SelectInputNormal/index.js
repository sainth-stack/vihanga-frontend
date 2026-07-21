import React from 'react';
import "./styles.scss"

export default function SelectInputNormal({ label = "", placeholder = "", options = [], name = "", value = "", onChangeText, style3, style, ...rest }) {
  return (
    <div className='d-flex justify-content-between align-items-center'>
      <label className='label fs14 mr-2'>{label}</label>
      <select className='select-box' name={name} value={value} onChange={onChangeText} {...rest} style={{ "minWidth": `${style3}px`, ...style }} >
        <option value="">{placeholder}</option>
        {options !== undefined && options.length > 0 && options.map((option, index) => (
          <option value={option.value} key={index}>{option.key}</option>
        ))}
      </select>
    </div>
  )
}
