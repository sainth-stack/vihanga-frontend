//import React from 'react';
import { Card, Box, Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import TodayProfile from '../../../../../../assets/svg/TodayProfile.svg'
import CardWidget from 'pages/vihanga/components/Cards/CardWidget';
import { useDashboardContext } from '../../context/DashboardContext';
import { LoadingState, ErrorState, NoDataState } from '../../components/LoadingState';
import * as XLSX from "xlsx";
import { Toast } from "service/toast";

// Helper for the small cards inside the summary row
function SmallCard({ icon, label, value }) {
  return (
    <Box
      sx={{
        minWidth: 180,
        height: 73,
        width: "100%",
        p: 1.5,
        display: 'flex',
        gap: '10px',
        justifyContent: "space-between",
        alignItems: 'center',
        borderRadius: '14px',
        background: '#F6F5EC' // Adjust as needed
      }}
    >
      {icon}
      <Box>
        <Typography sx={{ color: "#000000", fontFamily: "Work Sans", fontSize: "16px" }}>{label}</Typography>
        <Typography sx={{ fontWeight: 600, fontFamily: "Montserrat", fontSize: "24px", color: "#000000" }}>{value}</Typography>
      </Box>
    </Box>
  );
}

// Big card container
export default function AttendanceCard() {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useDashboardContext();

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading Attendance Data..." height={400} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Attendance Data" 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data || !data.todaysAttendance) {
    return (
      <NoDataState 
        title="No Attendance Data Available" 
        message="Today's attendance information is not available at the moment."
      />
    );
  }

  const { todaysAttendance } = data;
  const presentPercent = todaysAttendance.presentPercent || 0;
  const presentCount = todaysAttendance.presentCount || 0;
  const totalEmployees = todaysAttendance.totalEmployees || 0;
  const lateArrivals = todaysAttendance.lateArrivals || 0;
  const onLeave = todaysAttendance.onLeave || 0;
  const nextHoliday = todaysAttendance.nextHoliday;

  // Export today's attendance details as Excel (backend returns data.attendanceDetails)
  const exportAttendanceExcel = () => {
    try {
      const details = data?.attendanceDetails ?? data?.todaysAttendance?.attendanceDetails ?? [];
      const exportData = (Array.isArray(details) ? details : []).map(r => ({
        "Employee Number": r.employeeNumber ?? r.employeeId ?? "",
        "Employee Name": r.employeeName ?? r.employee_name ?? "",
        "Employee Email": r.employeeEmail ?? r.employee_email ?? r.email ?? "",
        "Date": r.date ?? "",
        "Time In": r.timeIn ?? r.time_in ?? "",
        "Time Out": r.timeOut ?? r.time_out ?? "",
        "Status": r.status ?? ""
      }));
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData.length ? exportData : [{ "Info": "No attendance entries for today" }]);
      XLSX.utils.book_append_sheet(wb, ws, "Today's Attendance");
      XLSX.writeFile(wb, `attendance_details_${new Date().toISOString().slice(0, 10)}.xlsx`);
      if (!details || details.length === 0) {
        Toast({ type: "info", message: "No attendance entries for today to export", time: 3000 });
      }
    } catch (err) {
      console.error("Export attendance failed:", err);
      Toast({ type: "error", message: "Export failed. Please try again.", time: 4000 });
    }
  };

  return (
    <CardWidget>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: "space-between" }}>
        <Typography sx={{ flex: 1, fontWeight: 600, color: "#25363F", fontFamily: "Montserrat", fontSize: "24px", margin: "20px" }}>{t("TodayAttendance.TodaysAttendance")}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          <span
            role="button"
            tabIndex={0}
            title="Export Attendance"
            aria-label="Export Attendance"
            className="cursor-pointer"
            style={{ width: 24, height: 24, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={exportAttendanceExcel}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); exportAttendanceExcel(); } }}
          >
            <img             tabIndex={0}
 src={require('assets/images/downloadIcon.png').default || require('assets/images/downloadIcon.png')} alt="" style={{ width: 24, height: 24, display: 'block' }} />
          </span>
          <CalendarMonthOutlinedIcon             tabIndex={0}
 sx={{ padding: "10px", background: '#F6F5EC', color: "#837F39", borderRadius: "8px", fontSize: "45px" }} />
        </Box>
      </Box>

      {/* Row of two small cards */}
      <Box sx={{
        display: 'flex', width: '100%', height: 73, gap: '20px', mb: 2, justifyContent: "center"
      }}>
        <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
          <SmallCard
            icon={
              <Box
                sx={{
                  width: 35,      // adjust as needed
                  height: 35,     // adjust as needed
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#837F39",
                  borderRadius: "10px"
                }}
              >
                <img src={TodayProfile} alt="Today Profile" style={{ width: "18px", height: "18px" }} />
              </Box>
            }
            label={t("TodayAttendance.Present")}
            value={`${presentPercent}%`}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
          <SmallCard
            icon={
              <Box
                sx={{
                  width: 35,      // adjust as needed
                  height: 35,     // adjust as needed
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#BEA781",
                  borderRadius: "10px"
                }}
              >
                <img src={TodayProfile} alt="Today Profile" style={{ width: "18px", height: "18px" }} />
              </Box>
            }
            label={t("TodayAttendance.OnLeave")}
            value={onLeave}
          />
        </Box>
      </Box>

      {/* Four lower cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box
          sx={{
            width: '100%',
            height: 50,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            px: '14px',
            py: '9px',
            background: '#FEECEC',
            gap: 2
          }}
        >
          <AccessTimeIcon sx={{ color: '#DB5930' }} />
          <Typography sx={{ flex: 1, color: '#DB5930', fontWeight: 600, fontFamily: "Montserrat", fontSize: "16px" }}>{t("TodayAttendance.LateArrivals")}</Typography>
          <Box sx={{
            background: '#DB5930',
            color: '#ffffff',
            borderRadius: '8px',
            minWidth: 32,
            textAlign: 'center',
            py: '5px',
            px: "5px",
            fontWeight: 700
          }}>{lateArrivals}</Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 50,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            px: '14px',
            py: '9px',
            background: '#FFFAED',
            gap: 2
          }}
        >
          <ReportProblemRoundedIcon sx={{ color: '#EBBE2E' }} />
          <Typography sx={{ flex: 1, color: '#EBBE2E', fontWeight: 600, fontFamily: "Montserrat", fontSize: "16px" }}>{t("TodayAttendance.TotalEmployees")}</Typography>
          <Box sx={{
            background: '#EBBE2E',
            color: '#ffffff',
            borderRadius: '8px',
            minWidth: 32,
            textAlign: 'center',
            py: '5px',
            px: "5px",
            fontWeight: 700
          }}>{totalEmployees}</Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 65,
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            px: '14px',
            py: '9px',
            background: '#F6F5EC',
            gap: 2
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ color: '#BEA781' }} />
          <Box>
            <Typography sx={{ color: '#BEA781', fontWeight: 600, fontFamily: "Montserrat", fontSize: "16px" }}>{t("TodayAttendance.NextHoliday")}</Typography>
            <Typography sx={{ fontSize: 16, color: '#BEA781', fontWeight: "400", fontFamily: "Work Sans" }}>
              {nextHoliday ? `${nextHoliday.name} - ${new Date(nextHoliday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : t("TodayAttendance.NoUpcomingHolidays")}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardWidget>
  );
}
