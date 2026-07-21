import React from 'react'
import { Link } from 'react-router-dom'
import appLogo1 from "../../assets/images/AppNewLogo.png";
import logo2 from "../../assets/images/AppNewLogo.png";
import { useTranslation } from 'react-i18next'
import NewTopHeader from 'components/Navbar/newTopHeader';


export default function Logo({ logoImg = "1" }) {
  const {t} = useTranslation()
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
    <>
      <Link to="/" className="text-decoration-none">
        <div className="d-flex" tabIndex="0" role="img" aria-label="Company Logo Go to home">
          <img
            src={themeLogo || (logoImg === "2" ? logo2 : appLogo1)}
            className="appLogo"
            alt="applogo" 
          />
          &nbsp;&nbsp;
          {/* <p className="text-dark logoText"><span className="talent">{t("Navbar.TALENT")}</span><span className="spotify">{t("Navbar.SPOTIFY")}</span></p> */}
        </div>
      </Link>
    </>
  );
}
