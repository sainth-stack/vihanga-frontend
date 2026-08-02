import React, { useState, useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { consoleLog, LoadingIndicator, Validator } from "../../utilities";
import { login, maLogin } from "action/UserAct";
import "./styles.scss";
import eye from "../../assets/svg/eye-fill.svg";
import eye2 from "../../assets/svg/eye-slash.svg";
import { getPrivilege } from "action/PrivilegesAct";
import { history } from "service/helpers";
import { api } from "service/api";
import { themeApi } from "service/apiVariables";
import { applyThemeToCssVariables } from "theme/applyTheme";
import {
  getPrivileges,
  setCompanyId,
  setUser,
  setUserData,
} from "reducer/userSlice";
import { getCompanyConfig } from "action/CompanyAct";
import { Link } from "react-router-dom";
import { imageURLs } from "utilities/imageURLs";
import { loginWithMicrosoft } from "authConfig";
import { jwtDecode } from "jwt-decode";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import logo2 from "../../assets/images/AppNewLogo.png";
import TalentSpotify from "pages/vihanga/pages/AdminPage";

export default function Login() {
  const { t } = useTranslation();
  const user = getItemFromLocalStorage("user");
  const privileges = getItemFromLocalStorage("privileges");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [toggle2, setToggle] = useState(false);
  const [, forceUpdate] = useState(false);
  const dispatch = useDispatch();
  const [, setError] = useState(false);
  const validator = Validator();

  const submitLogin = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      setLoading(true);
      let response = dispatch(
        login({
          email: username,
          password: password,
        })
      );
      response
        .then((res) => {
          if (res) {
            localStorage.setItem("user", JSON.stringify(res));
            localStorage.setItem("userRole", JSON.stringify(res.role));
            localStorage.setItem("userRoleId", JSON.stringify(res._id));
            localStorage.setItem(
              "userData",
              JSON.stringify({ ownerId: res._id, ownerName: res.name })
            );
            localStorage.setItem("selectedTab", JSON.stringify({ tab: "me" }));
            localStorage.setItem("companyId", JSON.stringify(res.companyId));
            setLoading(false);
            setError("");
            dispatch(setUser({ payload: res }));
            dispatch(
              setUserData({
                payload: { ownerId: res._id, ownerName: res.name },
              })
            );
            dispatch(setCompanyId(res.companyId));
            dispatch(getCompanyConfig(res.companyId)).catch(() => {});
            let role = res.role;
            let response = dispatch(getPrivilege(role, res.companyId));
            response.then(({ data }) => {
              if (data !== undefined && data.length > 0) {
                localStorage.setItem(
                  "privileges",
                  JSON.stringify(data[0].privileges)
                );
                dispatch(getPrivileges(data[0].privileges));
                (async () => {
                  try {
                    const companyId = res.companyId;
                    const themeResp = await api(
                      themeApi.getCompanyTheme(companyId)
                    );
                    const theme =
                      themeResp?.data?.data || themeResp?.data || null;
                    if (theme) {
                      localStorage.setItem(
                        `theme_${companyId}`,
                        JSON.stringify(theme)
                      );
                      applyThemeToCssVariables(theme);
                    }
                  } catch (e) {
                  } finally {
                    history.push("/admin/dashboard");
                    setTimeout(() => window.location.reload(), 500);
                  }
                })();
              }
            });
          }
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const toggle = () => {
    setToggle(!toggle2);
  };

  useEffect(() => {
    if (user !== null && privileges !== null) {
      history.replace("/admin/dashboard");
    }
  }, [user, privileges]);

  const handleMicrosoftLogin = async () => {
    const data = await loginWithMicrosoft();
    const decoded = jwtDecode(data.accessToken);
    const email = decoded?.email;
    maLoginUser(email);
  };

  const maLoginUser = (email) => {
    setLoading(true);
    let response = dispatch(
      maLogin({
        email: email,
      })
    );
    response
      .then((res) => {
        if (res) {
          localStorage.setItem("user", JSON.stringify(res));
          localStorage.setItem("userRole", JSON.stringify(res.role));
          localStorage.setItem("userRoleId", JSON.stringify(res._id));
          localStorage.setItem(
            "userData",
            JSON.stringify({ ownerId: res._id, ownerName: res.name })
          );
          localStorage.setItem("selectedTab", JSON.stringify({ tab: "me" }));
          localStorage.setItem("companyId", JSON.stringify(res.companyId));
          setLoading(false);
          setError("");
          dispatch(setUser({ payload: res }));
          dispatch(
            setUserData({
              payload: { ownerId: res._id, ownerName: res.name },
            })
          );
          dispatch(setCompanyId(res.companyId));
          let role = res.role;
          let response = dispatch(getPrivilege(role, res.companyId));
          response.then(({ data }) => {
            if (data !== undefined && data.length > 0) {
              localStorage.setItem(
                "privileges",
                JSON.stringify(data[0].privileges)
              );
              dispatch(getPrivileges(data[0].privileges));
              (async () => {
                try {
                  const companyId = res.companyId;
                  const themeResp = await api(
                    themeApi.getCompanyTheme(companyId)
                  );
                  const theme =
                    themeResp?.data?.data || themeResp?.data || null;
                  if (theme) {
                    localStorage.setItem(
                      `theme_${companyId}`,
                      JSON.stringify(theme)
                    );
                    applyThemeToCssVariables(theme);
                  }
                } catch (e) {
                } finally {
                  history.push("/admin/dashboard");
                  setTimeout(() => window.location.reload(), 500);
                }
              })();
            }
          });
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Always brand as Vihanga for this deployment
  const dynamicLogo = logo2;
  const dynamicText = "Welcome To Vihanga";

  return (
    <Suspense fallback={t("Login.Loading")}>
      <div className="container-fluid row m-0 p-0 vh-100">
        <div className="col-md-6 col-xs-12 col-sm-12 text-center pt-lg-5 mt-lg-5">
          <div className="pt-5">
            <img className="logo1" src={dynamicLogo} alt="Logo" width={330} />
          </div>

          <div className="row mt-3">
            <div className="col-md-9 col-lg-9 col-sm-12 col-xs-12 mx-auto">
              <h2 className="mb-5">{t("Login.PageTitle")}</h2>

              <form onSubmit={submitLogin} className="pr-lg-5 pl-lg-5">
                <div className="form-group d-flex flex-column" style={{ textAlign: "start" }}>
                  <label className="label2 fs13 ">
                    {t("Login.UsernameLabel")}*
                  </label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type="text"
                    className="form-control border"
                    autoComplete="off"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setMessage("")}
                  />
                </div>

                <div className="form-group d-flex flex-column mt-3" style={{ textAlign: "start" }}>
                  <label className="label2 fs13 ">
                    {t("Login.PasswordLabel")}*
                  </label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type={toggle2 ? "text" : "password"}
                    className="form-control border"
                    value={password}
                    maxLength={16}
                    minLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setMessage("")}
                  />
                  <div className="relative">
                    <img
                      className="eye3"
                      src={toggle2 ? eye2 : eye}
                      onClick={toggle}
                      alt="Toggle Visibility"
                    />
                  </div>
                  <span className="error-message">{message}</span>
                </div>

                <div className="d-flex flex-row-reverse mb-4">
                  <Link to="/auth/forgotpassword">
                    <span className="fs-12 cursor-pointer">
                      {t("Login.ForgotPassword")}
                    </span>
                  </Link>
                </div>

                <button
                  className="font-weight-bold text-uppercase w-100 text-white border-0 login2 mb-3"
                  style={{
                    backgroundColor: "#466657",
                    borderRadius: "40px",
                    height: "40px",
                  }}
                  type={loading ? "button" : "submit"}
                  disabled={loading}
                >
                  {loading ? t("Login.LoggingIn") : t("Login.PageTitle")}
                  {loading ? <LoadingIndicator size={"1"} /> : null}
                </button>

                <span>{t("Login.or")}</span>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 p-0 m-0 bg-biscuit text-center pt-4 pb-4 d-none d-lg-block">
          <h5 className="text-green font-weight-bold mt-2">
            {dynamicText}
          </h5>
          <h3 className="mt-3">{t("Login.Tagline")}</h3>
          <div className="d-flex justify-content-center">
            <div className="col-md-10">
              <img className="img-fluid p-3" src={imageURLs.logobg} alt="Background" />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
