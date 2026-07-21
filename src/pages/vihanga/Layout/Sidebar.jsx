import React, { useState } from "react";
import { Box, List, useMediaQuery, IconButton, Tooltip } from "@mui/material";
import CustomListItem from "../components/CustomListItem/CustomListItem";
import CustomImage from "../components/CustomImage/CustomImage";

import AdsClickOutlinedIcon from "@mui/icons-material/AdsClickOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const sidebarConfigs = {
  "/": {
    default: [
      {
        name: "Dashboard",
        icon: <DashboardOutlinedIcon />,
        path: "/dashboard",
      },
      {
        name: "Objectives",
        icon: <AdsClickOutlinedIcon />,
        path: "/objectives",
      },
      { name: "Tasks", icon: <ChecklistOutlinedIcon />, path: "/tasks" },
      { name: "Reviews", icon: <AssignmentOutlinedIcon />, path: "/reviews" },
      {
        name: "Reward Redemption",
        icon: <EmojiEventsOutlinedIcon />,
        path: "/reward-redemption",
      },
      {
        name: "Recruitment CRM",
        icon: <PeopleAltOutlinedIcon />,
        path: "/recruitment-crm",
      },
    ],
  },
};

const getSidebarConfig = (basePath = "/") => {
  return sidebarConfigs[basePath] || { default: [] };
};

function Sidebar({ basePath }) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px) and (min-width: 601px)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log("isCollapsed in sidebar", isCollapsed);
  const selectedSidebar = getSidebarConfig(basePath);
  const sidebarWidth = isMobile ? 80 : isCollapsed ? 80 : isTablet ? 150 : 242;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        height: "100%",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
        flexShrink: 0,
        backgroundColor: "#BEA781",
        transition: "width 0.3s ease",
        display: "flex",
        zIndex: 1000,
        position: "absolute",
        flexDirection: "column",
        borderRadius: "1.2rem",
      }}
    >
      {/* Collapse Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "flex-end",
          p: "0.5rem",
        }}
      >
        <Tooltip title={isCollapsed ? "Expand" : "Collapse"}>
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{
              boxShadow: "1px 2px 3px gray",
              backgroundColor: "#fff",
            }}
          >
            {isCollapsed ? <ArrowForwardIosIcon /> : <ArrowBackIosNewIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Logo */}
      {!isCollapsed && !isMobile && (
        <Box sx={{ display: "flex", alignItems: "center" }}></Box>
      )}

      {/* Sidebar Menu */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <List
          sx={{
            flexGrow: 1,
          }}
        >
          {selectedSidebar.default.map((item, index) => (
            <CustomListItem
              key={index}
              name={item.name}
              icon={item.icon}
              path={item.path}
              isMobile={isMobile}
              isCollapsed={isCollapsed}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default Sidebar;
