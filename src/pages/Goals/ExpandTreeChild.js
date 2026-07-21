import React from 'react'

export default function ExpandTreeChild({ index1, data, option, okrFunction, objectiveId, handleInputChangeObjectives }) {
  return (
    <div key={index1}>
      <div className="d-flex ml-4">
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={okrFunction.isSelected ? true : false} checked={okrFunction.isSelected} onChange={() => handleInputChangeObjectives(option.value, data.findIndex(item => item.okrFunction === okrFunction.okrFunction && item.name === okrFunction.name))} />
          {okrFunction.name}</span>
      </div>
    </div>
  )
}
