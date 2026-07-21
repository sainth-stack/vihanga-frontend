  import React from 'react';
  import {
    Card,
    CardContent,
    Typography,
    Box,
    useMediaQuery,
    useTheme,
  } from "@mui/material";

  import EPCI1 from '../../../../../../assets/svg/EPCI1.svg';
  import EPCI2 from '../../../../../../assets/svg/EPCI2.svg';
  import EPCI3 from '../../../../../../assets/svg/EPCI3.svg';
import { getItemFromLocalStorage } from 'utilities/getLocalStorageItem';
import { getThemeColors } from 'utilities/getThemeColors';

const defaultIcons = {
  'sick leave': EPCI1,
  'casual leave': EPCI2,
  'earned leave': EPCI3,
  'remote working': EPCI1,
  'others': EPCI1 // Default fallback icon
};


const LeaveCards = ({ leaveSummary, onCardClick }) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px
  
    const { primaryColor, secondaryColors } = getThemeColors();
  // Filter out categories with no leave types or zero balance
  const activeCategories = Object.entries(leaveSummary || {})
    .filter(
      ([category, data]) => data.leaveTypes.length > 0
    )
    .map(([category, data]) => ({
      category,
      ...data,
      // Take the first leave type as representative for the card
      mainLeaveType: data.leaveTypes[0] || {},
    }));

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{
        margin: isMobile ? "0 0.5rem" : "0 1rem",
        flexWrap: "wrap",
        gap: isMobile ? 1 : 2, // Adjust gap based on screen size
      }}
    >
      {activeCategories.map((item, index) => {
        // Determine the icon to use - prioritize the API icon, fallback to default
        // const iconSrc = item.mainLeaveType?.icon || defaultIcons[item.category.toLowerCase()] || EPCI1;
        const iconSrc = defaultIcons[item.category.toLowerCase()] || EPCI1;
        return (
          <Card
            key={index}
            sx={{
              width: isMobile
                ? "48%"
                : isTablet
                ? "calc(50% - 8px)"
                : "calc(33.33% - 16px)", // Responsive widths
              maxWidth: isMobile ? "48%" : "100%",
              height: isMobile ? "100px" : "130px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius:isMobile?3: 2,
              bgcolor: isMobile ? "#bea781" : secondaryColors.white,
              boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
              flex: isMobile ? "1 1 100%" : "1 1 0px",
              cursor: 'pointer'
            }}
            onClick={() => onCardClick && onCardClick(item)}
          >
            <CardContent
              sx={{ textAlign: "center", padding: isMobile ? "8px" : "16px" }}
            >
              <img
                src={iconSrc}
                alt={item.category}
                style={{
                  width: isMobile ? 20 : 24,
                  height: isMobile ? 20 : 24,
                  mixBlendMode: isMobile ? "screen" : "normal",
                  filter: isMobile
                    ? "brightness(0) saturate(100%) invert(100%)"
                    : "none",
                }}
                onError={(e) => {
                  // Fallback to default icon if the image fails to load
                  e.target.src =
                    defaultIcons[item.category.toLowerCase()] || EPCI1;
                }}
              />
              
                <Typography
                  sx={{
                    fontWeight: isMobile ? "400" : "500",
                    fontFamily: "Work Sans",
                    fontSize: isMobile ? "12px" : "16px",
                    color: isMobile ? "#fff" : "#0E0E0E",
                    marginTop: isMobile ? "5px" : "10px",
                    marginBottom: isMobile ? "5px" : "10px",
                    textTransform: "capitalize",
                  }}
                >
                  {item.category}
                </Typography>

              <Typography
                sx={{
                  color: isMobile ? "#fff" : "#0E0E0E",
                  fontFamily: "Work Sans",
                  fontWeight: "400",
                  fontSize: "14px",
                }}
              >
                {item.remaining} {item.mainLeaveType?.unit || "days"} Available
              </Typography>
              {/* <Typography
                  sx={{
                    color: '#707070',
                    fontFamily: 'Work Sans',
                    fontWeight: '400',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}
                >
                  ({item.used} of {item.totalBalance} used)
                </Typography> */}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

  export default LeaveCards;