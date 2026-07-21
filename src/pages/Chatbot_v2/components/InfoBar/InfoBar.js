import React from 'react';

import closeIcon from '../../assets/cross.svg';
import icon from '../../../../assets/images/tara_logo.jpg'
import './InfoBar.css';

const InfoBar = ({ setVisible }) => (
  <div className="infoBar" style={{ position: "relative" }}>
    <div><img src={icon} alt="logo" className="appLogo2" /> TARA</div>
    <div className="rightInnerContainer" style={{ cursor: 'pointer' }}>
      <img src={closeIcon} alt="close icon" style={{ width: '13px', color: '#2A7A7B' }} onClick={() => { setVisible(false) }} />
    </div>
  </div>
);

export default InfoBar;