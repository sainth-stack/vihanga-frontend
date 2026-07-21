// Dashboard1.js
import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Card, useMediaQuery } from "@mui/material";
import TaskTable3 from "./table";
import OKRCard from "./employeeDetailsCard";
import { DoughnutChartComponent3 } from "../../chats/me/chat1";
import { DoughnutChartComponent4 } from "../../chats/me/chart2";
import ToggleTabs from "../../../../components/commonSwichButtons";
import { totalQuartersData } from "pages/Objectives/ObjectivesTable/getMonthsData";
import useGetEmployees, { useGetObjectives } from "pages/Objectives/hooks/useGetEmployees";
import { useSelector } from "react-redux";
import { AuthRole, OKRperiod, removeDuplicates } from "utilities";
import { tableGenerator } from "pages/Objectives/ObjectivesTable/transformTable";
import { useTranslation } from 'react-i18next';
import UserOnboarding from "react-user-onboarding";
import { useLocation } from "react-router-dom";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";

const Dashboard1 = () => {
  const { t } = useTranslation();
  const currentTab = useSelector((store) => store.user.currentTab);
  const location = useLocation();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px)");
  const isDesktop = useMediaQuery("(min-width: 961px)");

  const [companyInfo, setCompanyInfo] = useState({
    companyEntityName: "",
    employeeName: "",
    employeeNames: "",
    country: "",
    status: "Active",
    userId: 1,
    _id: null,
    okrPeriod: localStorage.getItem("okrPeriod") ? JSON.parse(localStorage.getItem("okrPeriod")).okrPeriod : "Q1",
    okrYear: localStorage.getItem("okrYear") ? JSON.parse(localStorage.getItem("okrYear")).okrYear : new Date().getFullYear().toString(),
    employeeId: localStorage.getItem("employeeId") ? JSON.parse(localStorage.getItem("employeeId")).employeeId : "",
  });

  const [loading, setLoading] = useState(false);
  const [topData, setTopData] = useState({});
  const { data: employeeResponse } = useGetEmployees();
  const user = JSON.parse(localStorage.getItem("user")) || null;
const companyId = getItemFromLocalStorage("companyId");
  const selectedTab = JSON.parse(localStorage.getItem("selectedTab")) || null;
  const [selected,setSelected] = useState(selectedTab?.tab || 'me')
  
  // Onboarding states and refs
  const [isVisible, setIsVisible] = useState(false);
  const createOKRRef = useRef();
  const actionMenuRef = useRef();
  const editButtonRef = useRef();
  const addKRRef = useRef();
  const { primaryColor, secondaryColors } = getThemeColors();
  const fetchEmployees = () => {
    try {
      const { data = [] } = employeeResponse || {};
      if (data?.length > 0) {
        const self = data.find(item => item._id === (user?._id || ''));
        const selfDept = self?.employmentInformation?.department;
        const updatedData = data.filter(item => {
          if (selectedTab?.tab === "me") {
            return user?._id === item._id;
          } else if (selectedTab?.tab === "myteam") {
            const lm = item?.employmentInformation?.lineManager;
            const lmStr = lm && lm._id ? lm._id.toString() : (lm || '').toString();
            const userIdStr = (user?._id || '').toString();
            return lmStr === userIdStr;
          } else if (selectedTab?.tab === "myfunction") {
            return user && selfDept && item.employmentInformation?.department === selfDept;
          } else {
            return user?._id === item._id;
          }
        }).map((item) => ({
          key: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
          value: item._id,
        }));

        const nonduplicates = removeDuplicates(updatedData, "key");
        const shouldDefaultAll = ["myteam", "myfunction", "mycompany"].includes(selectedTab?.tab);
        const updatedData2 = { 
          ...companyInfo,
          employeeName: nonduplicates[0]?.value || "",
          employeeNames: nonduplicates[0]?.key || "",
          // Default to "all" for team/function/company tabs to avoid double API calls
          employeeId: shouldDefaultAll ? "all" : (companyInfo.employeeId || ""),
          okrPeriod: OKRperiod[0]?.value || "Q1",
          okrYear: window.moment(new Date()).format('YYYY')
        };

        // Initialize localStorage if empty
        if (!localStorage.getItem("okrPeriod")) {
          localStorage.setItem("okrPeriod", JSON.stringify({ okrPeriod: "Q1" }));
        }
        if (!localStorage.getItem("okrYear")) {
          localStorage.setItem("okrYear", JSON.stringify({ okrYear: new Date().getFullYear().toString() }));
        }
        // Ensure employeeId is "all" by default for team/function/company tabs
        const existingEmpIdObj = localStorage.getItem("employeeId") ? JSON.parse(localStorage.getItem("employeeId")) : null;
        if (shouldDefaultAll) {
          if (!existingEmpIdObj || existingEmpIdObj.employeeId !== "all") {
            localStorage.setItem("employeeId", JSON.stringify({ employeeId: "all" }));
          }
        } else {
          if (!existingEmpIdObj) {
            localStorage.setItem("employeeId", JSON.stringify({ employeeId: "" }));
          }
        }
        if (!localStorage.getItem("userData") && nonduplicates[0]) {
          localStorage.setItem("userData", JSON.stringify({
            ownerName: nonduplicates[0].key,
            ownerId: nonduplicates[0].value,
          }));
        }

        setCompanyInfo(updatedData2);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [employeeResponse]);

  const { data: objectivesResponse, refetch,isLoading } = useGetObjectives({
    userId: user?._id, // Always use the logged-in user's ID
    companyId: companyId,
    type: selected,
    empId: companyInfo.employeeId, // Use employeeId for filtering (can be "all" or a specific employee ID)
    okrYear: companyInfo.okrYear,
  });

  const getData = (data) => {
    const existingUser = JSON.parse(localStorage.getItem("userData")) || null;
    
    console.log("getData called with:", {
      dataLength: data?.length,
      companyInfo,
      existingUser,
      selectedEmployeeId: companyInfo.employeeId
    });
    
    // Filter by employee number if selected, otherwise use existing logic
    let filteredData = data || [];
    
    if (companyInfo.employeeId && companyInfo.employeeId !== "all") {
      // Filter by multiple possible employee fields
      filteredData = data?.filter(
        (item) => 
          item.employeeReferenceId === companyInfo.employeeId ||
          item.owner === companyInfo.employeeId ||
          item._id === companyInfo.employeeId
      ) || [];
      
    } else if (selected === "me") {
      // Fallback to existing logic for employee name
      filteredData = data?.filter(
        (item) => item.employeeName === (existingUser?.ownerName || companyInfo.employeeNames)
      ) || [];
      
    } else {
      // For myteam/myfunction/mycompany with employeeId === "all", do not filter
      filteredData = data || [];
    }
    
    const result = tableGenerator(filteredData, filteredData.length, filteredData);
    const quartersData = totalQuartersData(result, companyInfo);
    
    
    setTopData(quartersData);
  };

  useEffect(() => {
    if (objectivesResponse?.data?.length > 0) {
      getData(objectivesResponse.data);
    }
  }, [objectivesResponse, companyInfo.okrYear, companyInfo.okrPeriod, companyInfo.employeeId]);

  // Onboarding tutorial effect
  useEffect(() => {
    if (location.state && location.state.story === "createOKRTutorial") {
      // Wait for the element to be rendered
      const checkAndActivate = () => {
        if (createOKRRef.current) {
          setIsVisible(location.state ? location.state.isVisible : false);
          window.history.replaceState({ isVisible: false }, document.title);
        } else {
          // Retry after a short delay if element not ready
          setTimeout(checkAndActivate, 100);
        }
      };
      
      setTimeout(checkAndActivate, 300);
    } else if (location.state && location.state.story === "story1") {
      // For update objective tutorial
      const checkAndActivate = () => {
        if (actionMenuRef.current) {
          setIsVisible(location.state ? location.state.isVisible : false);
          window.history.replaceState({ isVisible: false }, document.title);
        } else {
          // Retry after a short delay if element not ready
          setTimeout(checkAndActivate, 100);
        }
      };
      
      setTimeout(checkAndActivate, 300);
    } else if (location.state && location.state.story === "story3") {
      // For add KR to objective tutorial
      const checkAndActivate = () => {
        if (addKRRef.current) {
          setIsVisible(location.state ? location.state.isVisible : false);
          window.history.replaceState({ isVisible: false }, document.title);
        } else {
          // Retry after a short delay if element not ready
          setTimeout(checkAndActivate, 100);
        }
      };
      
      setTimeout(checkAndActivate, 300);
    }
  }, [location, createOKRRef, actionMenuRef, addKRRef]);

  // Add highlight class to tutorial elements when visible
  useEffect(() => {
    if (isVisible && location.state) {
      if (location.state.story === "createOKRTutorial" && createOKRRef.current) {
        createOKRRef.current.classList.add('tutorial-highlight');
      } else if (location.state.story === "story1") {
        if (actionMenuRef.current) {
          actionMenuRef.current.classList.add('tutorial-highlight');
        }
        if (editButtonRef.current) {
          editButtonRef.current.classList.add('tutorial-highlight');
        }
      } else if (location.state.story === "story3") {
        if (addKRRef.current) {
          addKRRef.current.classList.add('tutorial-highlight');
        }
      }
    } else {
      if (createOKRRef.current) {
        createOKRRef.current.classList.remove('tutorial-highlight');
      }
      if (actionMenuRef.current) {
        actionMenuRef.current.classList.remove('tutorial-highlight');
      }
      if (editButtonRef.current) {
        editButtonRef.current.classList.remove('tutorial-highlight');
      }
      if (addKRRef.current) {
        addKRRef.current.classList.remove('tutorial-highlight');
      }
    }
    
    return () => {
      // Cleanup on unmount
      if (createOKRRef.current) {
        createOKRRef.current.classList.remove('tutorial-highlight');
      }
      if (actionMenuRef.current) {
        actionMenuRef.current.classList.remove('tutorial-highlight');
      }
      if (editButtonRef.current) {
        editButtonRef.current.classList.remove('tutorial-highlight');
      }
      if (addKRRef.current) {
        addKRRef.current.classList.remove('tutorial-highlight');
      }
    };
  }, [isVisible, location]);

  // Story configuration for onboarding
  const createOKRStory = [
    {
      component: "tooltip",
      ref: createOKRRef,
      children: (
        <Box>
          <Typography>Click here to create a new OKR (Objective and Key Results)</Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
            You can choose to create from library or create a custom OKR
          </Typography>
        </Box>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <Box>
          <Typography>Thanks {user?.firstName || user?.name}!</Typography>
          <Typography>You have completed the Create OKR tutorial!</Typography>
          <Typography sx={{ mt: 2 }}>Now you know how to create objectives for your team.</Typography>
        </Box>
      ),
    },
  ];

  // Story configuration for update objective tutorial
  const updateObjectiveStory = [
    {
      component: "tooltip",
      ref: actionMenuRef,
      children: (
        <Box>
          <Typography>Click on the three dots (⋮) to open the actions menu</Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
            This menu contains options to Edit or Delete the objective
          </Typography>
        </Box>
      ),
    },
    {
      component: "tooltip",
      ref: editButtonRef,
      children: (
        <Box>
          <Typography>Click on "Edit" to update the objective</Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
            This will open the objective form where you can make changes
          </Typography>
        </Box>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <Box>
          <Typography>Great job {user?.firstName || user?.name}!</Typography>
          <Typography>You have completed the Update Objective tutorial!</Typography>
          <Typography sx={{ mt: 2 }}>Now you know how to edit your objectives.</Typography>
        </Box>
      ),
    },
  ];

  // Story configuration for add KR to objective tutorial
  const addKRStory = [
    {
      component: "tooltip",
      ref: addKRRef,
      children: (
        <Box>
          <Typography>Click on the plus (+) icon to add a Key Result to this objective</Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
            Key Results are measurable outcomes that track the progress of your objective
          </Typography>
        </Box>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <Box>
          <Typography>Excellent {user?.firstName || user?.name}!</Typography>
          <Typography>You have completed the Add Key Result tutorial!</Typography>
          <Typography sx={{ mt: 2 }}>Now you know how to add key results to your objectives.</Typography>
        </Box>
      ),
    },
  ];

  const getStory = () => {
    if (location.state?.story === "createOKRTutorial") {
      return createOKRStory;
    } else if (location.state?.story === "story1") {
      return updateObjectiveStory;
    } else if (location.state?.story === "story3") {
      return addKRStory;
    }
    return [];
  };

  return (
    <Card sx={{ 
      padding: isMobile ? "10px" : isTablet ? "15px" : "20px", 
      borderRadius: "16px", 
      backgroundColor: secondaryColors.white, 
      margin: isMobile ? "10px" : isTablet ? "15px" : "20px",
    }}>
      {/* Header Section - Responsive with horizontal scroll */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: isMobile ? "15px" : isTablet ? "18px" : "20px",
        overflowX: isMobile || isTablet ? "auto" : "",
        width: "100%"
      }}>
        <Typography sx={{ 
          backgroundColor: "#FFFCD2", 
          padding: isMobile ? "4px 12px" : isTablet ? "4px 20px" : "4px 28px", 
          color: "#0E0E0E", 
          fontFamily: "Montserrat", 
          fontWeight: 600, 
          fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px", 
          borderRadius: "20px",
          textAlign: isMobile ? "center" : "left",
          width: isMobile ? "100%" : "auto",
          minWidth: isMobile ? "280px" : isTablet ? "320px" : "auto",
          whiteSpace: isMobile || isTablet ? "nowrap" : "normal",
          flexShrink: 0
        }}>
          {t("ObjectivesDashboard.GreetingOffTrack", { name: user?.firstName })}
        </Typography>
      </Box>

      {/* Charts Section - Responsive Layout */}
      <Box sx={{ 
        display: "flex", 
        width: "100%", 
        gap: isMobile ? "8px" : isTablet ? "10px" : "12px", 
        height: isMobile ? "auto" : isTablet ? "auto" : "294px", 
        margin: isMobile ? "10px 0" : isTablet ? "15px 0" : "20px",
        flexDirection: isMobile ? "column" : isTablet ? "column" : "row",
      }}>
        {/* OKR Card - Full width on mobile/tablet, flex: 2 on desktop */}
        <Box sx={{ 
          flex: isMobile || isTablet ? "none" : 2,
          width: isMobile || isTablet ? "100%" : "auto",
          marginBottom: isMobile || isTablet ? "15px" : "0",

        }}>
          <OKRCard companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
        </Box>

        {/* Charts Container - Responsive layout */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : isTablet ? "row" : "row",
          gap: isMobile ? "8px" : isTablet ? "10px" : "12px",
          flex: isMobile || isTablet ? "none" : 2.5,
          width: isMobile || isTablet ? "100%" : "auto"
        }}>
          {/* Doughnut Chart 4 */}
          <Box sx={{ 
            flex: isMobile ? "none" : isTablet ? 1 : 1,
            width: isMobile ? "100%" : "auto",
            marginBottom: isMobile ? "10px" : "0"
          }}>
            <DoughnutChartComponent4 
              topData={topData}  
              companyInfo={companyInfo} 
              setCompanyInfo={setCompanyInfo} 
            />
          </Box>

          {/* Doughnut Chart 3 */}
          <Box sx={{ 
            flex: isMobile ? "none" : isTablet ? 1.2 : 1.5,
            width: isMobile ? "100%" : "auto"
          }}>
            <DoughnutChartComponent3 
              topData={topData}  
              companyInfo={companyInfo} 
              setCompanyInfo={setCompanyInfo}
            />
          </Box>
        </Box>
      </Box>

      {/* Table Section */}
      <Box sx={{ 
        margin: isMobile ? "5px" : isTablet ? "8px" : "10px",
        overflowX: isMobile || isTablet ? "auto" : ""
      }}>
        <TaskTable3 
          data={objectivesResponse} 
          refetchObjectives={refetch} 
          isLoading={isLoading}
          selectedTab={selected}
          createOKRRef={createOKRRef}
          actionMenuRef={actionMenuRef}
          editButtonRef={editButtonRef}
          addKRRef={addKRRef}
        />
      </Box>

      {/* Onboarding Component */}
      <UserOnboarding
        story={location.state ? getStory() : []}
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false);
        }}
      />

      {/* CSS Styles for tutorial */}
      <style>{`
        /* Fix broken cancel icon in react-user-onboarding */
        img[alt="cancel"] {
          display: none !important;
        }
        
        img[alt="cancel"]::before {
          content: '✕';
          font-size: 24px;
          color: #666;
          cursor: pointer;
          font-weight: 300;
          display: inline-block;
        }
        
        /* Target the cancel button container */
        [class*="cancel"] {
          position: relative;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        [class*="cancel"]::after {
          content: '✕';
          font-size: 24px;
          color: #666;
          cursor: pointer;
          font-weight: 300;
          line-height: 1;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        [class*="cancel"]:hover::after {
          color: #333;
        }
        
        /* Tutorial highlight effect */
        .tutorial-highlight {
          position: relative;
          z-index: 9999 !important;
          box-shadow: 0 0 0 4px rgba(131, 127, 57, 0.4) !important;
          border-radius: 100px !important;
          animation: pulse 2s infinite;
        }
        
        /* Highlight for menu items */
        li.tutorial-highlight {
          border-radius: 8px !important;
          background-color: rgba(131, 127, 57, 0.1) !important;
        }
        
        /* Highlight for images/icons */
        img.tutorial-highlight {
          border-radius: 50% !important;
          padding: 4px;
          background-color: rgba(131, 127, 57, 0.1);
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 4px rgba(131, 127, 57, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(131, 127, 57, 0.2);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(131, 127, 57, 0.4);
          }
        }
      `}</style>
    </Card>
  );
};

export default Dashboard1;