import React, { useState, useEffect } from "react";
import { Box, Alert, CircularProgress } from "@mui/material";
import WeeklyTimeCard from "./weeklyTimeCard/table";
import WeeklyTimeEntries from "./weeklyTimeEntries/table";
import { getAllTimeTrackingEntries } from "service/timeTrackingApi";
import { getItemFromLocalStorage, getSelectedTabType } from "utilities/getLocalStorageItem";

const WeeklyTimeManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const[totalTimeEntries,setTotalTimeEntries] = useState(0)
  const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = getItemFromLocalStorage("user");
  const userId = userRoleId?._id;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getCurrentWeekDates = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      startDateFormatted: startOfWeek.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      endDateFormatted: endOfWeek.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      })
    };
  };

  useEffect(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(endOfWeek.toISOString().split('T')[0]);
  }, []);

  const [currentWeek] = useState(getCurrentWeekDates());

  const fetchTimeEntries = async () => {
    if (!companyId || !userId) return;
    try {
      setLoading(true);
      setError(null);
      const params = {
        companyId: companyId,
        userId: userId,
        currentUserId: userId,
        page: page + 1,
        limit: rowsPerPage,
        type:getSelectedTabType()
      };
      if (startDate) params.from = startDate;
      if (endDate) params.to = endDate;
      const response = await getAllTimeTrackingEntries(params);
      console.log(response,'sdfsdjfdosuj')
      if (response && response.data) {
        setTimeEntries(response.data);
        setTotalHours(response?.totalHours || 0);
        setTotalMinutes(response?.totalMinutes || 0);
        setTotalTimeEntries(response?.totalRecords || 0);
      }
    } catch (err) {
      console.error('Error fetching time entries:', err);
      setError('Failed to load time entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeEntries();
  }, [companyId, userId, refreshTrigger, startDate, endDate,page,rowsPerPage]);

  // Function to trigger refresh from child components
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Function to handle successful submission
  const handleSubmissionSuccess = () => {
    handleRefresh();
  };

  if (!userRoleId || !companyId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }
console.log(timeEntries,'timeEntsdfdries')
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ margin: "1rem", marginBottom: "2rem" }}>
          {error}
        </Alert>
      )}
      
      <WeeklyTimeCard 
          startDate={startDate}
          endDate={endDate}
        currentWeek={currentWeek}
        companyId={companyId}
        userId={userId}
        onSubmissionSuccess={handleSubmissionSuccess}
        loading={loading}
        fetchTimeEntries={fetchTimeEntries}
        timeEntries={timeEntries}
      />
      
      <WeeklyTimeEntries 
        currentWeek={currentWeek}
        timeEntries={timeEntries}
        companyId={companyId}
        userId={userId}
        onRefresh={handleRefresh}
        loading={loading}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        totalHours={totalHours}
        totalMinutes={totalMinutes}
        totalTimeEntries={totalTimeEntries}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </Box>
  );
};

export default WeeklyTimeManagement;
