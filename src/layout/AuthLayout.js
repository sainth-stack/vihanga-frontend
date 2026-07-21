import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { LoadingIndicator } from "utilities";
import { emailLinkLogin } from "action/UserAct";
import { getPrivilege } from "action/PrivilegesAct";
import { api } from "service/api";
import { themeApi } from "service/apiVariables";
import { applyThemeToCssVariables } from "theme/applyTheme";
import { getPrivileges, setCompanyId, setUser, setUserData } from "reducer/userSlice";
import { getCompanyConfig } from "action/CompanyAct";

export function AuthLayout(props) {
  const dispatch = useDispatch();
  const [processingEmailLink, setProcessingEmailLink] = useState(false);

  useEffect(() => {
    const search = props?.location?.search || window.location.search || "";
    const urlParams = new URLSearchParams(search);
    const fromEmail = (urlParams.get("fromEmail") || "").toLowerCase() === "true";
    const token = urlParams.get("token");
    const emailId = urlParams.get("emailId") || urlParams.get("email") || "";
    const redirectPath = urlParams.get("redirect") || "/admin/dashboard";

    if (!fromEmail || !token) return;

    setProcessingEmailLink(true);
    const response = dispatch(
      emailLinkLogin({
        token,
        emailId,
      })
    );

    response
      .then(async (res) => {
        if (!res) return;

        // Mirror Login.js behavior
        localStorage.setItem("user", JSON.stringify(res));
        localStorage.setItem("userRole", JSON.stringify(res.role));
        localStorage.setItem("userRoleId", JSON.stringify(res._id));
        localStorage.setItem(
          "userData",
          JSON.stringify({ ownerId: res._id, ownerName: res.name })
        );
        localStorage.setItem("selectedTab", JSON.stringify({ tab: "me" }));
        localStorage.setItem("companyId", JSON.stringify(res.companyId));

        dispatch(setUser({ payload: res }));
        dispatch(setUserData({ payload: { ownerId: res._id, ownerName: res.name } }));
        dispatch(setCompanyId(res.companyId));
        dispatch(getCompanyConfig(res.companyId)).catch(() => {});

        // Privileges
        const role = res.role;
        const privResp = dispatch(getPrivilege(role, res.companyId));
        privResp.then(({ data }) => {
          if (data !== undefined && data.length > 0) {
            localStorage.setItem("privileges", JSON.stringify(data[0].privileges));
            dispatch(getPrivileges(data[0].privileges));
          }
        });

        // Theme best-effort
        try {
          const companyId = res.companyId;
          const themeResp = await api(themeApi.getCompanyTheme(companyId));
          const theme = themeResp?.data?.data || themeResp?.data || null;
          if (theme) {
            localStorage.setItem(`theme_${companyId}`, JSON.stringify(theme));
            applyThemeToCssVariables(theme);
          }
        } catch (e) {
        } finally {
          props.history.push(redirectPath);
          setTimeout(() => window.location.reload(), 500);
        }
      })
      .catch(() => {})
      .finally(() => setProcessingEmailLink(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  // If user is already logged in, go to dashboard (or redirect= if provided)
  const search = props?.location?.search || window.location.search || "";
  const urlParams = new URLSearchParams(search);
  const redirectPath = urlParams.get("redirect") || "/admin/dashboard";

  if (processingEmailLink) {
    return (
      <div className="text-center" style={{ paddingTop: 40 }}>
        <LoadingIndicator size="3" />
      </div>
    );
  }

  return <div>{user == null ? <div>{props.children}</div> : <Redirect to={redirectPath} />}</div>;
}
