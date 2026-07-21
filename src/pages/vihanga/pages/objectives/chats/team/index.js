// Dashboard1.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Card, useMediaQuery } from "@mui/material";
import TaskTable3 from "../../dashboard/screen1/table";
import OKRCard1 from "./form";
import { DoughnutChartComponent1 } from "../chat";
import { DoughnutChartComponent2 } from "../chat2";
import ToggleTabs from "../../../../components/commonSwichButtons";
import { totalQuartersData } from "pages/Objectives/ObjectivesTable/getMonthsData";
import useGetEmployees, { useGetObjectives } from "pages/Objectives/hooks/useGetEmployees";
import { useSelector } from "react-redux";
import { AuthRole, OKRperiod, removeDuplicates } from "utilities";
import { tableGenerator } from "pages/Objectives/ObjectivesTable/transformTable";

const Dashboard3 = () => {
  const currentTab = useSelector((store) => store.user.currentTab);
  
  // Add responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 960px) and (min-width: 601px)");
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
  });

  const [loading, setLoading] = useState(false);
  const [topData, setTopData] = useState({});
  const { data: employeeResponse } = useGetEmployees();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const selectedTab = JSON.parse(localStorage.getItem("selectedTab")) || null;

  const fetchEmployees = () => {
    try {
      const { data = [] } = employeeResponse || {};
      if (data?.length > 0) {
        const updatedData = data.filter(item => {
          if (selectedTab?.tab === "me") {
            return user?._id === item._id;
          } else if (selectedTab?.tab === "myteam" && (AuthRole === "HR Admin" || AuthRole === "Super Admin")) {
            return user && item.employmentInformation;
          } else {
            return user && item.employmentInformation?.lineManager === user._id || item._id === user._id;
          }
        }).map((item) => ({
          key: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
          value: item._id,
        }));

        const nonduplicates = removeDuplicates(updatedData, "key");
        const updatedData2 = { 
          ...companyInfo,
          employeeName: nonduplicates[0]?.value || "",
          employeeNames: nonduplicates[0]?.key || "",
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

  const { data: objectivesResponse, refetch } = useGetObjectives(
    currentTab,
    companyInfo.okrYear,
    companyInfo.okrPeriod
  );

  const getData = (data) => {
    const existingUser = JSON.parse(localStorage.getItem("userData")) || null;
    const filteredData = data?.filter(
      (item) => item.employeeName === (existingUser?.ownerName || companyInfo.employeeNames)
    ) || [];
    
    const result = tableGenerator(filteredData, filteredData.length, filteredData);
    const quartersData = totalQuartersData(result, companyInfo);
    setTopData(quartersData);
  };

  useEffect(() => {
    if (objectivesResponse?.data?.length > 0) {
      getData(objectivesResponse.data);
    }
  }, [objectivesResponse, companyInfo.okrYear, companyInfo.okrPeriod]);

  return (
    <Box sx={{ 
      padding: isMobile ? "10px" : isTablet ? "15px" : "20px", 
      borderRadius: "16px", 
      backgroundColor: "#fff", 
      margin: isMobile ? "10px" : isTablet ? "15px" : "20px" 
    }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: isTablet ? "15px" : "20px"
      }}>
        <Typography sx={{ 
          backgroundColor: "#FFFCD2", 
          padding: isMobile ? "4px 16px" : isTablet ? "4px 20px" : "4px 28px", 
          color: "#0E0E0E", 
          fontFamily: "Montserrat", 
          fontWeight: 600, 
          fontSize: isMobile ? "12px" : isTablet ? "13px" : "14px", 
          borderRadius: "20px",
          textAlign: "center",
          width: "100%"
        }}>
          HI Suprabha! Your Objectives are off track to be completed by due date!
        </Typography>
      </Box>

      {/* Responsive layout for different screen sizes */}
      <Box sx={{ 
        display: "flex", 
        width: "100%", 
        gap: isMobile ? "8px" : isTablet ? "10px" : "12px", 
        height: isMobile ? "auto" : isTablet ? "auto" : "294px", 
        margin: isMobile ? "10px 0" : isTablet ? "15px 0" : "20px",
        flexDirection: isMobile ? "column" : isTablet ? "column" : "row"
      }}>
        {/* OKR Card - Full width on mobile/tablet, flex: 2 on desktop */}
        <Box sx={{ 
          flex: isMobile ? "none" : isTablet ? "none" : 2,
          width: isMobile || isTablet ? "100%" : "auto",
          marginBottom: isMobile || isTablet ? "15px" : 0,
          minHeight: isTablet ? "200px" : "auto"
        }}>
          <OKRCard1 companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
        </Box>
        
        {/* Charts Container - Stack horizontally on tablet, vertically on mobile */}
        <Box sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : isTablet ? "row" : "row",
          gap: isMobile ? "10px" : isTablet ? "8px" : "12px",
          flex: isMobile ? "none" : isTablet ? "none" : "2.5",
          width: isMobile || isTablet ? "100%" : "auto"
        }}>
          {/* First Chart */}
          <Box sx={{ 
            flex: isMobile ? "none" : isTablet ? 1 : 1,
            width: isMobile ? "100%" : "auto",
            minHeight: isTablet ? "180px" : "auto"
          }}>
            <DoughnutChartComponent1 topData={topData} companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
          </Box>
          
          {/* Second Chart */}
          <Box sx={{ 
            flex: isMobile ? "none" : isTablet ? 1.5 : 1.5,
            width: isMobile ? "100%" : "auto",
            minHeight: isTablet ? "180px" : "auto"
          }}>
            <DoughnutChartComponent2 topData={topData} companyInfo={companyInfo} setCompanyInfo={setCompanyInfo}/>
          </Box>
        </Box>
      </Box>

      {/* Table Section */}
      <Box sx={{ 
        margin: isMobile ? "10px 0" : isTablet ? "15px 0" : "10px",
        overflowX: isTablet ? "auto" : "visible"
      }}>
        <TaskTable3 data={objectivesResponse} refetchObjectives={refetch} />
      </Box>
    </Box>
  );
};

export default Dashboard3;