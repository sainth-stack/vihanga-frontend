import React from "react";
import noInternet from "assets/images/no-internet.png";
import useWindowSize from "components/UseWindowSize";
const devNoInternet = require("assets/svg/dev-placeholder.svg");
const isDev = process.env.NODE_ENV === 'development';

const NoInternet = React.memo(() => {
  const isMobile = useWindowSize();
  return (
    <div className="d-flex flex-column text-center vh-100 justify-content-center align-items-center">
      <img
        src={isDev ? devNoInternet : noInternet}
        alt="No Internet Connection"
        className={`${isMobile ? "w-100" : ""}`}
      />
      <h1 className="text-danger">NO INTERNET CONNECTION</h1>
    </div>
  );
});

export default NoInternet;
