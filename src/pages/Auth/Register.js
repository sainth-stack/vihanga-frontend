import React, { useState, Suspense } from "react";
import { LoadingIndicator, Role, Validator } from "../../utilities";
import "./styles.scss";
import { register } from "action/UserAct";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import eye from "../../assets/svg/eye-fill.svg";
import eye2 from "../../assets/svg/eye-slash.svg";
import { history } from "service/helpers";
import { imageURLs } from "utilities/imageURLs";
export default function Register() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [toggle2, setToggle] = useState(false);
  const [, setError] = useState(false);
  const [, forceUpdate] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const validator = Validator();
  const submiRegister = (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      setLoading(true);
      let response = dispatch(register(data));
      response
        .then((res) => {
          if (res) {
            localStorage.setItem("user", JSON.stringify(res));
            localStorage.setItem("userRole", JSON.stringify(res.role));
            localStorage.setItem("selectedTab", JSON.stringify({ tab: "me" }));
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
  const handleChange = ({ target: { name, value } }) => {
    let updatedData = { ...data };
    updatedData[name] = value;
    setData(updatedData);
  };
  let options1 = Role;
  let updatedOptions1 = options1.map((item) => ({ ...item, label: item.key }));
  return (
    <Suspense fallback='Loading'>
      <div className="container-fluid row m-0 p-0 vh-100">
        <div className="col-md-6 col-xs-12 col-sm-12 text-center pt-4">
          <div className="pt-4">
            <img className="logo1" src={imageURLs.Logo} alt="Logo" width={330} />
          </div>
          <div className="row mt-4">
            <div className="col-md-9 col-lg-9 col-sm-12 col-xs-12 mx-auto">

              <h2 className="mb-5">
                Register
              </h2>

              <form onSubmit={submiRegister} className="pr-lg-5 pl-lg-5" >
                <div
                  className="form-group d-flex flex-column"
                  style={{ textAlign: "start" }}
                >
                  <label className="label2 fs13 ">User Name*</label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type="text"
                    className="form-control border"
                    id="name"
                    name="name"
                    autoComplete="off"
                    value={data.name}
                    // required
                    onChange={handleChange}
                    onFocus={() => setMessage("")}
                  />
                  {/* {validator.current.message(
                    "Username ",
                    data.name,
                    "required"
                  )} */}
                </div>
                <div
                  className="form-group d-flex flex-column"
                  style={{ textAlign: "start" }}
                >
                  <label className="label2 fs13 ">Email*</label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type="text"
                    className="form-control border"
                    id="email"
                    name="email"
                    autoComplete="off"
                    value={data.email}
                    // required
                    onChange={handleChange}
                    onFocus={() => setMessage("")}
                  />
                  {/* {validator.current.message(
                    "Email",
                    data.email,
                    "required|email"
                  )} */}
                </div>
                <div
                  className="form-group d-flex flex-column"
                  style={{ textAlign: "start" }}
                >
                  <label className="label2 fs13 ">Role*</label>
                  <div style={{ textAlign: "start" }}>
                    {updatedOptions1 !== undefined &&
                      updatedOptions1.length > 0 && (
                        <select
                          style={{ borderRadius: "50px", height: "37px" }}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "role",
                                value: e.target.value,
                                label: e.label,
                              },
                            })
                          }
                          className="custom-dropdown col-md-12 drop"
                        >
                          {updatedOptions1.map((option, index) => (
                            <option value={option.value} key={index}>
                              {option.value}
                            </option>
                          ))}
                        </select>
                      )}
                    {/* {validator.current.message(
                      "Role",
                      data.role,
                      "required|role"
                    )} */}
                  </div>
                </div>
                <div
                  className="form-group d-flex flex-column"
                  style={{ textAlign: "start" }}
                >
                  <label className="label2 fs13 ">Password*</label>
                  <input
                    style={{ borderRadius: "40px" }}
                    type={toggle2 ? "text" : "password"}
                    className="form-control border"
                    id="password"
                    name="password"
                    value={data.password}
                    maxLength={16}
                    minLength={8}
                    onChange={handleChange}
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
                    "Password",
                    data.password,
                    "required|password"
                  )} */}
                  <span className="error-message">{message}</span>
                </div>
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
                  {loading ? "Signing Up..." : "Register"} {loading ? <LoadingIndicator size={"1"} /> : null}
                </button>
              </form>
              <div className="mt-3">Already Have An Account?</div>
              <Link to="/auth/login" className="text-decoration-none login1">
                <span>  Login</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 p-0 m-0 bg-biscuit text-center pt-4 pb-4 d-none d-lg-block">
          <h5 className="text-green  font-weight-bold mt-2">WELCOME TO VIHANGA</h5>
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
