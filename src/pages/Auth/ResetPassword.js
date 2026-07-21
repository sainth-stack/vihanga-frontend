import React, { useState, Suspense } from "react";
import { useDispatch } from "react-redux";
import { LoadingIndicator, Validator } from "../../utilities";
import { resetpassword } from "action/UserAct";
import "./styles.scss";
import eye from "../../assets/svg/eye-fill.svg";
import eye2 from "../../assets/svg/eye-slash.svg";
import { history } from "service/helpers";
import { useParams } from "react-router-dom";
import { imageURLs } from "utilities/imageURLs";
export default function ResetPassword() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [toggle2, setToggle] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [, forceUpdate] = useState(false);
  const dispatch = useDispatch();
  const [, setError] = useState(false);
  const validator = Validator();
  const submitLogin = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      setLoading(true);
      let response = dispatch(
        resetpassword({
          token,
          password: password,
        })
      );
      response
        .then((res) => {
          if (res.success) {
            setLoading(false);
            setError("");
            history.push("/auth/login");
          }
        })
        .catch((e) => {
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
  const toggle11 = () => {
    setToggle3(!toggle3);
  };
  return (
    <Suspense fallback='Loading'>
      <div className="container-fluid row m-0 p-0 vh-100">
        <div className="col-md-6 col-xs-12 col-sm-12 text-center pt-lg-5 mt-lg-5">
          <div className="pt-5">
            <img className="logo1" src={imageURLs.Logo} alt="Logo" width={330} />
          </div>
          <div className="row mt-3">
            <div className="col-md-9 col-lg-9 col-sm-12 col-xs-12 mx-auto">

              <h2 className="mb-5">
                Reset Password
              </h2>

              <form onSubmit={submitLogin} className="pr-lg-5 pl-lg-5">
                <div
                  className="form-group d-flex flex-column"
                  style={{ textAlign: "start" }}
                >
                  <label className="label2 fs13 ">New Password*</label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type={toggle3 ? "text" : "password"}
                    className="form-control border"
                    id="username"
                    name="username"
                    autoComplete="off"
                    maxLength={16}
                    minLength={8}
                    value={password}
                    // required
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setMessage("")}
                  />
                  <div className="relative">
                    <img
                      className="eye3"
                      src={toggle3 ? eye2 : eye}
                      onClick={toggle11}
                      alt="Logo"
                    />
                  </div>
                  {/* {validator.current.message(
                    "Password ",
                    password,
                    "required|password"
                  )} */}
                </div>

                <div
                  className="form-group d-flex flex-column mt-3"
                  style={{ textAlign: "start" }}
                >
                  <label className="label2 fs13 ">Confirm New Password*</label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type={toggle2 ? "text" : "password"}
                    className="form-control border"
                    id="password"
                    name="password"
                    value={password2}
                    maxLength={16}
                    minLength={8}
                    // required
                    onChange={(e) => setPassword2(e.target.value)}
                    onFocus={() => setMessage("")}
                  />
                  <div className="relative">
                    <img
                      className="eye3"
                      src={toggle2 ? eye2 : eye}
                      onClick={toggle}
                      alt="Logo"
                    />
                  </div>
                  {/* {validator.current.message(
                    "Confirm Password",
                    password2,
                    "required|password"
                  )} */}
                  <span className="error-message">{message}</span>
                </div>

                {password && password2 && password !== password2 && <span className="error-message text-danger fs-12 mb-2">Passwords must match!</span>}
                <button
                  className="font-weight-bold text-uppercase w-100 text-white border-0 login2"
                  style={{
                    backgroundColor: "#466657",
                    borderRadius: "40px",
                    height: "40px",
                  }}
                  type={loading ? "button" : "submit"}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset"} {loading ? <LoadingIndicator size={"1"} /> : null}
                </button>
              </form>
              {/*<div className="account2">{t("Don't Have An Account?")}</div>
              <Link to="/auth/register" className="text-decoration-none register2">
                <span>  {t("Register")}</span>
              </Link>
              <div>
                <select
                  onChange={(e) => changeLanguage(e)}
                  className="text-shadow-sm text-lg bg-transparent"
                >
                  <option className="bg bg-dark" value="English">EN</option>
                  <option className="bg bg-dark" value="Deutsch">DE</option>
                  <option className="bg bg-dark" value="tel">TEL</option>
                </select>
              </div>*/}
            </div>
          </div>
        </div>
        <div className="col-md-6 p-0 m-0 bg-biscuit text-center pt-4 pb-4 d-none d-lg-block">
          <h5 className="text-green font-weight-bold mt-2">WELCOME TO TALENT SPOTIFY</h5>
          <h3 className="mt-3">Find The Most Exciting OKR Experience<br />
            For Your Business</h3>
          <div className="d-flex justify-content-center">
            <div className="col-md-10">
              <img className="img-fluid p-3" src={imageURLs.logobg} alt="Logo" />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
