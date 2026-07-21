import React from "react";
import { ListItem, Tooltip, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Icon from "@mui/material/Icon";
import CustomTypography from "../TypoGraphy/CustomTypography";

const CustomListItem = ({ name, icon, path = "/", isMobile, isCollapsed }) => {

  console.log("isCollapsed", isCollapsed);
  const location = useLocation();
  const isActive = location.pathname === path;

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:960px)");

  return (
    <Tooltip title={isCollapsed ? name : ""} placement="right">
      <ListItem
        button
        component={Link}
        to={path}
        sx={{
          maxWidth: isSmallScreen ? "7rem" : isMediumScreen ? "7rem" : "12rem",
          display: "flex",
          justifyContent: isMobile || isCollapsed ? "center" : "flex-start",
          padding: isMobile ? "0.3rem" : ".2rem",
          backgroundColor: "#BEA781",
          color: "#fff",
          borderRadius: "2.5rem",
          margin: isCollapsed ? "1rem 0rem 1rem 0rem" : "1rem 0rem 1rem .5rem",
          transition: "all 0.3s ease",
          boxShadow: "none",
          minHeight: "2rem",
          padding:"8px 5px 8px 5px",
          "&:hover": {
            color: "#BEA781 !important",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {/* Icon */}
        {typeof icon === "string" ? (
          <Icon
            sx={{
              fontSize: isSmallScreen
                ? "1rem"
                : isMediumScreen
                ? "1.2rem"
                : "1.5rem",
              margin: isSmallScreen || isCollapsed ? ".3rem" : "0 .5rem",
              transition: "color 0.3s ease, transform 0.3s ease",
              transform: isActive ? "scale(1.1)" : "scale(1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Icon>
        ) : (
          React.cloneElement(icon, {
            sx: {
              fontSize: isSmallScreen
                ? "1rem"
                : isMediumScreen
                ? "1.2rem"
                : "1.5rem",
              margin: isSmallScreen || isCollapsed ? ".3rem" : "0 .5rem",
              transition: "transform 0.3s ease",
              transform: isActive ? "scale(1.1)" : "scale(1)",
              display: "flex",
              
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                color: "#BEA781 !important",
              },
            },
          })
        )}

        {!isMobile && !isCollapsed && (
          <CustomTypography
            primary={name}
            sx={{
              fontSize: isSmallScreen
                ? "0.6rem"
                : isMediumScreen
                ? "0.75rem"
                : "17px",
              width: "100%",
              transition: "color 0.3s ease",
              whiteSpace: "wrap",
              textOverflow: "ellipsis",
              fontWeight: "500",
            }}
          >
            {name}
          </CustomTypography>
        )}
      </ListItem>
    </Tooltip>
  );
};

export default CustomListItem;
