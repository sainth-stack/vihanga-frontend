import React, { useEffect } from "react";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { Redirect, useLocation } from "react-router-dom";
import useWindowSize from "components/UseWindowSize";
import NewTopHeader from './../components/Navbar/newTopHeader';
import { ErrorBoundary } from "../layout";
import { applyThemeFromLocalStorage } from "theme/applyTheme";

export function AdminLayout(props) {
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  const isMobile = useWindowSize();
  const location = useLocation();
  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;

  useEffect(() => {
    applyThemeFromLocalStorage(companyId);
  }, [companyId]);

  // Check if the current path includes 'profile'
  const isProfilePage = ["profile", "feedback", "document-upload"].some(
    (keyword) => location.pathname.toLowerCase().includes(keyword)
  );

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  if (user !== null) {
    return (
      <div className="row p-0 m-0">
        <React.Fragment>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 p-0 m-0 bg-light">
            {isProfilePage ? (
              <>
                <NewTopHeader />
                <div className="p-0 m-0 w-100">{props.children}</div>
              </>
            ) : (
              <ErrorBoundary>
                <>
                  <Navbar />
                  <div className="d-flex justify-content-between">
                    <div
                      className={isMobile ? "d-none d-md-block d-lg-block" : ""}
                    >
                      <Sidebar />
                    </div>
                    <div className="p-0 m-0 w-100">{props.children}</div>
                  </div>
                </>
              </ErrorBoundary>
            )}
            {/* Top Navbar */}
            {/* Main content */}
          </div>
        </React.Fragment>
      </div>
    );
  } else {
    return <Redirect to="/auth/login" />;
  }
}
