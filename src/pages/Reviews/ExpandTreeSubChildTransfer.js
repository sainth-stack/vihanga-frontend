import React from 'react'

export default function ExpandTreeSubChildTransfer({ index2, index1, index, data, option, okrFunction, handleInputChangeKeyResults, keyResult, handleInputChangeTasks }) {
  return (
    <div key={index2}>
      <div className="d-flex ml-2">
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={keyResult.isSelected ? true : false} checked={keyResult.isSelected} onChange={() => handleInputChangeTasks(option.value, index, index1, index2)} />
          {keyResult.key}</span>
      </div>
    </div>
  )
}
