import React from "react";

const Header = ({ text, style = {} }) => {
  return (
    <div
      style={{
        fontFamily: "Montserrat",
        fontWeight: 700,
        fontSize: "20px",
        lineHeight: "28px",
        letterSpacing: "0%",
        ...style, // allow override or add extra styling
      }}
    >
      {text}
    </div>
  );
};

export default Header;
