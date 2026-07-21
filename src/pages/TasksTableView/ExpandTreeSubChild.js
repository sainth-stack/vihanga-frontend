import React from 'react'

export default function ExpandTreeSubChild({ index2, data, option, okrFunction, handleInputChangeKeyResults, keyResult }) {
  return (
    <div key={index2}>
      <div className="d-flex">
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={keyResult.isSelected ? true : false} checked={keyResult.isSelected} onChange={() => handleInputChangeKeyResults(option.value, data.findIndex(item => item.okrFunction === okrFunction.okrFunction && item.name === okrFunction.name), index2)} />
          {keyResult.name}</span>
      </div>
    </div>
  )
}
