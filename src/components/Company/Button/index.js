import React from 'react';
import "./styles.scss"

export default function Button({ text = "", className = "bg-white", handleClick, style, loading = false, ...rest }) {
  return (
    <button 
      style={{ 
        visibility: `${style}`,
        cursor:loading ? 'not-allowed':'pointer',
        ...style
      }} 
      className={"border-green buttonStyle " + className} 
      onClick={!loading ? () => handleClick && handleClick() : null} 
      {...rest}
    >
      {text}
    </button>
  )
}
