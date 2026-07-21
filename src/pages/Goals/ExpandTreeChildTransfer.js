import React, { useState } from 'react'
import ExpandTreeSubChildTransfer from './ExpandTreeSubChildTransfer';

export default function ExpandTreeChildTransfer({ index1, index, data, option, okrFunction, objectiveId, handleInputChangeObjectives, handleInputChangeKeyResults, handleInputChangeTasks }) {
  const [showKeyResults, setShowKeyResults] = useState(false);
  return (
    <div key={index1}>
      <div className="d-flex">
        <button className='mr-2 border-0' disabled={okrFunction.tasks.length > 0 && okrFunction.tasks.filter(item => item.krReferenceId === objectiveId).length > 0 ? false : true} onClick={() => { setShowKeyResults(!showKeyResults); }}>{showKeyResults && objectiveId !== 'undefined' && okrFunction.krReferenceId === objectiveId ? "-" : "+"}</button>
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={okrFunction.isSelected ? true : false} checked={okrFunction.isSelected} onChange={() => handleInputChangeKeyResults(option.value, index, index1)} />
          {okrFunction.key}</span>
      </div>

      {showKeyResults && objectiveId && <div className="ml-5">
        {okrFunction.tasks && okrFunction.tasks.length > 0 && okrFunction.tasks.filter((kr) => kr.krReferenceId === objectiveId).length > 0 && okrFunction.tasks.filter((kr) => kr.krReferenceId === objectiveId).map((keyResult, index2) => (
          <ExpandTreeSubChildTransfer index2={index2} index1={index1} index={index} keyResult={keyResult} handleInputChangeKeyResults={handleInputChangeKeyResults} option={option} data={data} okrFunction={okrFunction} handleInputChangeTasks={handleInputChangeTasks} />
        ))}
      </div>}
    </div>
  )
}
