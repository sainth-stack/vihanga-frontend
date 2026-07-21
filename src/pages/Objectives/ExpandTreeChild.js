import React, { useState } from 'react'
import ExpandTreeSubChild from './ExpandTreeSubChild';

export default function ExpandTreeChild({ index1, data, option, okrFunction, objectiveId, handleInputChangeObjectives, handleInputChangeKeyResults, handleInputChangeTasks }) {
  const [showKeyResults, setShowKeyResults] = useState(false);
  return (
    <div key={index1}>
      <div className="d-flex">
        <button className='mr-2 border-0' disabled={!okrFunction.keyResults || okrFunction.keyResults.length === 0} onClick={() => { setShowKeyResults(!showKeyResults); }}>{showKeyResults ? "-" : "+"}</button>
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={okrFunction.isSelected ? true : false} checked={okrFunction.isSelected} onChange={() => handleInputChangeObjectives(option.value, data.findIndex(item => item.okrFunction === okrFunction.okrFunction && item.name === okrFunction.name))} />
          {okrFunction.name}</span>
      </div>

      {showKeyResults && <div className="ml-5 pl-2">
        {okrFunction.keyResults && okrFunction.keyResults.length > 0 && okrFunction.keyResults.map((keyResult, index2) => (
          <ExpandTreeSubChild key={index2} index2={index2} keyResult={keyResult} handleInputChangeKeyResults={handleInputChangeKeyResults} handleInputChangeTasks={handleInputChangeTasks} option={option} data={data} okrFunction={okrFunction} index1={index1} />
        ))}
      </div>}
    </div>
  )
}
