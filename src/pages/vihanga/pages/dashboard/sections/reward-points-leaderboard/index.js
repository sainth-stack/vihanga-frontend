//reward-points

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { Crown } from "lucide-react";
import Header from "../../../board/components/Header";
import CustomTabs from "../../components/CutomTabs/CustomTabs";
import CoinIcon from '../../assets/images/Cooin.png'
import Crown1 from "../../assets/images/Crown1.png"
import Crown2 from "../../assets/images/Crown2.png"
import Crown3 from "../../assets/images/Crown3.png"
import Crown4 from "../../assets/images/Crown4.png"
import Crown5 from "../../assets/images/Crown5.png"
import { useDashboardContext } from "../../context/DashboardContext";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";

const medalColors = ["#F5A623", "#C0C0C0", "#CD7F32", "#B0B0B0", "#B0B0B0"];

export default function DashboardRewardLeaderboard() {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useDashboardContext();
  const [tabValue, setTabValue] = useState('company');
  const companyId = getItemFromLocalStorage("companyId");
  const { primaryColor, secondaryColors } = getThemeColors();
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading Leaderboard..." height={400} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Leaderboard" 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data || !data.leaderboard) {
    return (
      <NoDataState 
        title="No Leaderboard Data Available" 
        message="Reward points leaderboard information is not available at the moment."
      />
    );
  }

  const { leaderboard } = data;
  
  // Get available departments for tabs
  const availableDepartments = leaderboard.departments?.map(dept => dept.department) || [];
  
  // Determine current data based on tab
  let currentData = [];
  let isCompanyView = false;
  
  if (tabValue === 'company') {
    currentData = leaderboard.company || [];
    isCompanyView = true;
  } else {
    // Find the selected department
    const selectedDept = leaderboard.departments?.find(dept => dept.department === tabValue);
    currentData = selectedDept?.employees || [];
    isCompanyView = false;
  }

  // Transform data for display
  const transformedData = currentData.slice(0, 5).map((person, index) => ({
    name: person.name || t("DashboardRewardLeaderboard.Unknown"),
    employeeNumber: person.employeeNumber || 'N/A',
    points: person.points?.toString() || '0',
    image: person.avatar || `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 1}.jpg`,
    crown: [Crown1, Crown2, Crown3, Crown4, Crown5][index] || Crown5,
    department: person.department
  }));

  // Create tabs data
  const tabsData = [
    { value: 'company', label: 'COMPANY' },
    ...availableDepartments.map(dept => ({ value: dept, label: dept }))
  ];

  return (
    <Card
      sx={{
        padding: "1rem",
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        overflowY: "auto",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        bgcolor:secondaryColors.white
      }}
    >
      <Header text={t("DashboardRewardLeaderboard.RewardPointsLeaderboard")} />
      <CustomTabs 
        value={tabValue} 
        onChange={handleTabChange}
        tabs={tabsData}
      />

      <Box>
        {/* <CustomTabPanel /> */}
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px !important", fontStyle: "Regular" }}>
          {t("DashboardRewardLeaderboard.Top5Employees")}
        </Typography>
        <Button
          size="small"
          sx={{
            color: "rgba(131, 127, 57, 1)",
            textDecoration: "underline",
            minWidth: "auto",
          }}
        >
          {t("DashboardRewardLeaderboard.ViewAll")}
        </Button>
      </Box>

      {transformedData.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {t("DashboardRewardLeaderboard.NoEmployeesFound")}
          </Typography>
        </Box>
      ) : (
        transformedData.map((person, index) => (
          <Card
            variant="outlined"
            key={index}
            sx={{
              height: 75,
              display: "flex",
              justifyContent: "center",
              borderRadius: "12px",
              padding: "15px",
              padding: "10px 12px",
              margin: "1rem 0"
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                px: 2,
                py: 1.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box position="relative" display="flex" alignItems="center">
                  <Box
                    component="img"
                    src={person?.crown}
                    alt="coin"
                    sx={{ width: 50, height: 30 }}
                  />
                  <Typography
                    variant="caption"
                    color="#fff"
                    fontWeight="bold"
                    sx={{
                      position: "absolute",
                      top: "-4px",
                      left: "4px",
                      fontSize: "10px",
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Avatar src={person.image} alt={person.name} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {person.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("DashboardRewardLeaderboard.EmployeeId")}{person.employeeNumber}
                    {!isCompanyView && person.department && (
                      <span style={{ display: 'block', fontSize: '10px' }}>
                        {person.department}
                      </span>
                    )}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  component="img"
                  src={CoinIcon}
                  alt="coin"
                  sx={{ width: 30, height: 30 }}
                />
                <Typography variant="body1" fontWeight={600}>
                  {person.points}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Card>
  );
}
