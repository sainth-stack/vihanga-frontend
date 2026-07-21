import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import DotsIcon from '../../../../../../assets/svg/DotsIcon.svg'
import { useDashboardContext } from "../../context/DashboardContext";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PerformanceChartCard = () => {
    const { t } = useTranslation();
    const { data: dashboardData, loading, error } = useDashboardContext();
const companyId = getItemFromLocalStorage("companyId");

  const { primaryColor, secondaryColors } = getThemeColors();
    // Show loading state
    if (loading) {
        return <LoadingState title="Loading Performance Trend..." height={400} />;
    }

    // Show error state
    if (error) {
        return (
            <ErrorState 
                title="Failed to Load Performance Trend" 
                error={error} 
            />
        );
    }

    // Check if performance trend data exists
    if (!dashboardData || !dashboardData.performanceTrend || dashboardData.performanceTrend.length === 0) {
        return (
            <NoDataState 
                title="No Performance Data Available" 
                message="Performance trend information is not available at the moment."
            />
        );
    }

    // Process data for the new API structure
    const performanceData = dashboardData.performanceTrend;
        
    // Extract labels (periods) and current values
    const labels = performanceData.map(item => item.label || t("PerformanceTrendDashboard.UnknownPeriod"));
    const currentValues = performanceData.map(item => item.current || 0);
    const targetValues = performanceData.map(item => item.target || 0);

    // Find the maximum value for better chart scaling
    const maxValue = Math.max(...currentValues, ...targetValues);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: t("PerformanceTrendDashboard.CurrentPerformance"),
                data: currentValues,
                backgroundColor: "#556B2F", // Dark olive green
                borderColor: "#556B2F",
                borderWidth: 0,
                borderRadius: 4,
                borderSkipped: false,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                titleColor: "#25363F",
                bodyColor: "#25363F",
                borderColor: "#E0E0E0",
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                titleFont: {
                    family: "Montserrat",
                    size: 14,
                    weight: "600"
                },
                bodyFont: {
                    family: "Work Sans",
                    size: 13
                },
                displayColors: true,
                callbacks: {
                    title: (tooltipItems) => {
                        return tooltipItems[0].label;
                    },
                    label: (context) => {
                        const currentValue = context.parsed.y;
                        const targetValue = targetValues[context.dataIndex];
                        const percentage = targetValue > 0 ? Math.round((currentValue / targetValue) * 100) : 0;
                        
                        return [
                            `Current: ${currentValue.toFixed(2)}`,
                            `Target: ${targetValue.toFixed(2)}`,
                            `Achievement: ${percentage}%`,
                        ];
                    },
                },
                usePointStyle: true,
                bodySpacing: 4,
                boxPadding: 6,
            },
            datalabels: {
                display: false
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: "Montserrat", size: 14 },
                    color: "#9F9F9F",
                    padding: 6,
                },
            },
            y: {
                beginAtZero: true,
                max: maxValue * 1.2, // Add 20% padding to max value
                ticks: {
                    stepSize: Math.ceil(maxValue / 5), // Dynamic step size
                    font: { family: "Montserrat", size: 14 },
                    color: "#B3AEA6",
                },
                grid: { color: "#F2F1EA" },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        elements: {
            bar: {
                barThickness: 60,
                borderWidth: 0,
                borderRadius: 4,
            }
        },
    };

    return (
        <Box
            sx={{
                width: " 100%",
                height: "100%",
                bgcolor:  secondaryColors.white,
                borderRadius: "18px",
                px: 3,
                py: 2.5,
                boxShadow: "0 4px 18px 0 rgba(34, 33, 77, 0.05)",
                position: "relative",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: "600",
                        fontSize: "24px",
                        fontFamily: "Montserrat",
                        color: "#25363F",
                        mb: 4
                    }}
                >
                    {t("PerformanceTrendDashboard.PerformanceTrend")}
                </Typography>
                <img
                    src={DotsIcon}
                    alt="icon"
                    style={{ width: "24px", height: "24px", marginTop: "-30px", backgroundColor: "white", cursor: "pointer" }}
                />
            </Box>
            <Box sx={{ width: "100%", height: 250, mb: 1 }}>
                <Bar data={chartData} options={options} />
            </Box>
        </Box>
    );
};

export default PerformanceChartCard;