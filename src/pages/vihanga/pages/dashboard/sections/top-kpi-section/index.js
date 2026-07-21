//top kpi section

import React from "react";
import { Box, Typography, Chip, Grid, Stack, IconButton } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useDashboardContext } from "../../context/DashboardContext";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";

// Import different icons
import CheckIcon from "../../assets/images/CheckMark.png"
import CalendarIcon from "../../assets/images/Calendar.png";
import ClockIcon from "../../assets/images/Clock.png";
import PrizeIcon from "../../assets/images/Prize.png";
import StarIcon from "../../assets/images/Star.png";
import CardWidget from "pages/vihanga/components/Cards/CardWidget";
import WarningAmber from '@mui/icons-material/WarningAmber';

const TopKpiCards = () => {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useDashboardContext();

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        margin: { xs: '.4rem', sm: '.6rem', md: '.8rem' },
        marginTop: { xs: '.4rem', sm: '.6rem', md: '.8rem' }
      }}>
        <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
          {[1, 2, 3, 4, 5].map((index) => (
            <Grid 
              item 
              key={index} 
              xs={12} 
              sm={6} 
              md={2.4}
              sx={{ 
                flexBasis: { xs: '100%', sm: '50%', md: '20%' }, 
                maxWidth: { xs: '100%', sm: '50%', md: '20%' } 
              }}
            >
              <LoadingState title="Loading..." height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ 
        margin: { xs: '.4rem', sm: '.6rem', md: '.8rem' },
        marginTop: { xs: '.4rem', sm: '.6rem', md: '.8rem' }
      }}>
        <ErrorState 
          title="Failed to Load Dashboard Data" 
          error={error} 
          onRetry={refetch}
        />
      </Box>
    );
  }

  // Show no data state
  if (!data || !data.headerCards) {
    return (
      <Box sx={{ 
        margin: { xs: '.4rem', sm: '.6rem', md: '.8rem' },
        marginTop: { xs: '.4rem', sm: '.6rem', md: '.8rem' }
      }}>
        <NoDataState 
          title={t("TopKpiCards.NoDataAvailable")} 
          message={t("TopKpiCards.NoDataMessage")}
        />
      </Box>
    );
  }

  const { headerCards } = data;

  // Task Data with dynamic data from API
  const taskKpiData = [
    {
      title: t("TopKpiCards.KpiCards.MyActiveTasks"),
      totalTasks: headerCards.myActiveTasks?.total || 0,
      subHeading: `${headerCards.myActiveTasks?.urgent || 0} ${t("TopKpiCards.SubHeadings.Urgent")}`,
      actionLabel: t("TopKpiCards.ActionLabels.ActionNeeded"),
      icon: CheckIcon,
      hasAction: (headerCards.myActiveTasks?.urgent || 0) > 0,
      isWarningStage: (headerCards.myActiveTasks?.urgent || 0) > 0,
      iconBg: "#DB59301A",
    },
    {
      title: t("TopKpiCards.KpiCards.TeamAttendance"),
      totalTasks: `${headerCards.teamAttendance?.presentPercent || 0}%`,
      subHeading: t("TopKpiCards.SubHeadings.PresentToday"),
      actionLabel: t("TopKpiCards.ActionLabels.ReviewNow"),
      icon: CalendarIcon,
      iconBg: "#837F391A",
      hasAction: false,
    },
    {
      title: t("TopKpiCards.KpiCards.PunctualityScore"),
      totalTasks: `${headerCards.punctualityScore || 0}%`,
      subHeading: t("TopKpiCards.SubHeadings.Last30Days"),
      actionLabel: t("TopKpiCards.ActionLabels.ViewDetails"),
      icon: ClockIcon,
      iconBg: "#BEA7811A",
      hasAction: false,
    },
    {
      title: t("TopKpiCards.KpiCards.MyAchievements"),
      totalTasks: headerCards.myAchievements?.thisMonth || 0,
      subHeading: t("TopKpiCards.SubHeadings.ThisMonth"),
      actionLabel: t("TopKpiCards.ActionLabels.ViewDetails"),
      icon: PrizeIcon,
      iconBg: "#EBBE2E1A",
      hasAction: false,
    },
    {
      title: t("TopKpiCards.KpiCards.RewardPoints"),
      totalTasks: headerCards.rewardPoints?.available?.toString() || "0",
      subHeading: t("TopKpiCards.SubHeadings.Available"),
      actionLabel: t("TopKpiCards.ActionLabels.ViewDetails"),
      icon: StarIcon,
      iconBg: "#BEA7811A",
      hasAction: false,
    },
  ];

  return (
    <Box
      sx={{
        margin: { xs: '.4rem', sm: '.6rem', md: '.8rem' },
        marginTop: { xs: '.4rem', sm: '.6rem', md: '.8rem' },
        borderRadius: "16px",
        paddingBottom: "10px",
      }}
    >
      <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
        {taskKpiData.map((task, index) => {
          const IconComponent = task.icon;
          return (
            <Grid 
              item 
              key={index} 
              xs={12} 
              sm={6} 
              md={2.4}
              sx={{ 
                flexBasis: { xs: '100%', sm: '50%', md: '20%' }, 
                maxWidth: { xs: '100%', sm: '50%', md: '20%' } 
              }}
            >
              <CardWidget sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                minHeight: { xs: '120px', sm: '140px', md: 'auto' }
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={600}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                          lineHeight: 1.2
                        }}
                      >
                        {task.title}
                      </Typography>
                      {task.isWarningStage && (
                        <WarningAmber 
                          fontSize="small" 
                          sx={{ 
                            color: "#E86F3C",
                            fontSize: { xs: '16px', sm: '18px', md: '20px' }
                          }} 
                        />
                      )}
                    </Stack>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      sx={{
                        fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                        lineHeight: 1.2,
                        marginTop: { xs: '4px', sm: '6px', md: '8px' }
                      }}
                    >
                      {task.totalTasks}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                        lineHeight: 1.2,
                        marginTop: { xs: '2px', sm: '4px', md: '6px' }
                      }}
                    >
                      {task.subHeading}
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{
                      backgroundColor: task.iconBg,
                      borderRadius: "8px",
                      padding: "4px",
                      width: { xs: "30px", sm: "32px", md: "35px" },
                      height: { xs: "30px", sm: "32px", md: "35px" },
                      flexShrink: 0,
                      marginLeft: { xs: '8px', sm: '12px', md: '16px' }
                    }}
                    disableRipple
                  >
                    <img
                      src={IconComponent}
                      alt="icon"
                      style={{ 
                        width: "18px", 
                        height: "18px",
                        maxWidth: "100%",
                        height: "auto"
                      }}
                    />
                  </IconButton>
                </Stack>

                {task.hasAction && (
                  <Chip
                    label={task.actionLabel}
                    sx={{
                      backgroundColor: "#E86F3C",
                      color: "white",
                      fontSize: { xs: "10px", sm: "11px", md: "12px" },
                      height: { xs: "20px", sm: "22px", md: "24px" },
                      borderRadius: "12px",
                      alignSelf: "flex-start",
                      marginTop: { xs: "8px", sm: "10px", md: "12px" },
                    }}
                    size="small"
                  />
                )}
              </CardWidget>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TopKpiCards;
