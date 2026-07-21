import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import CustomSwitchButton from "pages/vihanga/components/SwitchButton/CustomSwitch";
import EventCalendar from "../../../components/EventSchedular/EventSchedular";
import { customColors } from "pages/vihanga/components/EventSchedular/data";
import TableHeader2 from "../../objectives/tableHeader";
import { appURL } from "utilities";
import axios from "axios";
import { format } from "date-fns";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { useTranslation } from "react-i18next";
import { getThemeColors } from "utilities/getThemeColors";

const LEAVES_PAGE_LIMIT = 500;

const getColorForAbsenceType = (absenceType) => {
  const hash = (absenceType || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % customColors.length;
  return customColors[colorIndex].value;
};

const getColorForHoliday = () => "#FF6B6B";

const fetchAllApprovedLeaves = async (baseParams) => {
  const allLeaves = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await axios.get(`${appURL}/recruitment/leaves`, {
      params: {
        ...baseParams,
        page,
        limit: LEAVES_PAGE_LIMIT,
        status: "approved",
      },
    });

    if (!response.data?.success) break;

    const batch = response.data?.data?.data || [];
    allLeaves.push(...batch);
    totalPages = response.data?.data?.totalPages || 1;
    page += 1;
  }

  return allLeaves;
};

const CalendarPage = () => {
  const { t, i18n } = useTranslation();

  const [scope, setScope] = useState("myteam");
  const [managerBoard, setManagerBoard] = useState("all");
  const [allEvents, setAllEvents] = useState([]);
  const [visibleRange, setVisibleRange] = useState(null);

  const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = useMemo(() => getItemFromLocalStorage("user"), []);
  const { secondaryColors } = getThemeColors();

  const handleVisibleRangeChange = useCallback((range) => {
    setVisibleRange(range);
  }, []);

  useEffect(() => {
    if (!companyId || !userRoleId?._id || !visibleRange?.startDate || !visibleRange?.endDate) {
      return;
    }

    const fetchLeavesAndHolidays = async () => {
      try {
        const leaveParams = {
          companyId,
          currentUserId: userRoleId._id,
          type: scope,
          startDate: visibleRange.startDate,
          endDate: visibleRange.endDate,
        };

        if (scope === "me") {
          leaveParams.empId = userRoleId._id;
        }

        const leaves = await fetchAllApprovedLeaves(leaveParams);

        const holidaysResponse = await axios.get(`${appURL}/getAllHolidays`, {
          params: {
            companyId,
            type: scope,
          },
        });

        const leaveEvents = leaves
          .filter((leave) => leave.from && leave.to)
          .map((leave) => {
            const startDate = new Date(leave.from);
            const endDate = new Date(leave.to);
            const employeeName = leave.employeeInfo?.name || "";

            return {
              id: `leave_${leave._id}`,
              title: employeeName
                ? `${employeeName} - ${leave.absenceType}`
                : leave.absenceType,
              employeeName,
              absenceType: leave.absenceType,
              start: format(
                startDate > endDate ? endDate : startDate,
                "yyyy-MM-dd"
              ),
              end: format(
                startDate > endDate ? startDate : endDate,
                "yyyy-MM-dd"
              ),
              color: getColorForAbsenceType(leave.absenceType),
              halfDay: leave.halfDay,
              type: "leave",
            };
          });

        let holidayEvents = [];
        if (holidaysResponse.data) {
          const holidays = holidaysResponse.data.data || [];
          holidayEvents = holidays.map((holiday) => ({
            id: `holiday_${holiday._id}`,
            title: holiday.holidayName || "Holiday",
            start: format(new Date(holiday.fromDate), "yyyy-MM-dd"),
            end: format(new Date(holiday.toDate), "yyyy-MM-dd"),
            color: getColorForHoliday(),
            type: "holiday",
          }));
        }

        setAllEvents([...leaveEvents, ...holidayEvents]);
      } catch (error) {
        console.error("Error fetching leaves and holidays:", error);
        setAllEvents([]);
      }
    };

    fetchLeavesAndHolidays();
  }, [scope, companyId, userRoleId, visibleRange]);

  const [stage, setStage] = useState(t("AbsenceTime.TeamLeave.all"));
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const scopeOptions = [
    { label: t("Navbar.myteam"), value: "myteam" },
    { label: t("Navbar.mycompany"), value: "mycompany" },
    { label: t("Navbar.Me"), value: "me" },
  ];

  const menuItemsStage = [
    { text: t("AbsenceTime.filters.high") },
    { text: t("AbsenceTime.filters.medium") },
    { text: t("AbsenceTime.filters.low") },
  ];

  const menuItemsExportOptions = [
    { text: t("TimeLogin.exportOptions.exportExcel"), icon: "/icons/csv.png" },
    { text: t("TimeLogin.exportOptions.exportPDF"), icon: "/icons/pdf.png" },
  ];

  useEffect(() => {
    setStage(t("AbsenceTime.TeamLeave.all"));
  }, [i18n.language, t]);

  return (
    <Box
      sx={{
        paddingBottom: { xs: "20px", sm: "40px", lg: "70px" },
        margin: { xs: "0.5rem", sm: "0.75rem", lg: "1rem" },
        bgcolor: secondaryColors.white,
        padding: { xs: "1rem", sm: "1.5rem", lg: "2rem" },
        borderRadius: { xs: "1rem", sm: "1.25rem", lg: "1.5rem" },
        boxShadow: "0px 0.1px 0px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", lg: "row" },
            justifyContent: { xs: "flex-start", lg: "space-between" },
            alignItems: { xs: "flex-start", sm: "flex-start", lg: "center" },
            padding: { xs: "0 8px", sm: "0 16px", lg: "0 22px" },
            marginBottom: { xs: "20px", sm: "25px", lg: "30px" },
            gap: { xs: "16px", sm: "12px", lg: "0" },
          }}
        >
          <Typography
            sx={{
              color: secondaryColors.black,
              fontWeight: 600,
              fontSize: { xs: "20px", sm: "24px", lg: "32px" },
              fontFamily: "Montserrat",
            }}
          >
            {t("AbsenceTime.TeamLeave.teamLeave")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: "12px", sm: "16px" },
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", lg: "auto" },
            }}
          >
            <CustomSwitchButton
              options={scopeOptions}
              activeOption={scope}
              onChange={setScope}
              defaultSelected="myteam"
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: "6px", sm: "8px" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Typography
                sx={{
                  color: secondaryColors.black,
                  fontWeight: 500,
                  fontSize: { xs: "12px", sm: "13px", lg: "14px" },
                  fontFamily: "Montserrat",
                }}
              >
                {t("AbsenceTime.TeamLeave.managerBoard")}
              </Typography>
              <Select
                value={managerBoard}
                onChange={(e) => setManagerBoard(e.target.value)}
                sx={{
                  borderRadius: { xs: "16px", sm: "18px", lg: "20px" },
                  height: { xs: "28px", sm: "30px", lg: "32px" },
                  fontSize: { xs: "12px", sm: "13px", lg: "14px" },
                  color: "#0E0E0E",
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { xs: "120px", sm: "140px" },
                }}
              >
                <MenuItem value="all">{t("AbsenceTime.TeamLeave.all")}</MenuItem>
                <MenuItem value="teamA">{t("AbsenceTime.TeamLeave.teamA")}</MenuItem>
                <MenuItem value="teamB">{t("AbsenceTime.TeamLeave.teamB")}</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        border={`1px solid ${secondaryColors.grey}`}
        borderRadius={{ xs: "0.75rem", sm: "0.875rem", lg: "1rem" }}
        pt={{ xs: 0.5, sm: 0.75, lg: 1 }}
        pb={{ xs: 0.5, sm: 0.75, lg: 1 }}
        sx={{ overflow: "hidden" }}
      >
        <TableHeader2
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          teamLeave={true}
        />
        <EventCalendar
          events={allEvents}
          allowAdd={false}
          showToolbar={true}
          customColors={customColors}
          onVisibleRangeChange={handleVisibleRangeChange}
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
