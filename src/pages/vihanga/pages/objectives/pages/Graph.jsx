import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useGetPrediction } from "pages/Goals/hooks/useGetAuditHistory";
import useGetAuditHistory from "pages/Objectives/hooks/useGetAuditHistory";
import { useTranslation } from 'react-i18next';

const BellCurveChart = ({ okrdetails }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const urlParams = new URLSearchParams(window.location.search);
  const krId = urlParams.get("keyResultId");

  const requestBody = {
    createdAt: window
      .moment(okrdetails?.createdAt)
      .format("YYYY-MM-DDTHH:mm:ss"),
    updatedAt: window
      .moment(okrdetails?.updatedAt)
      .format("YYYY-MM-DDTHH:mm:ss"),
    progress: parseFloat(okrdetails?.percent),
    targetDate: window
      .moment(okrdetails?.targetDate)
      .format("YYYY-MM-DDTHH:mm:ss"),
  };

  const { data: auditHistory = [] } = useGetAuditHistory(krId);

  const {
    data: probabilityData,
    isLoading,
    isError,
    error,
  } = useGetPrediction(requestBody);

  const processChartData = () => {
    const labels =
      auditHistory?.length > 0
        ? auditHistory.map((item) =>
            window.moment(item.updatedAt).format("DD/MM")
          )
        : [];

    const actuals =
      auditHistory.length > 0
        ? auditHistory.map((item) => item.dataDocument?.actual || 0)
        : [];

    const bellCurveData = actuals.map((value, index) => ({
      name: labels[index] || `${t("KeyResultForm.BellCurveChart.Point")} ${index + 1}`,
      value: Number(value) || 0,
      label:
        index === 1
          ? t("KeyResultForm.BellCurveChart.AtLower")
          : index === 3
          ? t("KeyResultForm.BellCurveChart.AtAverage")
          : index === 5
          ? t("KeyResultForm.BellCurveChart.AtUpper")
          : "",
    }));

    return { bellCurveData };
  };
  const { bellCurveData } = processChartData();
  console.log(bellCurveData,'dsfjdsnfds')

  // Calculate dynamic Y-axis domain based on data
  const getYAxisDomain = () => {
    if (bellCurveData.length === 0) return [0, 100];
    
    const maxValue = Math.max(...bellCurveData.map(item => item.value));
    const minValue = Math.min(...bellCurveData.map(item => item.value));
    
    // Add 20% padding above and below for better visualization
    const padding = Math.max((maxValue - minValue) * 0.2, 5); // Minimum padding of 5
    
    const yMin = Math.max(0, minValue - padding);
    const yMax = maxValue + padding;
    
    // Ensure minimum range of 20 for very small values
    const range = yMax - yMin;
    if (range < 20) {
      const midPoint = (yMax + yMin) / 2;
      return [Math.max(0, midPoint - 10), midPoint + 10];
    }
    
    return [yMin, yMax];
  };

  const CustomDot = ({ cx, cy, payload, index }) => {
    if (payload?.label) {
      return (
        <g>
          <circle 
            cx={cx} 
            cy={cy} 
            r={isMobile ? 3 : isTablet ? 4 : 5} 
            fill="#444" 
          />
          <text
            x={cx}
            y={cy - (isMobile ? 20 : isTablet ? 22 : 25)}
            textAnchor="middle"
            fontSize={isMobile ? 10 : isTablet ? 12 : 14}
            fontWeight={600}
            fill="#908a55"
          >
            {payload.name}
          </text>
          <text
            x={cx}
            y={cy - (isMobile ? 8 : isTablet ? 9 : 10)}
            textAnchor="middle"
            fontSize={isMobile ? 8 : isTablet ? 9 : 10}
            fill="#888"
          >
            {payload.label}
          </text>
        </g>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0] || {};
      const datum = point.payload || {};
      const name = datum.name || "";
      const value = point.value ?? datum.value;
      const labelText = datum.label || "";

      return (
        <div
          style={{
            background: "#fff",
            padding: isMobile ? "6px 8px" : isTablet ? "7px 10px" : "8px 12px",
            border: "1px solid #ccc",
            borderRadius: isMobile ? 6 : 8,
            fontSize: isMobile ? 10 : isTablet ? 11 : 12,
            color: "#444",
            maxWidth: isMobile ? "150px" : "200px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          {name && (
            <>
              <strong>{name}</strong>
              <br />
            </>
          )}
          <span>{t("KeyResultForm.BellCurveChart.Value")} {value}</span>
          {labelText && (
            <>
              <br />
              {labelText}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#fff",
        borderRadius: {
          xs: "16px", // Mobile
          sm: "18px", // Tablet
          md: "20px"  // Desktop
        },
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: {
          xs: "12px", // Mobile
          sm: "16px", // Tablet
          md: "20px"  // Desktop
        },
        margin: {
          xs: "8px",  // Mobile
          sm: "12px", // Tablet
          md: "16px"  // Desktop
        }
      }}
    >
      {isLoading && (
        <Box
          sx={{
            textAlign: "center",
            padding: {
              xs: "20px", // Mobile
              sm: "30px", // Tablet
              md: "40px"  // Desktop
            },
            fontSize: {
              xs: "14px", // Mobile
              sm: "16px", // Tablet
              md: "18px"  // Desktop
            }
          }}
        >
          {t("KeyResultForm.BellCurveChart.Loading")}
        </Box>
      )}
      
      {isError && (
        <Box
          sx={{
            textAlign: "center",
            color: "#ef4444",
            padding: {
              xs: "20px", // Mobile
              sm: "30px", // Tablet
              md: "40px"  // Desktop
            },
            fontSize: {
              xs: "12px", // Mobile
              sm: "14px", // Tablet
              md: "16px"  // Desktop
            }
          }}
        >
          {t("KeyResultForm.BellCurveChart.Error")} {error?.message || t("KeyResultForm.BellCurveChart.UnknownError")}
        </Box>
      )}

      {!isLoading && !isError && bellCurveData.length > 0 && (
        <Box
          sx={{
            height: {
              xs: 250, // Mobile
              sm: 280, // Tablet
              md: 300  // Desktop
            },
            width: "100%"
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={bellCurveData}
              margin={{
                top: isMobile ? 30 : isTablet ? 35 : 40,
                right: isMobile ? 20 : isTablet ? 25 : 30,
                left: isMobile ? 20 : isTablet ? 25 : 30,
                bottom: isMobile ? 20 : isTablet ? 25 : 30
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#908a55" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#908a55" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                horizontal
                vertical={false}
                stroke="#bba77b"
                strokeWidth={isMobile ? 0.5 : 1}
                strokeOpacity={0.4}
              />

              <XAxis
                axisLine={false}
                tickLine={false}
                tick={false}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis
                domain={getYAxisDomain()}
                axisLine={false}
                tickLine={false}
                tick={false}
              />

              <Tooltip 
                content={<CustomTooltip />} 
                cursor={false}
                wrapperStyle={{
                  outline: 'none'
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#908a55"
                strokeWidth={isMobile ? 1 : isTablet ? 1.25 : 1.5}
                fillOpacity={1}
                fill="url(#colorValue)"
                dot={<CustomDot />}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}

      {!isLoading && !isError && bellCurveData.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            color: "#6b7280",
            padding: {
              xs: "20px", // Mobile
              sm: "30px", // Tablet
              md: "40px"  // Desktop
            },
            fontSize: {
              xs: "12px", // Mobile
              sm: "14px", // Tablet
              md: "16px"  // Desktop
            }
          }}
        >
          {t("KeyResultForm.BellCurveChart.NoCurveData")}
        </Box>
      )}
    </Box>
  );
};

export default BellCurveChart;
