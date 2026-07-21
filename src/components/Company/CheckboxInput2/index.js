import React from 'react';
import "./styles.scss"
import employees from "assets/svg/employees.svg";
import star from "assets/svg/star.svg";
import departments from "assets/svg/departments.svg";

export default function CheckboxInput({ index, label = "", placeholder = "", style = '', name = "", value = "", icon = "", onChangeText }) {
  let imgIcon;
  switch (icon) {
    case "employees":
      imgIcon = employees;
      break;
    case "departments":
      imgIcon = star;
      break;
    case "teams":
      imgIcon = departments;
      break;
    default:
      break;
  }
  return (
    <div style={{ margin: `${style.mt}px 0 0 ${style.ml}px` }} className='d-flex align-items-center justify-content-between'>
      <label className='label fs14 ml-2 m-0' style={{ width: `${style.width}px` }} htmlFor={`checkboxInput${label}`}><img className='mr-3' src={imgIcon} alt="imgIcon" />{label}</label>
      <input type="checkbox" className='checkbo-box mr-2' placeholder={placeholder} name={name} value={value} onChange={() => onChangeText({ target: { name, value: !value } }, index)} id={`checkboxInput${label}`} checked={value} />
    </div>
  )
}
