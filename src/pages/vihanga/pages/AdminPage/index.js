// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Grid,Box, Typography, TextField, InputAdornment } from "@mui/material";
import CommonCard from "./components/CustomCard";
import {AdminPanelSettings,	Tune,Verified,TrackChanges,Assessment,Merge,Category,Quiz,RocketLaunch,EmojiEvents,Search ,Notifications} from '@mui/icons-material'
import { useTranslation } from 'react-i18next';

// Import MUI icons
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

const TalentSpotify = () => {
  const { t } = useTranslation();
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const ICON_BG_COLOR = "#fff";
  const cssPrimary =
    (typeof window !== "undefined" &&
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ts-primary")
        ?.trim()) ||
    "rgb(131, 127, 57)";
  const ICON_BORDER_COLOR = cssPrimary;
  const ICON_COLOR = cssPrimary;
  const ICON_BOX_SX = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: "50%",
    backgroundColor: ICON_BG_COLOR,
    border: `2px solid ${ICON_BORDER_COLOR}`,
  };
  const cardsData = [
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <HomeIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: t("AdminPage.RolesAndPrivileges.Title"),
      description: t("AdminPage.RolesAndPrivileges.Description"),
      link: "/admin/previlages/rolesandprevilages",
      permissionKey: "Roles & Privileges",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <AssignmentIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: "Error Logs",
      description: "Track and filter backend errors by date, module and stage",
      link: "/admin/previlages/error-logs",
      permissionKey: "Error Logs",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <GroupIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: t("AdminPage.RecruitmentManagement.Title"),
      description: t("AdminPage.RecruitmentManagement.Description"),
      link: "/admin/previlages/RecruitmentManagement",
      permissionKey: "Recruitment Management",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <WorkIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: t("AdminPage.UploadLeaves.Title"),
      description: t("AdminPage.UploadLeaves.Description"),
      link: "/admin/previlages/upload-leaves",
      permissionKey: "Upload Leaves",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <WorkIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: t("AdminPage.AttendanceUpload.Title"),
      description: t("AdminPage.AttendanceUpload.Description"),
      link: "/admin/previlages/upload-attendance",
      permissionKey: "Attendance Upload",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <GroupIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: "Active Sessions",
      description: "View and export active sessions and inactive users",
      link: "/admin/previlages/active-sessions",
      permissionKey: "Active Sessions",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <CloudUploadIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: t("AdminPage.ApprovalWorkflow.Title"),
      description: t("AdminPage.ApprovalWorkflow.Description"),
       link: "/admin/approval-workflow",
      permissionKey: "Approval WorkFlow",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <CloudUploadIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: t("AdminPage.AssetManagement.Title"),
      description: t("AdminPage.AssetManagement.Description"),
       link: "/admin/previlages/asset-management",
      permissionKey: "Asset Management",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <Tune sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: "Theme Settings",
      description:
        "Customize your application's theme colors visual appearance",
      link: "/admin/previlages/AdminCenter/ThemeSettings",
      permissionKey: "Theme Settings",
    },
    {
      icon: (
        <Box sx={ICON_BOX_SX}>
          <AdminPanelSettings sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
      title: "Company Configurations",
      description: "Manage company-specific feature flags and config (e.g. Google Sheet)",
      link: "/admin/previlages/AdminCenter/CompanyConfigurations",
      permissionKey: "Company Configurations",
    },
     {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <VerifiedUserIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.LeaveType.Title"),
          description: t("AdminPage.LeaveType.Description"),
           link: "/admin/previlages/leave-type",
          permissionKey: "Leave Type",
        },
        {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Inventory2Icon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.HolidaysCalendar.Title"),
          description: t("AdminPage.HolidaysCalendar.Description"),
           link: "/admin/previlages/holidays-calendar",
          permissionKey: "Holidays Calendar",
        },
        {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <AccessTimeIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.EligibilityCriteria.Title"),
          description: t("AdminPage.EligibilityCriteria.Description"),
           link: "/admin/previlages/eligibitity-criteria",
          permissionKey: "Eligibility Criteria",
        },
        {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <UploadFileIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.PrivilegeGroups.Title"),
          description: t("AdminPage.PrivilegeGroups.Description"),
           link: "/admin/previlages/privilegegroups",
          permissionKey: "Privilege Groups",
        },
        {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <AssignmentIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.OKRManagement.Title"),
          description: t("AdminPage.OKRManagement.Description"),
           link: "/admin/previlages/okrmanagement",
          permissionKey: "OKR Management",
        },
        {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Search sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.Lookups.Title"),
          description: t("AdminPage.Lookups.Description"),
           link: "/admin/previlages/Lookups",
          permissionKey: "Lookups",
        },
         {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <EmojiEvents sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.RewardManagement.Title"),
          description: t("AdminPage.RewardManagement.Description"),
           link: "/admin/previlages/rewardsManagement",
          permissionKey: "Rewards Management",
        },
         {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Category sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.CatalogManagement.Title"),
          description: t("AdminPage.CatalogManagement.Description"),
           link: "/admin/previlages/catalogManagement",
          permissionKey: "Catalog Management",
        },
         {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Notifications sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.NotificationManagement.Title"),
          description: t("AdminPage.NotificationManagement.Description"),
           link: "/admin/settings/notificationsettings",
          permissionKey: "Notification Settings",
        },
          {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <TrackChanges sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.AdvancedPerformanceManagement.Title"),
          description: t("AdminPage.AdvancedPerformanceManagement.Description"),
           link: "/admin/previlages/performanceManagement",
          permissionKey: "Advanced Performance Management",
        },
          {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Merge sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.IntegrationManagement.Title"),
          description: t("AdminPage.IntegrationManagement.Description"),
           link: "/admin/previlages/integrationManagement",
          permissionKey: "Integration Management",
        },
          {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Quiz sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.QuestionnaireManagement.Title"),
          description: t("AdminPage.QuestionnaireManagement.Description"),
           link: "/admin/previlages/questionnaireManagement",
          permissionKey: "Questionaire Management",
        },
          {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Verified sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.CompetencyManagement.Title"),
          description: t("AdminPage.CompetencyManagement.Description"),
           link: "/admin/previlages/competencyManagement",
          permissionKey: "Competency Management",
        },

          {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Assessment sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.PerformanceManagementTemplates.Title"),
          description: t("AdminPage.PerformanceManagementTemplates.Description"),
           link: "/admin/previlages/templatesPerformanceManagement",
          permissionKey: "Performance Management Templates",
        },

          {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <EventIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.LaunchFormsManagement.Title"),
          description: t("AdminPage.LaunchFormsManagement.Description"),
           link: "/admin/previlages/launchFormsPerformanceManagement",
          permissionKey: "Launch Forms Management",
        },
         {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <Tune sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.CalibrationManagement.Title"),
          description: t("AdminPage.CalibrationManagement.Description"),
           link: "/admin/previlages/calibrationManagement",
          permissionKey: "Calibration Management",
        },

         {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <RocketLaunch sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: t("AdminPage.AdvancedLaunchFormsManagement.Title"),
          description: t("AdminPage.AdvancedLaunchFormsManagement.Description"),
           link: "/admin/previlages/advanced-launchFormsPerformanceManagement",
          permissionKey: "Advanced Launch Forms Management",
        },
        {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <AssignmentIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: "Document Type Management",
          description: "Create and manage document types with dynamic fields",
          link: "/admin/previlages/document-type",
          permissionKey: "Document Type Management",
          allowedRoles: ["Super Admin", "HR Admin"], // Only for Super Admin and HR Admin
        },
        
        {
          icon: (
        <Box sx={ICON_BOX_SX}>
          <VerifiedUserIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
        </Box>
      ),
          title: "Document Approval Management",
          description: "View and manage all document approvals",
          link: "/admin/previlages/document-submissions",
          permissionKey: "Document Approval Management",
          allowedRoles: ["Super Admin", "HR Admin"], // For all roles
        },
        {
          icon: (
            <Box sx={ICON_BOX_SX}>
              <WorkIcon sx={{ fontSize: 32, color: ICON_COLOR }} />
            </Box>
          ),
          title: "Career Jobs",
          description: "Add job openings and view applications for each role",
          link: "/admin/previlages/career-jobs",
          permissionKey: "Career Jobs",
        },

  ];

  useEffect(() => {
    // Get user privileges from localStorage
      const privileges = getItemFromLocalStorage("privileges");
    
    // Get user role from user object in localStorage
    const user = localStorage.getItem("user") !== null 
      ? JSON.parse(localStorage.getItem("user")) 
      : null;
    const userRole = user ? user.role : null;
    
    let availableCards = [];
    
    if (userRole === "Super Admin") {
      // Super Admin sees all cards
      availableCards = cardsData;
    } else if (!privileges || privileges.length === 0) {
      // No privileges, show no cards
      availableCards = [];
    } else {
      // Filter cards based on user privileges
      const privilegesCategoryOnly = privileges.filter((item) => item.category === 'Previleges');
      
      availableCards = cardsData.filter((card) => {
        // Check if user has permission (view, edit, or delete)
        const hasPermission = privilegesCategoryOnly.some(
          (privilege) => privilege.page === card.permissionKey && (privilege.view || privilege.edit || privilege.delete)
        );
        
        // Check if user role is allowed for this card
        const isRoleAllowed = !card.allowedRoles || card.allowedRoles.includes(userRole);
        
        return hasPermission && isRoleAllowed;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim() === "") {
      setFilteredCards(availableCards);
    } else {
      const searchFilteredCards = availableCards.filter((card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCards(searchFilteredCards);
    }
  }, [searchTerm, t]);

  return (
   <Box>
    <Box sx={{marginTop:"30px",marginBottom:"50px",marginLeft:"100px",}}>
        <Typography sx={{color:"#0E0E0E",fontSize:"40px",fontWeight:"600",fontFamily:"Montserrat",marginBottom:"10px"}}>{t("AdminPage.PageTitle")}</Typography>
        <Typography sx={{color:"#707070",fontweight:"400",fontSize:"20px",fontFamily:"Work Sans",marginBottom:"30px"}}>{t("AdminPage.PageSubtitle")}</Typography>
        
        <TextField
          placeholder={t("AdminPage.SearchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: "500px",
            "& .MuiOutlinedInput-root": {
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              "& fieldset": {
                borderColor: "#E0E0E0",
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: "rgb(131, 127, 57)",
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "rgb(131, 127, 57)",
                borderWidth: "2px",
              },
            },
            "& .MuiInputBase-input": {
              padding: "0 16px",
              fontSize: "16px",
              fontFamily: "Work Sans",
              height: "24px",
              "&::placeholder": {
                color: "#9E9E9E",
                opacity: 1,
                fontSize: "16px",
                fontFamily: "Work Sans",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ marginLeft: "12px" }}>
                <Search sx={{ 
                  color: "#707070",
                  fontSize: "22px"
                }} />
              </InputAdornment>
            ),
          }}
        />
    </Box>

     <Box sx={{paddingLeft:"100px",paddingRight:"100px",marginBottom:"50px"}} >
    <Grid container spacing={3}>
      {filteredCards.map((card, index) => (
        <Grid item xs={12} sm={12} md={12} lg={3} xl={4} key={index}>
          <CommonCard
            icon={card.icon}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        </Grid>
      ))}
    </Grid>
    </Box>
    </Box>
  );
};

export default TalentSpotify;
