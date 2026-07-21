import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import CustomButton from "../Button/CustomButton";

const CustomSwitchButton = ({
  sx={},
  options = [],
  activeOption,
  onChange,
  activeBgColor = "#837F39",
  inactiveBgColor = "#f5f5f5",
  activeColor = "#fff",
  inactiveColor = "#837F39",
  borderRadius = "2rem",
  buttonPadding = ".4rem 2rem",
  defaultSelected = "", // initial selected option if parent does not control
}) => {
  const [selected, setSelected] = useState(defaultSelected);

  useEffect(() => {
    if (activeOption !== undefined) {
      setSelected(activeOption);
    }
  }, [activeOption]);

  const handleSwitch = (value) => {
    setSelected(value);
    if (onChange) onChange(value); // Call parent callback
  };

  const currentSelected = activeOption !== undefined ? activeOption : selected;

  return (
    <Box
      sx={{
        display: "inline-flex",
         backgroundColor: "#F4F4F4 !important",
        borderRadius: borderRadius,
        padding: "4px",
        ...sx

      }}
    >
      {options.map((option) => (
        <CustomButton
          key={option.value}
          text={option.label}
          onClick={() => handleSwitch(option.value)}
          backgroundColor={
            currentSelected === option.value ? activeBgColor : inactiveBgColor
          }
          color={currentSelected === option.value ? activeColor : inactiveColor}
          border="none"
          fontSize="12px"
          fontWeight="600"
          hoverColor={
            currentSelected === option.value ? activeBgColor : inactiveBgColor
          }
          iconExists={true} 
          IconProp={() => <></>} 
          iconPosition="start"
          sx={{
            padding: buttonPadding,
            borderRadius: borderRadius,
            minWidth: "100px",
            boxShadow: "none !important",
          }}
        />
      ))}
    </Box>
  );
};

export default CustomSwitchButton;
