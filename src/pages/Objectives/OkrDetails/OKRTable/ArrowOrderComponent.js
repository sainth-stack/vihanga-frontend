import React from 'react'

export default function ArrowOrderComponent({ order }) {
  return (
    <span>
      <i
        className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
          }`}
      />
      <i
        className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
          }`}
      />
    </span>
  )
}
