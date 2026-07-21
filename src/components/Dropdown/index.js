import React from 'react'

export default function Dropdown({ title, options = [] }) {
  return (
    <div className="dropdown actionDropdown">
      <button className="dropdown-toggle m-2 p-1 border-0 bg-transparent" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {title}
      </button>
      <div className="dropdown-menu text-left " aria-labelledby="dropdownMenuButton">
        {options.length > 0 && options.map((option, index) => (
          <button className="dropdown-item text-capitalize text-left justify-content-start" key={index}>{option.key}</button>
        ))}
      </div>
    </div>
  )
}
