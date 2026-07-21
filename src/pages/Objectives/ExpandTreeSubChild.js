import React, { useState } from 'react'

export default function ExpandTreeSubChild({ index2, data, option, okrFunction, handleInputChangeKeyResults, handleInputChangeTasks, keyResult, index1 }) {
  const [showTasks, setShowTasks] = useState(false);
  const hasTasks = Array.isArray(keyResult.tasks) && keyResult.tasks.length > 0;
  return (
    <div key={index2}>
      <div className="d-flex align-items-start">
        <button className='mr-2 border-0' disabled={!hasTasks} onClick={() => setShowTasks(!showTasks)}>{showTasks ? "-" : "+"}</button>
        <span>
          <input type="checkbox" className='mr-2' name="isSelected" value={keyResult.isSelected ? true : false} checked={keyResult.isSelected} onChange={() => handleInputChangeKeyResults(option.value, data.findIndex(item => item.okrFunction === okrFunction.okrFunction && item.name === okrFunction.name), index2)} />
          {keyResult.name}
        </span>
      </div>
      {showTasks && hasTasks && (
        <div className="ml-5 pl-2">
          {keyResult.tasks.map((task, index3) => (
            <div key={index3} className="d-flex">
              <span>
                <input type="checkbox" className='mr-2' name="isSelected" value={task.isSelected ? true : false} checked={task.isSelected} onChange={() => handleInputChangeTasks(option.value, data.findIndex(item => item.okrFunction === okrFunction.okrFunction && item.name === okrFunction.name), index2, index3)} />
                {task.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
