import React from 'react';
import "./styles.scss"
import CheckboxInput from '../CheckboxInput';
import useWindowSize from 'components/UseWindowSize';

export default function SelectInputIconStatus({ label = "", placeholder = "", options = [], name = "", value = "", onChangeText, style3, style, checkboxOptions, icon, ...rest }) {
  const isMobile = useWindowSize();
  return (
    <div className="dropdown ">
      <button className={`btn dropdown-toggle create-btn bg-green text-white dropdown-none text-capitalize SelectButton ${isMobile ? "p-0 m-0" : "mt-2 m-2"} fs16 w-100`} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <img src={icon} alt="eye" className='mr-1 status-icon' style={{ backgroundColor: "white", borderRadius: "50%", padding: "1px" }} />
        {isMobile ? "" : placeholder}
      </button>
      <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuButton">
        {checkboxOptions.length > 0 && checkboxOptions.map((checkbox, index) => (
          <CheckboxInput label={checkbox.label} name={checkbox.name} key={index} onChangeText={checkbox.onChangeText} value={checkbox.value} />
        ))}
        {/*<button className="dropdown-item text-capitalize fs16 bg-success text-white text-center" onClick={onChangeText}>Apply</button>*/}
      </div>
    </div>
    //<div className='d-flex justify-content-between align-items-center'>
    //  <label className='label fs14 mr-2 d-flex'><img src={eye} alt="eye" /> {placeholder}</label>
    //  <select className='select-box' name={name} value={value} onChange={onChangeText} {...rest} style={{ "minWidth": `${style3}px`, ...style }} >
    //    <option value="">{placeholder}</option>
    //    {options !== undefined && options.length > 0 && options.map((option, index) => (
    //      <option value={option.value} key={index}>{option.key}</option>
    //    ))}
    //  </select>
    //</div>
  )
}
