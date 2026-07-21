import React from 'react';

const DateComponent = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return (
    <svg width="173" height="40" viewBox="0 0 173 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="173" height="40" rx="20" fill="white"/>
      <rect x="0.5" y="0.5" width="172" height="39" rx="19.5" stroke="#3C4758" stroke-opacity="0.38"/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">{formattedDate}</text>
    </svg>
  );
}

export default DateComponent;
