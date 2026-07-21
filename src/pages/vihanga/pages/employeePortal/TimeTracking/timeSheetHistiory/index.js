import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  useMediaQuery,
  useTheme,
  TextField,
  CircularProgress,
} from "@mui/material";
import LeaveTable4 from "./table";
import CustomMap from "pages/vihanga/components/MapView/CustomMap";
import CustomSwitchButton from "pages/vihanga/components/SwitchButton/CustomSwitch";
import UserOnboarding from "react-user-onboarding";

import LocationImage from "../../../../../../assets/images/location.png";

import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { appURL } from "utilities";
import { getItemFromLocalStorage, getSelectedTabType } from "utilities/getLocalStorageItem";
import { getThemeColors } from "utilities/getThemeColors";
import { 
  getAllTimeTrackingEntries, 
  createTimeTrackingEntry, 
  updateTimeTrackingEntry 
} from "service/timeTrackingApi";
import { addPendingAction, getPendingActions, clearPendingActions, migrateLocalQueueToSW, hasLocalPendingActions, getLocalPendingActions, generateOfflineId } from "utilities/offlineTimeTracking";
import { useTranslation } from 'react-i18next';
// import { canEdit } from "utilities/privilegeHelper";
const TimeSheetHistory = () => {


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  // Onboarding states and refs
  const [isVisible, setIsVisible] = useState(false);
  const clockButtonRef = useRef();

  const [selectedSwitch, setSelectedSwitch] = useState("geo");
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showClockButton,setShowClockButton]=useState("0");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timeEntryId, setTimeEntryId] = useState(null);
  const [timeTrackingData, setTimeTrackingData] = useState([]);
  const [error, setError] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt'); // 'granted', 'denied', 'prompt'
  const [locationMethod, setLocationMethod] = useState(null); // 'gps', 'ip', 'manual'
  const [isLocating, setIsLocating] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTimeEntries, setTotalTimeEntries] = useState(0);
  const [dataLoading, setDataLoading] = useState(false);
  // Date filtering states - added from WeeklyTime
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!navigator.onLine);
  const [refreshingLocation, setRefreshingLocation] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPageForInfiniteScroll, setCurrentPageForInfiniteScroll] = useState(0);
  
  const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = getItemFromLocalStorage("user");
  const user = getItemFromLocalStorage("user");
   const { t } = useTranslation();
  // const showClockButton=getItemFromLocalStorage("showClockButton");

  const { primaryColor, secondaryColors } = getThemeColors();

  // Added getCurrentWeekDates function from WeeklyTime
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

  // Helper function to get today's time entries with valid distanceTraveled coordinates
  const getTodayTimeEntries = () => {
    const today = new Date();
    const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    
    return timeTrackingData.filter(entry => {
      if (!entry.dateString || !entry.distanceTraveled) return false;
      
      // Check if the entry is from today
      const entryDate = entry.dateString;
      let isToday = false;
      
      // Handle different date formats (M/D/YYYY, MM/DD/YYYY, DD MMM YYYY, YYYY-MM-DD)
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(entryDate)) {
        // Format: M/D/YYYY or MM/DD/YYYY
        isToday = entryDate === todayStr;
      } else if (/\d{1,2} [A-Za-z]{3} \d{4}/.test(entryDate)) {
        // Format: DD MMM YYYY
        const entryDateObj = new Date(Date.parse(entryDate));
        isToday = entryDateObj.toDateString() === today.toDateString();
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
        // Format: YYYY-MM-DD
        const entryDateObj = new Date(entryDate);
        isToday = entryDateObj.toDateString() === today.toDateString();
      }
      
      // Must have valid distanceTraveled with coordinates
      return isToday && entry.distanceTraveled && (
        (entry.distanceTraveled.clockInCoordinates?.latitude && entry.distanceTraveled.clockInCoordinates?.longitude) ||
        (entry.distanceTraveled.clockOutCoordinates?.latitude && entry.distanceTraveled.clockOutCoordinates?.longitude)
      );
    });
  };

  // Added useEffect to initialize dates from WeeklyTime
  useEffect(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(endOfWeek.toISOString().split('T')[0]);
  }, []);

  const [currentWeek] = useState(getCurrentWeekDates());

  // Onboarding tutorial effect
  useEffect(() => {
    if (location.state && location.state.story === "clockInOutTutorial") {
      // Wait for the element to be rendered
      const checkAndActivate = () => {
        if (clockButtonRef.current) {
          setIsVisible(location.state ? location.state.isVisible : false);
          window.history.replaceState({ isVisible: false }, document.title);
        } else {
          // Retry after a short delay if element not ready
          setTimeout(checkAndActivate, 100);
        }
      };
      
      setTimeout(checkAndActivate, 300);
    }
  }, [location, clockButtonRef]);

  // Add highlight class to tutorial elements when visible
  useEffect(() => {
    if (isVisible && location.state && clockButtonRef.current) {
      clockButtonRef.current.classList.add('tutorial-highlight');
    } else {
      if (clockButtonRef.current) {
        clockButtonRef.current.classList.remove('tutorial-highlight');
      }
    }
    
    return () => {
      // Cleanup on unmount
      if (clockButtonRef.current) {
        clockButtonRef.current.classList.remove('tutorial-highlight');
      }
    };
  }, [isVisible, location]);

  // Story configuration for combined clock in/out tutorial
  const clockInOutStory = [
    {
      component: "tooltip",
      ref: clockButtonRef,
      children: (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>Step 1: Clock In</Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
            Make sure your location is detected, then click this button to clock in when you start your work day
          </Typography>
        </Box>
      ),
    },
    {
      component: "tooltip",
      ref: clockButtonRef,
      children: (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>Step 2: Clock Out</Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
            When you're done for the day, click this same button to clock out and log your work hours
          </Typography>
        </Box>
      ),
    },
    {
      component: "modal",
      tooltipID: "#getStarted",
      verticalPosition: "center",
      horizontalPosition: "center",
      intro: false,
      children: (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "1.1rem" }}>Excellent {user?.firstName || user?.name}!</Typography>
          <Typography sx={{ mt: 2 }}>You have completed the Clock In/Out tutorial!</Typography>
          <Typography sx={{ mt: 1 }}>Now you know how to clock in when you start work and clock out when you finish.</Typography>
        </Box>
      ),
    },
  ];

  const getStory = () => {
    if (location.state?.story === "clockInOutTutorial") {
      return clockInOutStory;
    }
    return [];
  };

  // Enhanced geolocation function with fallback
  const checkLocationPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(status.state);
        // keep state in sync if user changes permission while page is open
        status.onchange = () => setLocationPermission(status.state);
        return status.state;
      }
    } catch (e) {
      // ignore and fall through
    }
    return 'prompt';
  };

  const requestLocation = async () => {
    setIsLocating(true);
    setError(null);
    
    try {
      // Check permission first to provide a professional message if blocked
      const permission = await checkLocationPermission();
      if (permission === 'denied') {
        setIsLocating(false);
        setLocationMethod('manual');
        setError("Location access is blocked. Please enable location permissions in your browser settings and click 'Refresh Location' again.");
        return;
      }
      // First, try GPS location
      await tryGPSLocation();
    } catch (gpsError) {
      // If permission is denied, do not fallback silently; ask user to enable
      if (gpsError && gpsError.message === 'permission-denied') {
        return;
      }
      console.log('GPS failed, trying IP location...', gpsError);
      // If GPS fails otherwise, try IP-based location
      await tryIPLocation();
    }
  };

  // Try GPS-based location
  const tryGPSLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          const accuracy = pos.coords.accuracy;
          setPosition({ latitude, longitude, accuracy });
          setLocationMethod('gps');
          setError(null);
          setIsLocating(false);
          resolve({ latitude, longitude, accuracy });
        },
        (err) => {
          // 1 = PERMISSION_DENIED
          if (err && err.code === 1) {
            setError("Location access is blocked. Please enable location permissions in your browser settings and click 'Refresh Location' again.");
            setIsLocating(false);
            setLocationMethod('manual');
            reject(new Error('permission-denied'));
            return;
          }
          reject(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // 15 seconds for better accuracy
          maximumAge: 60000, // 1 minute for fresher location data
        }
      );
    });
  };

  // Try IP-based location as fallback
  const tryIPLocation = async () => {
    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        setPosition({ 
          latitude: data.latitude, 
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country
        });
        setLocationMethod('ip');
        setError(null);
        setIsLocating(false);
      } else {
        throw new Error("IP location not available");
      }
    } catch (ipError) {
      console.log('IP location failed, showing manual option...', ipError);
      // If both GPS and IP fail, show manual option
      setLocationMethod('manual');
      setError("We couldn't detect your location automatically. Please enable location access or use manual entry.");
      setIsLocating(false);
    }
  };

  // Manual location entry
  const handleManualLocation = (lat, lng) => {
    setPosition({ latitude: lat, longitude: lng });
    setLocationMethod('manual');
    setError(null);
  };

  // Watch position for continuous updates (professional apps do this)
  const watchLocation = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          setPosition({ latitude, longitude });
          setLocationMethod('gps');
          setError(null);
        },
        (err) => {
          console.log('Watch position error:', err);
          // Don't show error for watch position failures
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000, // 1 minute
        }
      );
      
      return watchId;
    }
  };


  useEffect(()=>{
    const savedButtonState = getItemFromLocalStorage("showClockButton");
    if (savedButtonState) {
      setShowClockButton(savedButtonState);
    }

  },[isClockedIn])


  useEffect(() => {
    // This function will run on mount and every minute
    const checkDailyReset = () => {
      const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const todayIST = nowIST.toDateString();
      const currentHour = nowIST.getHours();

      // 1. If last clock-out was before today, reset
      const lastClockOutDate = localStorage.getItem("lastClockOutDate");
      if (lastClockOutDate) {
        const lastClockOutIST = new Date(new Date(lastClockOutDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        if (lastClockOutIST.toDateString() !== todayIST) {
          setShowClockButton("0");
          localStorage.setItem("showClockButton", "0");
          setIsClockedIn(false);
          localStorage.removeItem("lastClockOutDate");
          localStorage.removeItem('currentTimeEntryId');
          localStorage.removeItem('currentTimeEntryDate');
          localStorage.setItem("lastResetDate", nowIST.toISOString());
          return;
        }
      }

      // 2. If it's after 6am and we haven't reset today, reset
      const lastResetDate = localStorage.getItem("lastResetDate");
      const lastResetIST = lastResetDate ? new Date(new Date(lastResetDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })) : null;
      if (currentHour >= 6) {
        if (!lastResetIST || lastResetIST.toDateString() !== todayIST) {
          setShowClockButton("0");
          localStorage.setItem("showClockButton", "0");
          setIsClockedIn(false);
          localStorage.removeItem("lastClockOutDate");
          localStorage.removeItem('currentTimeEntryId');
          localStorage.removeItem('currentTimeEntryDate');
          localStorage.setItem("lastResetDate", nowIST.toISOString());
        }
      }
    };

    // Run once on mount
    checkDailyReset();
    // Then run every minute
    const intervalId = setInterval(checkDailyReset, 60000);
    return () => clearInterval(intervalId);
  }, []);
  
  
  
  
  

  // Request geolocation on mount
  useEffect(() => {
    checkLocationPermission();
    requestLocation();
    
    // Start watching position after initial load
    const watchId = watchLocation();
    
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Helper: Get latest time entry for today (online or offline)
  const getLatestTimeEntryForToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    // 1. If offline, check local pending actions
    if (!navigator.onLine) {
      const actions = getLocalPendingActions();
      // Filter for today and this user
      const filtered = actions.filter(action => {
        const entry = action.data;
        // Check dateString for today
        return (
          entry &&
          (entry.dateString === today || entry.dateString === undefined) &&
          entry.userId === userRoleId._id
        );
      });
      // Sort by timestamp (latest last)
      filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      // Merge clockIn/clockOut for same entry
      let lastEntry = null;
      let entryMap = {};
      filtered.forEach(action => {
        const id = action.data._id || action.data.timeEntryId;
        if (!entryMap[id]) entryMap[id] = { ...action.data };
        if (action.type === 'clockIn') {
          entryMap[id] = { ...entryMap[id], ...action.data, status: 'Clocked In' };
        }
        if (action.type === 'clockOut') {
          entryMap[id] = { ...entryMap[id], ...action.data, status: 'Approved' };
        }
      });
      // Get the latest by timestamp
      const entries = Object.values(entryMap);
      if (entries.length > 0) {
        // Find the latest by timeIn/timeOut or timestamp
        entries.sort((a, b) => {
          const tA = a.timeIn ? new Date(`${a.dateString} ${a.timeIn}`) : new Date(a.timestamp || 0);
          const tB = b.timeIn ? new Date(`${b.dateString} ${b.timeIn}`) : new Date(b.timestamp || 0);
          return tB - tA;
        });
        lastEntry = entries[0];
      }
      return lastEntry;
    }
    // 2. If online, fetch from server
    try {
      const params = {
        companyId,
        userId: userRoleId._id,
        currentUserId: userRoleId._id,
        from: today,
        to: today,
        limit: 10,
        page: 1,
        type:getSelectedTabType()
      };
      const responseData = await getAllTimeTrackingEntries(params);
      let mainData = Array.isArray(responseData.data) ? responseData.data : [];
      // Sort by timeIn (latest last)
      mainData.sort((a, b) => {
        const tA = a.timeIn ? new Date(`${a.dateString} ${a.timeIn}`) : new Date(0);
        const tB = b.timeIn ? new Date(`${b.dateString} ${b.timeIn}`) : new Date(0);
        return tB - tA;
      });
      return mainData[0] || null;
    } catch (e) {
      return null;
    }
  };

  // Add a robust date comparison helper
  const isToday = (dateString) => {
    if (!dateString) return false;
    // Try to parse both '20 Jul 2025' and '7/20/2025' formats
    let recordDate;
    if (/\d{1,2} [A-Za-z]{3} \d{4}/.test(dateString)) {
      // Format: '20 Jul 2025'
      recordDate = new Date(Date.parse(dateString));
    } else {
      // Try default parsing (e.g., '7/20/2025')
      recordDate = new Date(dateString);
    }
    const today = new Date();
    return (
      today.getDate() === recordDate.getDate() &&
      today.getMonth() === recordDate.getMonth() &&
      today.getFullYear() === recordDate.getFullYear()
    );
  };

  // Refactored effect to always use latest entry for today
  useEffect(() => {
    const checkLatestEntry = async () => {
      if (!companyId || !userRoleId?._id) return;
      
      // First check localStorage for current clock-in state (source of truth for current session)
      const storedTimeEntryId = localStorage.getItem('currentTimeEntryId');
      const storedDate = localStorage.getItem('currentTimeEntryDate');
      const today = new Date().toLocaleDateString("en-US");
      
      // If we have a stored entry for today, trust it and don't reset
      if (storedTimeEntryId && storedDate) {
        const storedDateObj = new Date(storedDate);
        const todayObj = new Date(today);
        if (storedDateObj.toDateString() === todayObj.toDateString()) {
          // Current session has an active clock-in for today
          setIsClockedIn(true);
          setTimeEntryId(storedTimeEntryId);
          localStorage.setItem('showClockButton', '1');
          return; // Don't override with API check
        }
      }
      
      // Otherwise, check the API/offline storage
      const latestEntry = await getLatestTimeEntryForToday();
      if (latestEntry && isToday(latestEntry.dateString) && !latestEntry.timeOut) {
        setIsClockedIn(true);
        setTimeEntryId(latestEntry._id || latestEntry.timeEntryId);
        // Store for offline use
        localStorage.setItem('currentTimeEntryId', latestEntry._id || latestEntry.timeEntryId);
        localStorage.setItem('currentTimeEntryDate', latestEntry.dateString || '');
        localStorage.setItem('showClockButton', '1');
      } else {
        // Only reset if there's no stored entry for today
        if (!storedTimeEntryId || !storedDate || !isToday(storedDate)) {
          setIsClockedIn(false);
          setTimeEntryId(null);
          localStorage.removeItem('currentTimeEntryId');
          localStorage.removeItem('currentTimeEntryDate');
          localStorage.setItem('showClockButton', '0');
        }
      }
    };
    checkLatestEntry();
  }, [companyId, userRoleId?._id, offlineMode, refreshTrigger]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getLocalUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) return JSON.parse(userStr);
    } catch (e) {}
    return null;
  };

  // Helper to merge offline clock in/out actions into single entry per timeEntryId
  const getMergedPendingEntries = () => {
    const localUser = getLocalUser();
    const actions = getLocalPendingActions();
    const entryMap = {};
    actions.forEach(action => {
      const id = action.data._id || action.data.timeEntryId;
      if (!entryMap[id]) {
        entryMap[id] = { ...action.data, status: 'Pending Sync', _isPendingOffline: true };
        // Attach employeeInfo from local user if not present
        if (!entryMap[id].employeeInfo && localUser) {
          entryMap[id].employeeInfo = {
            name: localUser.name || localUser.firstName || '',
            email: localUser.email || '',
            department: localUser.department || '',
            profilePicture: localUser.profilePicture || '',
            _id: localUser._id || '',
          };
        }
      }
      if (action.type === 'clockIn') {
        entryMap[id] = { ...entryMap[id], ...action.data, status: 'Pending Sync', _isPendingOffline: true };
      }
      if (action.type === 'clockOut') {
        entryMap[id] = { ...entryMap[id], ...action.data, status: 'Pending Sync', _isPendingOffline: true };
      }
    });
    return Object.values(entryMap);
  };

  // Fetch time tracking data with pagination
  const fetchTimeTrackingData = async (append = false, nextPage = null) => {
    if (!companyId || !userRoleId?._id) return;
    if (!navigator.onLine) {
      setOfflineMode(true);
      // Only show merged local pending actions when offline
      const pending = getMergedPendingEntries();
      setTimeTrackingData(pending);
      setTotalTimeEntries(pending.length);
      setTotalPages(1);
      setDataLoading(false);
      setHasMore(false);
      return;
    }
    
    if (append) {
      setLoadingMore(true);
    } else {
      setDataLoading(true);
    }
    
    try {
      // Use nextPage if provided (for infinite scroll), otherwise use current page
      const currentPage = append && nextPage !== null ? nextPage : page;
      const params = {
        companyId,
        userId: userRoleId._id,
        currentUserId: userRoleId._id,
        page: currentPage + 1, // Backend expects 1-based page
        limit: rowsPerPage,
        type:getSelectedTabType()
      };
      // Always include date range - if not set, use current week
      if (startDate && endDate) {
        params.from = startDate;
        params.to = endDate;
      } else {
        // Fallback to current week if no dates are set
        const currentWeekDates = getCurrentWeekDates();
        params.from = currentWeekDates.startDate;
        params.to = currentWeekDates.endDate;
      }
      const responseData = await getAllTimeTrackingEntries(params);
      let mainData = Array.isArray(responseData.data) ? responseData.data : [];
      // Merge with pending offline actions (only on first load)
      const pending = append ? [] : getMergedPendingEntries();
      
      if (append) {
        // Append new data to existing data
        setTimeTrackingData(prev => [...prev, ...mainData]);
        // Update internal page counter for infinite scroll (don't update page state to avoid triggering useEffect)
        setCurrentPageForInfiniteScroll(currentPage);
      } else {
        // Replace data on initial load or refresh
        setTimeTrackingData([...pending, ...mainData]);
        setCurrentPageForInfiniteScroll(0);
      }
      
      setTotalHours(responseData?.totalHours || 0);
      setTotalMinutes(responseData?.totalMinutes || 0);
      setTotalTimeEntries((responseData?.totalRecords || mainData.length || 0) + (append ? 0 : pending.length));
      setTotalPages(responseData?.totalPages || 0);
      
      // Check if there's more data to load
      const currentTotalPages = responseData?.totalPages || 0;
      setHasMore(currentPage + 1 < currentTotalPages);
    } catch (error) {
      setError("Failed to fetch time-tracking data.");
      if (!append) {
        setTimeTrackingData([]);
        setTotalTimeEntries(0);
      }
      setHasMore(false);
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setDataLoading(false);
      }
    }
  };

  // Load more data for infinite scroll
  const loadMoreData = async () => {
    if (loadingMore || !hasMore || dataLoading) return;
    const nextPage = currentPageForInfiniteScroll + 1;
    await fetchTimeTrackingData(true, nextPage);
  };

  // Refresh function for approval actions
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Refresh current location with permission check
  const handleRefreshLocation = async () => {
    setRefreshingLocation(true);
    try {
      const permission = await checkLocationPermission();
      if (permission === 'denied') {
        setError("Location access is blocked. Please enable location permissions in your browser settings and click 'Refresh Location' again.");
        setLocationMethod('manual');
        return;
      }
      await requestLocation();
    } finally {
      setRefreshingLocation(false);
    }
  };

  // Function to handle successful submission
  const handleSubmissionSuccess = () => {
    handleRefresh();
  };

  // Handle page size change - reset to first page
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  useEffect(() => {
    // Reset page and hasMore when filters change
    setPage(0);
    setCurrentPageForInfiniteScroll(0);
    setHasMore(true);
    fetchTimeTrackingData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, userRoleId?._id, rowsPerPage, isClockedIn, startDate, endDate, refreshTrigger]);

  // Handle page change for desktop pagination (only for desktop, not mobile infinite scroll)
  useEffect(() => {
    // Only fetch if page changed and it's not from infinite scroll
    // We check if we're not currently loading more (which means it's a desktop pagination change)
    if (page > 0 && !loadingMore) {
      fetchTimeTrackingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Reset data when switching from mobile to desktop to prevent showing accumulated data
  useEffect(() => {
    if (!isMobile && timeTrackingData.length > rowsPerPage) {
      // If switching to desktop and we have more data than one page, reset to current page
      fetchTimeTrackingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Clock In/Out handler
  const handleTrackLocation = async () => {
    if (!position) {
      setError("Location not available. Please allow location access.");
      return;
    }
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 5;
        }
        return prev;
      });
    }, 100);

    // --- OFFLINE SYNC LOGIC ---
    if (!navigator.onLine) {
      setError(null);
      if (!isClockedIn) {
        // Queue clock-in
        const now = new Date();
        const day = now.toLocaleString("en-US", { weekday: "long" });
        const dateString = now.toLocaleDateString("en-US");
        const timeIn = now.toLocaleTimeString("en-US", { hour12: false });
        // Generate a temporary offline ID
        const offlineId = generateOfflineId();
        const timeEntryData = {
          _id: offlineId, // include offline ID
          companyId,
          userId: userRoleId._id,
          day,
          dateString,
          timeIn,
          timeOut: null,
          hours: "00:00:00",
          method: "Geo",
          status: "Clocked In",
          latitude: position.latitude,
          longitude: position.longitude,
        };
        // Store offline ID for later clock-out
        setIsClockedIn(true);
        setTimeEntryId(offlineId);
        setShowClockButton("1");
        localStorage.setItem("currentTimeEntryId", offlineId);
        localStorage.setItem("currentTimeEntryDate", dateString);
        localStorage.setItem("showClockButton", "1");
        addPendingAction({ type: "clockIn", data: timeEntryData, timestamp: Date.now() });
        setError("You are offline. Clock-in queued for sync when back online.");
      } else {
        // Queue clock-out - get timeEntryId from localStorage or current state
        const now = new Date();
        const timeOut = now.toLocaleTimeString("en-US", { hour12: false });
        const storedTimeEntryId = localStorage.getItem('currentTimeEntryId') || timeEntryId;
        if (!storedTimeEntryId) {
          setError("Unable to clock out offline. Please try when online.");
          setLoading(false);
          clearInterval(interval);
          setProgress(100);
          return;
        }
        setIsClockedIn(false);
        setTimeEntryId(null);
        setShowClockButton("2");
        localStorage.setItem("showClockButton", "2");
        localStorage.setItem("lastClockOutDate", new Date().toISOString());
        // Clear stored timeEntryId after clock-out
        localStorage.removeItem('currentTimeEntryId');
        localStorage.removeItem('currentTimeEntryDate');
        addPendingAction({
          type: "clockOut",
          data: {
            companyId,
            userId: userRoleId._id,
            timeEntryId: storedTimeEntryId, // will be offlineId if offline
            timeOut,
            status: "Approved",
            latitude: position.latitude,
            longitude: position.longitude
          },
          timestamp: Date.now()
        });
        setError("You are offline. Clock-out queued for sync when back online.");
      }
      setLoading(false);
      clearInterval(interval);
      setProgress(100);
      return;
    }

    if (!isClockedIn) {
      // Clock In
      const now = new Date();
      const day = now.toLocaleString("en-US", { weekday: "long" });
      const dateString = now.toLocaleDateString("en-US");
      const timeIn = now.toLocaleTimeString("en-US", { hour12: false });
      const timeEntryData = {
        companyId,
        userId: userRoleId._id,
        day,
        dateString,
        timeIn,
        timeOut: null,
        hours: "00:00:00",
        method: "Geo",
        status: "Clocked In",
        latitude: position.latitude,
        longitude: position.longitude,
      };
      try {
        console.log("timeEntryData", timeEntryData);
        const response = await createTimeTrackingEntry(timeEntryData);
        console.log("Clock In response:", response);
        const newTimeEntryId = response.data.data[0]._id;
        setTimeEntryId(newTimeEntryId);
        console.log("timeEntryId", newTimeEntryId);
        // Store timeEntryId in localStorage for offline use
        localStorage.setItem('currentTimeEntryId', newTimeEntryId);
        localStorage.setItem('currentTimeEntryDate', dateString);
        setIsClockedIn(true);
        setShowClockButton("1");
        localStorage.setItem("showClockButton", "1");
        setError(null);
        // Refresh the time tracking data after a short delay to ensure state is persisted
        setTimeout(() => {
          handleSubmissionSuccess();
        }, 300);
      } catch (error) {
        setError("Failed to clock in.");
      } finally {
        setLoading(false);
        clearInterval(interval);
        setProgress(100);
      }
    } else {
      // Clock Out
      const now = new Date();
      const timeOut = now.toLocaleTimeString("en-US", { hour12: false });
      try {
        // Get current entry to calculate hours
        const responseData = await getAllTimeTrackingEntries({
          companyId,
          userId: userRoleId._id,
          id: timeEntryId,
          type:getSelectedTabType()
        });
        const currentEntry = responseData?.data?.find(
          (entry) => entry._id === timeEntryId
        );
        
        if (currentEntry && currentEntry.timeIn) {
          const timeInDate = new Date(`${currentEntry.dateString} ${currentEntry.timeIn}`);
          const timeOutDate = new Date(`${currentEntry.dateString} ${timeOut}`);
          const durationMs = timeOutDate - timeInDate;
          if (durationMs < 0) throw new Error("Invalid time: timeOut is before timeIn");
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
          const pad = (num) => String(num).padStart(2, '0');
          const formattedDuration = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
          
          
          await updateTimeTrackingEntry({
            companyId,
            userId: userRoleId._id,
            timeEntryId,
            timeOut,
            hours: formattedDuration,
            status: "Approved",
            latitude: position.latitude,
            longitude: position.longitude
          });
          setIsClockedIn(false);
          setShowClockButton("2");
          localStorage.setItem("showClockButton", "2");
          setTimeEntryId(null);
          localStorage.setItem("lastClockOutDate", new Date().toISOString());
          // Clear stored timeEntryId after successful clock-out
          localStorage.removeItem('currentTimeEntryId');
          localStorage.removeItem('currentTimeEntryDate');
          setError(null);
          // Refresh the time tracking data after a short delay
          setTimeout(() => {
            handleSubmissionSuccess();
          }, 300);
        } else {
          throw new Error("Time entry not found or invalid timeIn.");
        }
      } catch (error) {
        setError("Failed to clock out.");
      } finally {
        setLoading(false);
        clearInterval(interval);
        setProgress(100);
      }
    }
  };

  // On every app load and when online, always migrate and trigger sync
  useEffect(() => {
    const doMigrationAndSync = async () => {
      console.log('[OfflineSync] Starting migration and sync...');
      
      // Clear any offline error when coming online
      setError(null);
      
      // Check if service worker is ready
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        if (hasLocalPendingActions()) {
          console.log('[OfflineSync] Migrating actions from localStorage:', getLocalPendingActions());
          migrateLocalQueueToSW();
          // Wait a moment for migration to complete, then trigger sync
          setTimeout(() => {
            navigator.serviceWorker.controller.postMessage('syncApiQueue');
          }, 100);
        } else {
          // No localStorage actions, just trigger sync
          navigator.serviceWorker.controller.postMessage('syncApiQueue');
        }
      } else {
        // Service worker not ready, process localStorage actions directly
        if (hasLocalPendingActions()) {
          console.log('[OfflineSync] Service worker not ready, processing localStorage actions directly');
          const actions = getLocalPendingActions();
          await processQueuedActions(actions);
          // Clear localStorage after processing
          localStorage.removeItem('pendingTimeTrackingActions');
        }
      }
    };
    
    doMigrationAndSync();
    window.addEventListener('online', doMigrationAndSync);
    return () => window.removeEventListener('online', doMigrationAndSync);
  }, []);

  // Also listen for online event to clear error
  useEffect(() => {
    const handleOnline = () => {
      setError(null);
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Listen for service worker messages about pending actions and process queue
  useEffect(() => {
    const handler = (event) => {
      if (event.data && event.data.type === 'pendingActionsCount') {
        setPendingCount(event.data.count);
        setSyncing(event.data.count > 0);
      } else if (event.data && event.data.type === 'processQueuedActions') {
        // Process queued actions using existing API methods
        console.log('[OfflineSync] Received processQueuedActions message:', event.data.actions);
        processQueuedActions(event.data.actions);
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handler);
    }
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handler);
      }
    };
  }, []);

  // Process queued actions using existing API methods
  const processQueuedActions = async (actions) => {
    setSyncing(true);
    const failedActions = [];
    // Group actions by type and process clockIn first, then clockOut
    const clockInActions = actions.filter(action => action.type === 'clockIn');
    const clockOutActions = actions.filter(action => action.type === 'clockOut');
    // Map to store offlineId -> real MongoID
    const offlineIdToMongoId = new Map();
    // Map to track completion status for each timeEntry (offlineId or realId)
    const completionMap = new Map();
    // Track which actions to keep (not completed pairs)
    const keepActions = [];
    // Process clockIn actions first
    for (const action of clockInActions) {
      try {
        const data = { ...action.data };
        let offlineId = null;
        if (data._id && String(data._id).startsWith('offline-')) {
          offlineId = data._id;
          delete data._id;
        }
        const response = await createTimeTrackingEntry(data);
        let realId = response?.data?.data?.[0]?._id;
        if (realId && offlineId) {
          offlineIdToMongoId.set(offlineId, realId);
          completionMap.set(offlineId, { clockIn: true, clockOut: false, realId });
        } else if (realId) {
          completionMap.set(realId, { clockIn: true, clockOut: false, realId });
        }
        if (realId) {
          localStorage.setItem('currentTimeEntryId', realId);
          localStorage.setItem('currentTimeEntryDate', data.dateString);
        }
      } catch (error) {
        failedActions.push(action);
        // Mark as incomplete
        if (action.data._id) {
          completionMap.set(action.data._id, { clockIn: false, clockOut: false });
        }
      }
    }
    // Helper to wait for a mapping to appear (with timeout)
    const waitForMongoId = async (offlineId, timeout = 5000, interval = 200) => {
      let waited = 0;
      while (waited < timeout) {
        if (offlineIdToMongoId.has(offlineId)) {
          return offlineIdToMongoId.get(offlineId);
        }
        await new Promise(res => setTimeout(res, interval));
        waited += interval;
      }
      return null;
    };
    // Process clockOut actions
    for (const action of clockOutActions) {
      try {
        const data = { ...action.data };
        let isOfflineId = false;
        let offlineId = null;
        if (data.timeEntryId && String(data.timeEntryId).startsWith('offline-')) {
          isOfflineId = true;
          offlineId = data.timeEntryId;
        }
        // If timeEntryId is an offlineId, wait for mapping
        if (isOfflineId) {
          const realId = await waitForMongoId(data.timeEntryId);
          if (realId) {
            data.timeEntryId = realId;
          } else {
            // fallback: try to find in backend
            const today = new Date().toLocaleDateString("en-US");
            const entries = await getAllTimeTrackingEntries({
              companyId: data.companyId,
              userId: data.userId,
              from: today,
              to: today,
              type:getSelectedTabType()
            });
            const activeEntry = entries?.data?.find(entry => entry.status === 'Clocked In' && entry.dateString === today && entry.userId === data.userId);
            if (activeEntry) {
              data.timeEntryId = activeEntry._id;
            } else {
              failedActions.push(action);
              // Mark as incomplete
              if (offlineId) {
                let status = completionMap.get(offlineId) || { clockIn: false, clockOut: false };
                status.clockOut = false;
                completionMap.set(offlineId, status);
              }
              continue;
            }
          }
        }
        await updateTimeTrackingEntry(data);
        // Mark as completed in completionMap
        let key = offlineId || data.timeEntryId;
        let status = completionMap.get(key) || { clockIn: false, clockOut: false };
        status.clockOut = true;
        completionMap.set(key, status);
        localStorage.removeItem('currentTimeEntryId');
        localStorage.removeItem('currentTimeEntryDate');
      } catch (error) {
        failedActions.push(action);
        // Mark as incomplete
        if (action.data.timeEntryId) {
          let key = action.data.timeEntryId;
          let status = completionMap.get(key) || { clockIn: false, clockOut: false };
          status.clockOut = false;
          completionMap.set(key, status);
        }
      }
    }
    // Only remove actions from queue if both clockIn and clockOut are completed for a timeEntry
    for (const action of actions) {
      let key = null;
      if (action.type === 'clockIn' && action.data._id) {
        key = action.data._id;
      } else if (action.type === 'clockOut' && action.data.timeEntryId) {
        key = action.data.timeEntryId;
      }
      const status = key ? completionMap.get(key) : null;
      if (!status || !status.clockIn || !status.clockOut) {
        keepActions.push(action);
      }
    }
    // Update the queue with only incomplete pairs
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'clearQueueAndAddFailed',
        failedActions: keepActions.concat(failedActions)
      });
    } else {
      // Fallback: update localStorage directly
      localStorage.setItem('pendingTimeTrackingActions', JSON.stringify(keepActions.concat(failedActions)));
    }
    setSyncing(false);
    handleRefresh();
  };

  // Debug function to manually trigger sync
  const triggerManualSync = () => {
    console.log('[OfflineSync] Manual sync triggered');
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('syncApiQueue');
    } else if (hasLocalPendingActions()) {
      console.log('[OfflineSync] Manual sync - processing localStorage actions directly');
      const actions = getLocalPendingActions();
      processQueuedActions(actions);
    }
  };

  return (
    <Box>
      {/* Global Offline Banner */}
      {offlineMode && (
        <Box sx={{
          width: '100%',
          bgcolor: '#ffe082',
          color: '#333',
          p: 2,
          mb: 2,
          borderRadius: 2,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          You are offline. You can view your data once you are back online. Clock In/Out will be synced automatically.
        </Box>
      )}
      {/* Pending Actions UI Indicator */}
      {pendingCount > 0 && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#fff3e0',
          border: '1px solid #ffb74d',
          borderRadius: '8px',
          padding: '8px 16px',
          marginBottom: '16px',
        }}>
          <span role="img" aria-label="sync" style={{ animation: 'spin 1s linear infinite' }}>🔄</span>
          <Typography sx={{ color: '#f57c00', fontWeight: 500 }}>
            {syncing ? `${pendingCount} action${pendingCount > 1 ? 's' : ''} pending sync...` : 'All actions synced.'}
          </Typography>
        </Box>
      )}
      {/* Error notification */}
      {error && (
        <Box sx={{
          bgcolor: '#ffebee',
          color: '#b71c1c',
          p: 2,
          mb: 2,
          borderRadius: 2,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {error}
        </Box>
      )}
      <MapViewForTimeHistory
        position={position}
        selectedSwitch={selectedSwitch}
        setSelectedSwitch={setSelectedSwitch}
        loading={loading}
        progress={progress}
        onTrackLocation={handleTrackLocation}
        isClockedIn={isClockedIn}
        showClockButton={showClockButton}
        error={error}
        locationMethod={locationMethod}
        isLocating={isLocating}
        onRetryLocation={requestLocation}
        onManualLocation={handleManualLocation}
        offlineMode={offlineMode}
        onRefresh={handleRefresh}
        onRefreshLocation={handleRefreshLocation}
        refreshingLocation={refreshingLocation}
        todayTimeEntries={getTodayTimeEntries()}
        clockButtonRef={clockButtonRef}
      />
      <Box
        sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: secondaryColors.white,
          padding: isMobile ? ".5rem" : ".5",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
      >
        <LeaveTable4 
          currentWeek={currentWeek}
          timeTrackingData={timeTrackingData}
          companyId={companyId}
          userId={userRoleId?._id}
          onRefresh={handleRefresh}
          totalTimeEntries={totalTimeEntries}
          loading={dataLoading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMoreData}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={handleRowsPerPageChange}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          totalHours={totalHours}
          totalMinutes={totalMinutes}
          offlineMode={offlineMode}
        />
      </Box>

      {/* Onboarding Component */}
      <UserOnboarding
        story={location.state ? getStory() : []}
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false);
        }}
      />

      {/* CSS Styles for tutorial */}
      <style>{`
        /* Fix broken cancel icon in react-user-onboarding */
        img[alt="cancel"] {
          display: none !important;
        }
        
        img[alt="cancel"]::before {
          content: '✕';
          font-size: 24px;
          color: #666;
          cursor: pointer;
          font-weight: 300;
          display: inline-block;
        }
        
        /* Target the cancel button container */
        [class*="cancel"] {
          position: relative;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        [class*="cancel"]::after {
          content: '✕';
          font-size: 24px;
          color: #666;
          cursor: pointer;
          font-weight: 300;
          line-height: 1;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        [class*="cancel"]:hover::after {
          color: #333;
        }
        
        /* Tutorial highlight effect */
        .tutorial-highlight {
          position: relative;
          box-shadow: 0 0 0 4px rgba(133, 128, 60, 0.4) !important;
          border-radius: 1rem !important;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 4px rgba(133, 128, 60, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(133, 128, 60, 0.2);
          }
          100% {
            box-shadow: 0 0 0 4px rgba(133, 128, 60, 0.4);
          }
        }
      `}</style>
    </Box>
  );
};

export default TimeSheetHistory;

const MapViewForTimeHistory = ({
  position,
  selectedSwitch,
  setSelectedSwitch,
  loading,
  progress,
  onTrackLocation,
  isClockedIn,
  error,
  locationMethod,
  isLocating,
  onRetryLocation,
  onManualLocation,
  showClockButton,
  offlineMode,
  onRefresh,
  onRefreshLocation,
  refreshingLocation,
  todayTimeEntries = [],
  clockButtonRef
}) => {

  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
const { t } = useTranslation();
const companyId = getItemFromLocalStorage("companyId");
const selectedTabType = getSelectedTabType();
const isMyTeamView = selectedTabType === 'myteam';
const isMyCompanyView = selectedTabType === 'mycompany';
const isManagerView = isMyTeamView || isMyCompanyView;

  const { primaryColor, secondaryColors } = getThemeColors();
  // Get location method icon and label
  const getLocationMethodDisplay = () => {
    switch(locationMethod) {
      case 'gps':
        return { icon: '🛰️', label: 'GPS Location', color: '#4caf50' };
      case 'ip':
        return { icon: '🌐', label: 'Network Location', color: '#2196f3' };
      case 'manual':
        return { icon: '📍', label: 'Manual Location', color: '#ff9800' };
      default:
        return { icon: '📍', label: 'Detecting...', color: '#666' };
    }
  };

  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)');
      return;
    }
    
    onManualLocation(lat, lng);
    setShowManualEntry(false);
    setManualLat('');
    setManualLng('');
  };

  const locationDisplay = getLocationMethodDisplay();

  return (
    <Box
      sx={{
        paddingBottom: isMobile ? "30px" : "70px",
        margin: isMobile ? "1rem .5rem" : "1rem",
        bgcolor: secondaryColors.white,
        padding: isMobile ? "10px" : "1rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      
      <Typography
        sx={{
          fontSize: isMobile ? "15px" : isTablet ? "20px" : "25px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
          marginTop: isMobile ? "1rem" : "1rem",
        }}
      >
        {t("TimeLogin.title")}
      </Typography>

      <Typography
        sx={{
          marginBottom: isMobile ? "1rem" : "1rem",

          fontSize: isMobile ? "12px" : isTablet ? "12px" : "15px",
        }}
      >
        {t("TimeLogin.discription-title")}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: isMobile ? '.3rem' : '' }}>
        <CustomSwitchButton
          iconExists={false}
          options={[
            { label: t("TimeLogin.buttonLables.bio"), value: "manual" },
            { label: t("TimeLogin.buttonLables.geo"), value: "geo" },
          ]}
          activeOption={selectedSwitch}
          onChange={(value) => {
            setSelectedSwitch(value);
            if (value === "manual") {
              history.push("/admin/previlages/time-tracking");
            } else if (value === "geo") {
              history.push("/admin/previlages/time-history");
            }
          }}
          sx={{ marginTop: 0 }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={onRefreshLocation}
          sx={{
            backgroundColor: "#85803c",
            textTransform: "none",
            borderRadius: "1rem",
            px: 2,
            '&:hover': { backgroundColor: '#6d5f32' }
          }}
          disabled={refreshingLocation}
        >
          {refreshingLocation ? (
            <>
              <CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} />
              {t("TimeLogin.refreshing")}
            </>
          ) : (
            t("TimeLogin.refreshLocation")
          )}
        </Button>
      </Box>
      
      <Typography
        sx={{
          fontSize: isMobile ? "15px" : isTablet ? "20px" : "25px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
          marginTop: isMobile ? "1rem" : "2rem",
        }}
      >
       {t("TimeLogin.LocationService")}
      </Typography>
      <p>
      {t("TimeLogin.message")}
</p>
      
      
      {/* Location Status Bar */}
      {/* {(position || isLocating) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginTop: "15px",
            padding: "8px 16px",
            backgroundColor: isLocating ? "#fff3e0" : "#f1f8e9",
            border: `1px solid ${isLocating ? "#ffb74d" : "#aed581"}`,
            borderRadius: "20px",
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          <span style={{ fontSize: "16px" }}>
            {isLocating ? "📍" : locationDisplay.icon}
          </span>
          <Typography
            sx={{
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "500",
              color: isLocating ? "#f57c00" : locationDisplay.color,
            }}
          >
            {isLocating ? "Detecting location..." : locationDisplay.label}
          </Typography>
        </Box>
      )} */}

      <Box sx={{ marginTop: "20px" }}>
        {loading ? (
          <>
          <Box sx={{ textAlign: "center", marginTop: "10px" }}>
      <img
        src={LocationImage} // put your location image path here
        alt="Location"
        style={{ width: 200, height: 200, marginBottom: "8px" }}
      />
     
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#85803c",
                },
              }}
            />

            <Typography sx={{
  textAlign: "center",
}}>
{t("TimeLogin.getting")}
      </Typography>
             
          </>
        ) : (
          <>
            {position && (
              <Box
                sx={{
                  margin: isMobile ? "" : "1rem",
                  padding: isMobile ? "" : ".5rem",
                  bgcolor: "#fff",
                  borderRadius: "1.5rem",
                  boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
                }}
              >
                <CustomMap 
                  latitude={position?.latitude} 
                  longitude={position?.longitude}
                  accuracy={position?.accuracy}
                  city={position?.city}
                  region={position?.region}
                  country={position?.country}
                  offlineMode={offlineMode}
                  todayTimeEntries={todayTimeEntries}
                />
                {/* Show warning if accuracy is poor */}
                {position?.accuracy > 100 && (
                  <Typography color="error" sx={{ mt: 2, textAlign: 'center', fontWeight: 600 }}>
                    Location accuracy is low (±{Math.round(position.accuracy)} meters).<br/>
                    For best results, use a mobile device with GPS and enable high-accuracy location.
                  </Typography>
                )}
              </Box>
            )}
            
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
              >
                
              {!isManagerView &&  (
                <Button
                  ref={clockButtonRef}
                  variant="contained"
                  onClick={onTrackLocation}
                  sx={{
                    backgroundColor: "#85803c",
                    textTransform: "none",
                    fontSize: "16px",
                    borderRadius: "1rem",
                    padding: "12px 24px",
                    "&:hover": {
                      backgroundColor: "#6d5f32",
                    },
                    "&:disabled": {
                      backgroundColor: "#ccc",
                    },
                  }}
                  disabled={!position || isLocating}
                >
                  {isLocating
                    ? "Detecting Location..."
                    : isClockedIn
                    ? t("TimeLogin.clockOut")
                    : t("TimeLogin.clockin")}
                </Button>
              )}
              
             

             

          {/* Removed the following block:
          {showClockButton == "2" && (
  <p style={{ color: "red", fontWeight: "bold", marginTop: "1rem" }}>
    You already clocked out today, please try tomorrow.
  </p>
 )} */}
              
              <Typography sx={{ marginTop: "12px", fontSize: "14px", color: "#555",fontWeight:"600" }}>
  {t("TimeLogin.time")} : {new Date().toLocaleTimeString()}
</Typography>
              
              {/* Action buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {!position && !isLocating && (
                  <Button
                    variant="outlined"
                    onClick={onRetryLocation}
                    sx={{
                      color: "#85803c",
                      borderColor: "#85803c",
                      textTransform: "none",
                      fontSize: "14px",
                      borderRadius: "1rem",
                      "&:hover": {
                        borderColor: "#6d5f32",
                        backgroundColor: "rgba(133, 128, 60, 0.04)",
                      },
                    }}
                  >
                    🔄 {t("TimeLogin.RetryLocation")}
                  </Button>
                )}
                
                {!position && !isLocating && (
                  <Button
                    variant="outlined"
                    onClick={() => setShowManualEntry(true)}
                    sx={{
                      color: "#85803c",
                      borderColor: "#85803c",
                      textTransform: "none",
                      fontSize: "14px",
                      borderRadius: "1rem",
                      "&:hover": {
                        borderColor: "#6d5f32",
                        backgroundColor: "rgba(133, 128, 60, 0.04)",
                      },
                    }}
                  >
                    📍{t("TimeLogin.ManualLocation")}
                  </Button>
                )}
              </Box>
            </Box>
            
            {/* Manual Location Entry Dialog */}
            {showManualEntry && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                onClick={() => setShowManualEntry(false)}
              >
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    padding: "30px",
                    borderRadius: "15px",
                    width: isMobile ? "90%" : "400px",
                    maxWidth: "500px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    {t("TimeLogin.manuallyLocation")}
                  </Typography>
                  
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <TextField
                      label={t("TimeLogin.textLabel.Latitude")}
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      placeholder="e.g., 40.7128"
                      type="number"
                      inputProps={{ step: "any" }}
                      fullWidth
                    />
                    <TextField
                       label={t("TimeLogin.textLabel.Logitude")}
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      placeholder="e.g., -74.0060"
                      type="number"
                      inputProps={{ step: "any" }}
                      fullWidth
                    />
                    
                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
                      <Button
                        variant="outlined"
                        onClick={() => setShowManualEntry(false)}
                        sx={{ textTransform: "none" }}
                      >
                        {t("TimeLogin.Cancel")}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleManualSubmit}
                        sx={{
                          backgroundColor: "#85803c",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#6d5f32",
                          },
                        }}
                      >
                        {t("TimeLogin.setLocation")}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            
            {/* Status Messages */}
            {!position && !isLocating && !error && (
              <Typography 
                sx={{ 
                  marginTop: "15px", 
                  textAlign: "center",
                  color: "#666",
                  fontSize: isMobile ? "14px" : "16px"
                }}
              >
                📍 {t("TimeLogin.waitingError")}
              </Typography>
            )}
            
            {error && (
              <Box
                sx={{
                  marginTop: "15px",
                  padding: "15px",
                  backgroundColor: "#fff3e0",
                  borderRadius: "10px",
                  border: "1px solid #ffb74d",
                }}
              >
                <Typography 
                  sx={{ 
                    textAlign: "center",
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "500",
                    color: "#f57c00",
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}
            
            {/* {position && !isLocating && (
              <Box
                sx={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#f1f8e9",
                  borderRadius: "10px",
                  border: "1px solid #aed581",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#4caf50",
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "500",
                  }}
                >
                  ✅ Location ready for clock in/out
                </Typography>
                
                {position.city && (
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#666",
                      fontSize: isMobile ? "12px" : "14px",
                      marginTop: "5px",
                    }}
                  >
                    📍 {position.city}, {position.region}
                  </Typography>
                )}
              </Box>
            )} */}
          </>
        )}
      </Box>
    </Box>
  );
};