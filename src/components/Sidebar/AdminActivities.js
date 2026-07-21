import React from "react";
import { adminActivityLinks } from "routes/routes";
import setup from "../../assets/svg/setups.svg";
import { NavLink } from "react-router-dom";
import "./styles.scss";
// removed useLocation, not needed
import { rolesAndPrevilages } from "routes/routes";
import { useTranslation } from "react-i18next";

export default function AdminActivities(props) {
  const { t } = useTranslation();

  const setupLinks = adminActivityLinks();
  const adminCenterRoute = rolesAndPrevilages.find(
    (route) => route.permissionKey === "Admin Center"
  );

  const setupLinksWithAdminCenter = adminCenterRoute
    ? [...setupLinks, adminCenterRoute]
    : setupLinks;

  return (
    <div>
      {(setupLinksWithAdminCenter?.length ?? 0) > 0 && (
        <>
          <div
            className="setup admin-activity-text"
            data-toggle="collapse"
            data-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
              <img src={setup} className="sidebar-list-icon" alt="settings" />
              <span className="link-text">{t("Sidebar.setups")}</span>
            </li>
          </div>
          <div className="collapse" id="collapseExample">
            {setupLinksWithAdminCenter.map(({ icon, title, link }, index) => (
              <NavLink
                to={link}
                className="sidebar_new_link admin-activity-text text-decoration-none"
                activeClassName="active-nav-item"
                key={index}
                exact
              >
                <li className="sidebar-list-item pt-3 pb-3 cursor-pointer">
                  <img
                    src={icon}
                    className="sidebar-list-icon"
                    alt="sidebar-icon"
                  />
                  <span className="link-text">{t(`${title}`)}</span>
                </li>
              </NavLink>
            ))}
          </div>
        </>
      )}
    </div>
  );
}