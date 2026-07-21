import React, { useState } from 'react'
import ExpandTreeChild from './ExpandTreeChild';

export default function ExpandTree({ option, index, data, handleInputChangeObjectives, handleInputChangeKeyResults }) {
  const [showObjectives, setShowObjectives] = useState(false);
  return (
    <div key={index + "option"}>
      <div className="d-flex mt-2 mb-2">
        <button className='mr-2 border-0' disabled={data.length > 0 && data.filter(item => item.okrFunction === option.value).length > 0 ? false : true} onClick={() => {
          setShowObjectives(!showObjectives);
        }
        }>{showObjectives ? "-" : "+"}</button>
        <span>
          {option.key}</span>
      </div>
      {showObjectives && <div className="ml-4">
        {data.length > 0 && data.filter(item => item.okrFunction === option.value).length > 0 && data.filter(item => item.okrFunction === option.value).map((okrFunction, index1) => (
          <ExpandTreeChild index1={index1} data={data} option={option} okrFunction={okrFunction} objectiveId={okrFunction.objectiveID} handleInputChangeObjectives={handleInputChangeObjectives}
            handleInputChangeKeyResults={handleInputChangeKeyResults} />
        ))}
      </div>}
    </div>
  )
}

