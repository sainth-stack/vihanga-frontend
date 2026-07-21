import React from 'react';
import { countries } from 'utilities';
import "./styles.scss"

export default function Date({ label = "", text, placeholder = "", style, name = "", dateType, value = "", onChangeText, isCountry, countryCode = "+91", onChangeCountry, ...rest }) {
  return (
    <div className=''>
      <label className='ml-3 label mb-0 '>{label}</label>
      <div className=''>
        {isCountry && <select className='form-control col-md-4' defaultValue={countryCode} value={countryCode} onChange={onChangeCountry}>
          {countries.map((country, index) => (
            <option value={country.code} key={index}>{country.code}</option>
          ))}
        </select>}
        {/* <input type={text ? text : dateType} className={`rounded ${isCountry ? 'leftradius' : ''}`} style={{borderRadius:"10px"}} placeholder={placeholder} name={name} value={value} onChange={onChangeText} {...rest} /> */}
        <input type="date" className='date' onChange={onChangeText} placeholder={placeholder} name={name} value={value} />
      </div>
    </div>
  )
}
