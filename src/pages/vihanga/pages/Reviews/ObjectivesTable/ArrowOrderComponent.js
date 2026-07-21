import React from 'react'
export default function ArrowOrderComponent({ order, column }) {
  return (
    <span className='arrows-table'>
      <i
        className={`fa fa-caret-up ${column ? "upArrow" : "upArrow"} ${order === "asc" ? "arrowActive" : "arrowInActive"
          }`}
      />
      <i
        className={`fa fa-caret-down ${column ? "downArrow" : "downArrow"} ${order === "desc" ? "arrowActive" : "arrowInActive"
          }`}
      />
    </span>
  )
}
