import React from "react";
import { Link } from "react-router-dom";
import appLogo1 from "../../assets/images/AppNewLogo.png";
import logo2 from "../../assets/images/AppNewLogo.png";

export default function NewTopHeader({ logoImg = "1" }) {

  return (
    <nav className="navbar navbar-expand-lg bg-white w-100 shadow-sm">
      <div className="container-fluid px-3">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center text-decoration-none"
        >
          <img
            src={logoImg === "2" ? logo2 : appLogo1}
            alt="applogo"
            className="appLogo"
            style={{ height: "40px" }}
          />
        </Link>
      </div>
    </nav>
  );
}
