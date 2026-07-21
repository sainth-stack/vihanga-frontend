import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Plus } from "lucide-react";
import Button from "@mui/material/Button";
import { Box, Card, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import Header from "../../../board/components/Header";
import downloadIcon from "assets/images/downloadIcon.png";
import { useDashboardContext } from "../../context/DashboardContext";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";
import { toCamelCase } from "utilities/ExportFunctions";
import { canEdit } from "utilities/privilegeHelper";
import { getEmployeesAll } from "action/EmployeeAct";
import * as XLSX from "xlsx";

ChartJS.register(ArcElement, Legend, ChartDataLabels, Tooltip);

export default function OKRProgress() {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useDashboardContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const companyId = getItemFromLocalStorage("companyId");
  const dispatch = useDispatch();
  const [allEmployees, setAllEmployees] = useState([]);

  const { primaryColor, secondaryColors } = getThemeColors();

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await dispatch(getEmployeesAll());
        if (response.success && response.data) {
          setAllEmployees(response.data);
        }
      } catch (error) {
        console.error("Error fetching all employees:", error);
      }
    };
    
    fetchAllEmployees();
  }, [dispatch]);
  // CSV export functions
  const exportSummaryCSV = () => {
    if (!data || !data.okrProgress) return;
    const okrProgress = data.okrProgress;
    const rows = [
      [toCamelCase("Status"), toCamelCase("Count")],
      ["On-Track", okrProgress.onTrack || 0],
      ["Off-Track", okrProgress.offTrack || 0],
      ["At-Risk", okrProgress.atRisk || 0],
    ];
    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "okr_progress_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportDetailedExcel = () => {
    if (!data || !data.okrProgressDetails) return;
    
    // Get employees who have OKRs (using employee numbers)
    const employeesWithOKRs = new Set(
      data.okrProgressDetails.map(r => r.employeeNumber).filter(Boolean)
    );
    
    // Prepare OKR data for Excel
    const okrData = data.okrProgressDetails.map(r => ({
      [toCamelCase("Objective-ID")]: r.objectiveId || "",
      [toCamelCase("Objective")]: (r.objective || "").replace(/\n/g, " "),
      [toCamelCase("Employee ID")]: r.employeeNumber || "",
      [toCamelCase("Employee Name")]: r.employeeName || "",
      [toCamelCase("Progress %")]: r.progressPercent ?? "",
      [toCamelCase("Created At")]: r.createdAt ? new Date(r.createdAt).toISOString() : "",
      [toCamelCase("KR Count")]: r.krCount ?? "",
      [toCamelCase("Weight")]: r.weight || "",
      [toCamelCase("Due Date")]: r.dueDate ? new Date(r.dueDate).toISOString() : "",
    }));
    
    // Find employees without OKRs
    const employeesWithoutOKRs = allEmployees
      .filter(emp => {
        const empNumber = emp.employeeNumber || emp.employmentInformation?.employeeNumber;
        return empNumber && !employeesWithOKRs.has(empNumber);
      })
      .map(emp => ({
        "Employee ID": emp.employeeNumber || emp.employmentInformation?.employeeNumber || "N/A",
        "Employee Name": `${emp.personalInformation?.firstName || ""} ${emp.personalInformation?.lastName || ""}`.trim() || "N/A",
        "OKR Percentage": "0%"
      }));
    
    // Create Excel workbook with two sheets
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: OKR Progress Details
    const ws1 = XLSX.utils.json_to_sheet(okrData);
    XLSX.utils.book_append_sheet(wb, ws1, "OKR Progress Details");
    
    console.log("=== EXPORT DEBUG ===");
    console.log("All employees count:", allEmployees.length);
    console.log("Employees with OKRs:", Array.from(employeesWithOKRs));
    console.log("Employees without OKRs count:", employeesWithoutOKRs.length);
    
    // Sheet 2: No OKR Employee - ALWAYS create this sheet
    const ws2 = XLSX.utils.json_to_sheet(
      employeesWithoutOKRs.length > 0 
        ? employeesWithoutOKRs 
        : [{ "Employee ID": "N/A", "Employee Name": "No employees without OKRs", "OKR Percentage": "N/A" }]
    );
    XLSX.utils.book_append_sheet(wb, ws2, "No OKR Employee");
    
    // Download the file
    XLSX.writeFile(wb, "okr_progress_detailed.xlsx");
  };

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading OKR Progress..." height={400} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState
        title="Failed to Load OKR Progress"
        error={error}
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data || !data.okrProgress) {
    return (
      <NoDataState
        title="No OKR Data Available"
        message="OKR progress information is not available at the moment."
      />
    );
  }

  const { okrProgress } = data;
  const onTrack = okrProgress.onTrack || 0;
  const offTrack = okrProgress.offTrack || 0;
  const atRisk = okrProgress.atRisk || 0;

  // Only include categories with values greater than 0
  const chartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };

  const legendItems = [];

  if (onTrack > 0) {
    chartData.labels.push(t("OKRProgress.StatusLabels.OnTrack"));
    chartData.datasets[0].data.push(onTrack);
    chartData.datasets[0].backgroundColor.push("#8A9B50");
    chartData.datasets[0].borderColor.push("#8A9B50");
    legendItems.push({ label: t("OKRProgress.StatusLabels.OnTrack"), count: onTrack, color: "#8A9B50" });
  }

  if (offTrack > 0) {
    chartData.labels.push(t("OKRProgress.StatusLabels.OffTrack"));
    chartData.datasets[0].data.push(offTrack);
    chartData.datasets[0].backgroundColor.push("#E0582D");
    chartData.datasets[0].borderColor.push("#E0582D");
    legendItems.push({ label: t("OKRProgress.StatusLabels.OffTrack"), count: offTrack, color: "#E0582D" });
  }

  if (atRisk > 0) {
    chartData.labels.push(t("OKRProgress.StatusLabels.AtRisk"));
    chartData.datasets[0].data.push(atRisk);
    chartData.datasets[0].backgroundColor.push("#E5B436");
    chartData.datasets[0].borderColor.push("#E5B436");
    legendItems.push({ label: t("OKRProgress.StatusLabels.AtRisk"), count: atRisk, color: "#E5B436" });
  }

  const total = onTrack + offTrack + atRisk;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#FFFFFF",
        font: {
          weight: "700",
          size: isMobile ? 16 : isTablet ? 20 : 26,
        },
        formatter: (value, ctx) => {
          if (total === 0) return "0%";
          let percentage = Math.round((value / total) * 100);
          return `${percentage}%`;
        },
        anchor: "center",
        align: "center",
      },
      tooltip: {
        enabled: true,
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
            const value = context.parsed;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return [
              `Count: ${value} OKR${value !== 1 ? 's' : ''}`,
              `Percentage: ${percentage}%`,
              `Total OKRs: ${total}`
            ];
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        padding: { xs: "12px", sm: "16px", md: "20px" },
        borderRadius: "16px",
        backgroundColor:secondaryColors.white,
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 2,
          mt: { xs: 2, sm: 3, md: 4 },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Header 
          text={t("OKRProgress.OKRProgress")} 
          style={{ 
            color: "#25363F", 
            fontFamily: "Montserrat", 
            fontWeight: "600", 
            fontSize: { xs: '18px', sm: '20px', md: '24px' } 
          }} 
        />
        <Box 
          display="flex" 
          alignItems="center" 
          gap={{ xs: 2, sm: 3, md: 4 }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {canEdit() && (
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#837F39",
                color: "#ffffff",
                fontFamily: "Work Sans",
                textTransform: "none",
                borderRadius: "65px",
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                padding: { xs: '6px 12px', sm: '6px 14px', md: '6px 16px' },
                minWidth: { xs: 'auto', sm: 'auto' },
                flex: { xs: 1, sm: 'none' },
                "&:hover": {
                  backgroundColor: "#708238",
                },
              }}
              startIcon={<Plus size={isMobile ? 14 : 16} />}
              onClick={() => { window.location.href = "/admin/objectives/objective"; }}
            >
              {t("OKRProgress.AddOKR")}
            </Button>
          )}

          <span
            role="button"
            tabIndex={0}
            title="Export"
            aria-label="Export"
            className="cursor-pointer"
            style={{ width: isMobile ? "20px" : "24px", height: isMobile ? "20px" : "24px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => exportDetailedExcel()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); exportDetailedExcel(); } }}
          >
            <img
              tabIndex={0}
              src={downloadIcon}
              alt=""
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </span>
        </Box>
      </Box>

      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: "20px", sm: "40px", md: "87px" },
        marginTop: { xs: "20px", sm: "30px", md: "50px" },
      }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row !important",
            justifyContent: "center",
            alignItems: "center",
            height: { xs: "200px", sm: "220px", md: "264px" },
          }}
        >
          <Box sx={{ 
            width: { xs: "200px", sm: "220px", md: "264px" }, 
            height: { xs: "200px", sm: "220px", md: "264px" } 
          }}>
            {total > 0 ? (
              <Pie data={chartData} options={chartOptions} />
            ) : (
              <Box
                sx={{
                  width: { xs: "200px", sm: "220px", md: "264px" },
                  height: { xs: "200px", sm: "220px", md: "264px" },
                  borderRadius: "50%",
                  backgroundColor: "#F5F5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #D0D0D0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#9E9E9E",
                    fontFamily: "Montserrat",
                    fontWeight: "500",
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                    textAlign: 'center',
                    padding: { xs: '8px', sm: '12px', md: '16px' }
                  }}
                >
                  {t("OKRProgress.NoOKRData")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "16px",
            mt: { xs: 0, sm: 4, md: 8 },
            width: { xs: '100%', sm: 'auto' },
            alignItems: { xs: 'center', sm: 'flex-start' }
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="16px"
            fontWeight="bold"
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {legendItems.map((item, index) => (
              <Box 
                key={index} 
                display="flex" 
                alignItems="center" 
                gap="8px" 
                sx={{ 
                  marginTop: index === 0 ? { xs: "0px", sm: "-40px", md: "-80px" } : "0px",
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <Box
                  width={{ xs: 12, sm: 14, md: 15 }}
                  height={{ xs: 12, sm: 14, md: 15 }}
                  borderRadius="50%"
                  bgcolor={item.color}
                  mr={1}
                />
                <Typography
                  sx={{
                    color: "#707070",
                    fontWeight: "400",
                    fontSize: { xs: "12px", sm: "13px", md: "14px" },
                    fontFamily: "Work Sans",
                    letterSpacing: "0px"
                  }}
                >
                  {item.label} ({item.count})
                </Typography>
              </Box>
            ))}
            
            {/* Show At-Risk with 0 count in legend but not in chart */}
            {atRisk === 0 && (
              <Box 
                display="flex" 
                alignItems="center" 
                gap="8px"
                sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
              >
                <Box
                  width={{ xs: 12, sm: 14, md: 15 }}
                  height={{ xs: 12, sm: 14, md: 15 }}
                  borderRadius="50%"
                  bgcolor="#E5B436"
                  mr={1}
                />
                <Typography
                  sx={{
                    color: "#707070",
                    fontWeight: "400",
                    fontSize: { xs: "12px", sm: "13px", md: "14px" },
                    fontFamily: "Work Sans",
                    letterSpacing: "0px"
                  }}
                >
                  {t("OKRProgress.StatusLabels.AtRisk")} (0)
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
