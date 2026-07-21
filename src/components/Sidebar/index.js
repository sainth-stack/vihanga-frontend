/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { links } from "routes/routes";
import { NavLink, useLocation } from "react-router-dom";
import "./styles.scss";
import AdminActivities from "./AdminActivities";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { AuthLineManager, AuthRole, LoadingIndicator } from "utilities";
import { useSelector, useDispatch } from "react-redux";
import { keyresults } from "reducer";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const [, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [show, setShow] = useState(false);

  const privileges =
    useSelector((store) => store.user.privileges) ?? [];

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    try {
      setLoading(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  }, []);

  return (
    <div className="shadow sidebar-scroll vh-100 sticky-top zindex99 sidebar_new_styles">
      <ul className="sidebar-list-items pl-3">
        {/* Collapse Button */}
        <div
          className="d-flex justify-content-center align-items-center rounded-circle bg-white shadow-sm mr-3"
          style={{ width: "50px", height: "50px", zIndex: 99 }}
        >
          {show ? (
            <ArrowForwardIosIcon
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => {
                document.body.classList.toggle("sidebar-icon-only");
                setShow(false);
              }}
            />
          ) : (
            <ArrowBackIosNewIcon
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => {
                document.body.classList.toggle("sidebar-icon-only");
                setShow(true);
              }}
            />
          )}
        </div>

        {/* Sidebar Menu */}
        {(Array.isArray(privileges) && privileges.length > 0) ||
        AuthRole === "Super Admin" ? (
          links().map(({ icon, title, link }, index) => (
            <NavLink
              key={index}
              to={link}
              className={({ isActive }) =>
                `sidebar_new_link text-light text-decoration-none ${
                  isActive || pathname.startsWith(link)
                    ? "active-nav-item"
                    : ""
                }`
              }
              onClick={() => {
                if (pathname === "/admin/keyresults") {
                  dispatch(
                    keyresults({
                      message: "data",
                      data: [],
                      success: true,
                    })
                  );
                }
              }}
            >
              <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
                <img
                  src={icon}
                  className="sidebar-list-icon"
                  alt="sidebar-icon"
                />
                <span className="link-text">{t(title)}</span>
              </li>
            </NavLink>
          ))
        ) : (
          <LoadingIndicator size="2" />
        )}

        {/* Admin Activities */}
        {((Array.isArray(privileges) &&
          privileges.some?.(
            (p) => p.category === "Previleges" && p.view
          )) ||
          AuthRole === "Super Admin" ||
          AuthRole === "HR Admin" ||
          !AuthLineManager) &&
          AuthRole !== "Employee" && (
            <div>
              <div className="adminActivities">
                {t("Sidebar.AdminActivities")}
              </div>
              <AdminActivities
                AuthRole={AuthRole}
                privilege={privileges}
              />
            </div>
          )}
      </ul>
    </div>
  );
}
