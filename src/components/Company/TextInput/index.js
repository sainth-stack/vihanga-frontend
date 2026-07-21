import useWindowSize from "components/UseWindowSize";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { countries } from "utilities";
import "./styles.scss";

export default function TextInput({
  label = "",
  text,
  placeholder = "",
  style,
  name = "",
  dateType,
  value = "",
  onChangeText,
  index,
  isCountry,
  countryCode = "+91",
  onChangeCountry,
  readonly,
  labelStyle,
  inputStyle,
  stackLabel=false, // New prop to control layout
  showPasswordToggle = false,
  ...rest
}) {
  const isMobile = useWindowSize();
  const [showPassword, setShowPassword] = useState(false);
  const baseType = text ? text : dateType;
  const isToggleActive = showPasswordToggle && baseType === "password";
  const inputType = isToggleActive ? (showPassword ? "text" : "password") : baseType;
  const isNumberInput = String(inputType || "").toLowerCase() === "number";
  const onWheelNumber = isNumberInput
    ? (e) => {
        e.preventDefault();
      }
    : undefined;

  console.log(stackLabel)
  return (
    <div className={`${stackLabel ? 'd-flex flex-column' : 'd-flex justify-content-between align-items-center'}`}>
      {label && (
        <label className={`label fs13 ${stackLabel ? 'mb-1' : isMobile ? 'col-md-4 p-0' : `col-md-4 ${labelStyle}`}`}>
          {label}
        </label>
      )}
      
      <div className={`d-flex ${stackLabel ? 'w-100' : 'col-md-8'} ${isMobile ? 'col-xs-12 col-sm-12' : ''} ${isMobile && !stackLabel ? 'm-0 p-0' : 'ml-2'} ${inputStyle}`}>
        {isCountry && (
          <select
            className={`form-control ${stackLabel ? 'col-md-3' : 'col-md-4'} rightRadius ${isMobile ? 'p-0' : 'p-1'}`}
            defaultValue={countryCode}
            value={countryCode}
            onChange={onChangeCountry}
          >
            {countries.map((country, index) => (
              <option value={country.code} key={index}>
                {country.code}
              </option>
            ))}
          </select>
        )}
        
        <div className={`position-relative ${isCountry ? 'flex-grow-1' : 'w-100'}`}>
          {readonly ? (
            <input
              type={inputType}
              className={`form-control rounded ${isCountry ? "leftradius" : ""} ${isToggleActive ? "input-with-toggle" : ""}`}
              index={index}
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={onChangeText}
              readOnly
              {...rest}
              onWheel={onWheelNumber}
            />
          ) : (
            <input
              type={inputType || "text"}
              className={`form-control rounded ${isCountry ? "leftradius" : ""} ${isToggleActive ? "input-with-toggle" : ""}`}
              placeholder={placeholder}
              name={name}
              value={value}
              index={index}
              onChange={onChangeText}
              {...rest}
              onWheel={onWheelNumber}
            />
          )}
          {isToggleActive && (
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}