import React from 'react';
import "./styles.scss"

export default function DownloadLink({ text = "", link = "", onClick }) {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="green-heading-link p-0 m-0"
      onClick={handleClick}
    >
      {text}
    </a>
  )
}
