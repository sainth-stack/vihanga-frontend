import React, { useState } from 'react'
import ExpandTreeSubChild from './ExpandTreeSubChild';

export default function ExpandTreeChild({ index1, data, option, okrFunction, objectiveId, handleInputChangeObjectives, handleInputChangeKeyResults }) {
  const [showKeyResults, setShowKeyResults] = useState(false);
  return (
    <div key={index1}>
      <div className="d-flex">
        <button className='mr-2 border-0' disabled={data.length > 0 && data.filter(item => item.okrFunction === option.value).length > 0 ? false : true} onClick={() => { setShowKeyResults(!showKeyResults); }}>{showKeyResults && objectiveId !== 'undefined' && okrFunction.objectiveID === objectiveId ? "-" : "+"}</button>
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={okrFunction.isSelected ? true : false} checked={okrFunction.isSelected} onChange={() => handleInputChangeObjectives(option.value, data.findIndex(item => item.okrFunction === okrFunction.okrFunction && item.name === okrFunction.name))} />
          {okrFunction.name}</span>
      </div>

      {showKeyResults && objectiveId && <div className="ml-5">
        {okrFunction.keyResults && okrFunction.keyResults.length > 0 && okrFunction.keyResults.filter((kr) => kr.objectiveID === objectiveId).length > 0 && okrFunction.keyResults.filter((kr) => kr.objectiveID === objectiveId).map((keyResult, index2) => (
          <ExpandTreeSubChild index2={index2} keyResult={keyResult} handleInputChangeKeyResults={handleInputChangeKeyResults} option={option} data={data} okrFunction={okrFunction} />
        ))}
      </div>}
    </div>
  )
}
