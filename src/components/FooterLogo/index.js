import React from 'react'
import { Link } from 'react-router-dom'
import appLogo1 from '../../assets/images/AppNewLogo.png'
import logo2 from '../../assets/images/logo2.png'
import "./styles.scss";
const devLogo = require('../../assets/svg/dev-placeholder.svg');
const isDev = process.env.NODE_ENV === 'development';

export default function FooterLogo({ logoImg = "1" }) {
  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;
  let themeLogo = null;
  try {
    if (companyId) {
      const key = `theme_${companyId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const theme = JSON.parse(raw);
        themeLogo = theme?.logoUrl || null;
      }
    }
  } catch {}
  return (
    <Link to="/" className="text-decoration-none">
      <div className="d-flex align-items-center">
        <img src={isDev ? devLogo : (themeLogo || (logoImg === "2" ? logo2 : appLogo1))} className="appLogo" alt="applogo" />&nbsp;&nbsp;
        <p className="text-dark logoText">
          <span className="talent2">TALENT</span><span className="spotify2">SPOTIFY</span>
        </p>
      </div>
    </Link>
  )
}
