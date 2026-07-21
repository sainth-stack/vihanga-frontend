import React from 'react';
import "./styles.scss"

export default function Text({ text = "", style }) {
  return (
    <p className="green-heading p-0 m-0" style={style}>{text}</p>
  )
}
