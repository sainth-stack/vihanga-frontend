import React, { useState } from 'react'
import ExpandTreeChildTransfer from './ExpandTreeChildTransfer';

export default function ExpandTreeTransfer({ option, index, data, handleInputChangeObjectives, handleInputChangeKeyResults, handleInputChangeTasks }) {
  const [showObjectives, setShowObjectives] = useState(false);
  return (
    <div key={index + "option"}>
      <div className="d-flex mt-2 mb-2">
        <button className='mr-2 border-0' disabled={data.length > 0 && data.filter(item => item.value === option.value).length > 0 ? false : true} onClick={() => {
          setShowObjectives(!showObjectives);
        }
        }>{showObjectives ? "-" : "+"}</button>
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={option.isSelected ? true : false} checked={option.isSelected} onChange={() => handleInputChangeObjectives(option.value, index)} disabled={data.length > 0 && data.filter(item => item.value === option.value).length > 0 ? false : true} />
          {option.key}</span>
      </div>
      {showObjectives && <div className="ml-4">
        {option.keyResults && option.keyResults.length > 0 && option.keyResults.filter(item => item.objectiveId === option.value).length > 0 && option.keyResults.filter(item => item.objectiveId === option.value).map((okrFunction, index1) => (
          <ExpandTreeChildTransfer index1={index1} index={index} data={data} option={option} okrFunction={okrFunction} objectiveId={okrFunction._id} handleInputChangeObjectives={handleInputChangeObjectives}
            handleInputChangeKeyResults={handleInputChangeKeyResults} handleInputChangeTasks={handleInputChangeTasks} />
        ))}
      </div>}
    </div>
  )
}

