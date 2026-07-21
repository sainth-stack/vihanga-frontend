/**
 * Common utility functions for time tracking calculations
 * Used across WeeklyTime, AttendanceUpload, and TimeSheetHistory components
 */

/**
 * Parse time string in various formats (HH:MM:SS, HH.MM.SS, decimal, AM/PM)
 * @param {string|number} t - Time value to parse
 * @returns {{h: number, m: number, s: number}|null} - Parsed time object or null
 */
export const parseTime = (t) => {
  if (!t) return null;
  let timeStr = String(t).trim();
  let isPM = false;
  let isAM = false;
  
  // Handle AM/PM
  if (/am$/i.test(timeStr)) {
    isAM = true;
    timeStr = timeStr.replace(/am$/i, '').trim();
  } else if (/pm$/i.test(timeStr)) {
    isPM = true;
    timeStr = timeStr.replace(/pm$/i, '').trim();
  }
  
  // Accept both : and . as separators
  let parts = timeStr.includes(':') ? timeStr.split(':') : timeStr.split('.');
  parts = parts.map(Number);
  
  // If decimal hour (e.g., 14.19)
  if (parts.length === 1 && !isNaN(parts[0])) {
    const num = parts[0];
    const h = Math.floor(num);
    const m = Math.floor((num - h) * 60);
    const s = Math.round((((num - h) * 60) - m) * 60);
    return { h, m, s };
  }
  
  // If 2 or 3 parts (HH, MM, SS)
  if ((parts.length === 2 || parts.length === 3) && !parts.some(isNaN)) {
    let h = parts[0];
    let m = parts[1] || 0;
    let s = parts[2] || 0;
    // Convert to 24-hour format if AM/PM present
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
    return { h, m, s };
  }
  
  return null;
};

/**
 * Calculate hours between timeIn and timeOut
 * @param {string|number} timeIn - Time in value
 * @param {string|number} timeOut - Time out value
 * @param {string} format - Output format: 'decimal' (default) or 'formatted' (e.g., "9h 56m")
 * @returns {number|string|null} - Calculated hours in requested format, or null if invalid
 */
export const calculateHours = (timeIn, timeOut, format = 'decimal') => {
  if (!timeIn || !timeOut) return null;
  
  const inTime = parseTime(timeIn);
  const outTime = parseTime(timeOut);
  
  if (!inTime || !outTime) return null;
  
  // Calculate difference in seconds
  const inSeconds = inTime.h * 3600 + inTime.m * 60 + inTime.s;
  const outSeconds = outTime.h * 3600 + outTime.m * 60 + outTime.s;
  let diff = outSeconds - inSeconds;
  
  // Handle overnight shifts
  if (diff < 0) diff += 24 * 3600;
  
  if (format === 'formatted') {
    // Return formatted string like "9h 56m"
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  } else {
    // Return decimal hours rounded to 2 decimal places
    const hours = diff / 3600;
    return Number(hours.toFixed(2));
  }
};

/**
 * Calculate hours and return as formatted string (for display)
 * @param {string|number} timeIn - Time in value
 * @param {string|number} timeOut - Time out value
 * @returns {string|null} - Formatted hours string or null if invalid
 */
export const calculateHoursFormatted = (timeIn, timeOut) => {
  return calculateHours(timeIn, timeOut, 'formatted');
};

/**
 * Group time tracking entries by user and date, taking the latest entry per user/date
 * Accumulates all clock-in and clock-out times to find earliest timeIn and latest timeOut
 * Calculates total hours between earliest clock-in and latest clock-out
 * Ignores status (pending, approved, etc.)
 * @param {Array} entries - Array of time tracking entries
 * @returns {Array} - Grouped entries with accumulated timeIn/timeOut and calculated hours
 */
export const groupEntriesByUserAndDate = (entries) => {
  if (!entries || !Array.isArray(entries)) return [];
  
  // Helper function to normalize dateString to a consistent format for grouping
  const normalizeDateString = (dateStr) => {
    if (!dateStr) return '';
    try {
      // Try to parse the date string in various formats
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Return normalized format: YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (err) {
      // If parsing fails, return original string
    }
    return dateStr;
  };
  
  // First, group entries by user and date
  const entriesByKey = new Map();

  entries.forEach((entry) => {
    if (!entry) return; // Skip null/undefined entries
    
    // Normalize userId to string (handle ObjectId, string, or nested _id)
    let userId = entry?.userId;
    if (!userId) {
      userId = entry?.employeeInfo?._id || entry?.employeeInfo?.name || 'unknown';
    }
    // Convert to string to ensure consistent key generation
    userId = String(userId);
    
    // Normalize dateString to ensure same date formats group together
    const dateStr = entry?.dateString || '';
    const normalizedDate = normalizeDateString(dateStr);
    
    // Create unique key using normalized userId and dateString
    const key = `${userId}_${normalizedDate}`;

    if (!entriesByKey.has(key)) {
      entriesByKey.set(key, []);
    }
    entriesByKey.get(key).push(entry);
  });

  // Process each group to find latest entry and accumulate times
  const processedEntries = [];
  
  entriesByKey.forEach((entryList) => {
    if (!entryList || entryList.length === 0) return;
    
    // Sort entries by timestamp (most recent first) to get the latest entry
    entryList.sort((a, b) => {
      const timeA = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const timeB = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
      return timeB - timeA; // Descending order (latest first)
    });
    
    // Get the latest entry (will use its metadata)
    const latestEntry = entryList[0];
    if (!latestEntry) return;
    
    // Collect all timeIn and timeOut values from all entries for this user/date
    const allTimeIns = [];
    const allTimeOuts = [];
    
    entryList.forEach((entry) => {
      const timeIn = entry?.timeIn?.trim();
      const timeOut = entry?.timeOut?.trim();
      
      if (timeIn) {
        allTimeIns.push(timeIn);
      }
      if (timeOut) {
        allTimeOuts.push(timeOut);
      }
    });
    
    // Find earliest timeIn by comparing parsed times
    let earliestTimeIn = null;
    if (allTimeIns.length > 0) {
      const timesWithSeconds = allTimeIns
        .map(t => {
          if (!t) return null;
          try {
            const parsed = parseTime(t);
            if (parsed && parsed.h !== undefined && parsed.m !== undefined) {
              const seconds = (parsed.h || 0) * 3600 + (parsed.m || 0) * 60 + (parsed.s || 0);
              return { original: t, seconds };
            }
          } catch (err) {
            console.warn('Error parsing timeIn:', err);
          }
          return null;
        })
        .filter(Boolean);
      
      if (timesWithSeconds.length > 0) {
        timesWithSeconds.sort((a, b) => (a?.seconds || 0) - (b?.seconds || 0));
        earliestTimeIn = timesWithSeconds[0]?.original || null;
      } else {
        // Fallback: use first entry if parsing fails
        earliestTimeIn = allTimeIns[0] || null;
      }
    }
    
    // Find latest timeOut by comparing parsed times
    let latestTimeOut = null;
    if (allTimeOuts.length > 0) {
      const timesWithSeconds = allTimeOuts
        .map(t => {
          if (!t) return null;
          try {
            const parsed = parseTime(t);
            if (parsed && parsed.h !== undefined && parsed.m !== undefined) {
              const seconds = (parsed.h || 0) * 3600 + (parsed.m || 0) * 60 + (parsed.s || 0);
              return { original: t, seconds };
            }
          } catch (err) {
            console.warn('Error parsing timeOut:', err);
          }
          return null;
        })
        .filter(Boolean);
      
      if (timesWithSeconds.length > 0) {
        timesWithSeconds.sort((a, b) => (b?.seconds || 0) - (a?.seconds || 0));
        latestTimeOut = timesWithSeconds[0]?.original || null;
      } else {
        // Fallback: use first entry if parsing fails
        latestTimeOut = allTimeOuts[0] || null;
      }
    }
    
    // Calculate hours between earliest timeIn and latest timeOut
    let formattedHours = "0h 0m";
    if (earliestTimeIn && latestTimeOut) {
      try {
        const calculated = calculateHours(earliestTimeIn, latestTimeOut, 'formatted');
        if (calculated) {
          formattedHours = calculated;
        }
      } catch (err) {
        console.warn('Error calculating accumulated hours:', err);
        // Fallback to latest entry's hours if calculation fails
        formattedHours = latestEntry?.hours || "0h 0m";
      }
    } else if (latestEntry?.hours) {
      // Use latest entry's hours if we don't have both timeIn and timeOut
      formattedHours = latestEntry.hours;
    }
    
    // Use latest entry's data but with accumulated times and calculated hours
    processedEntries.push({
      ...latestEntry,
      timeIn: earliestTimeIn || latestEntry?.timeIn || '',
      timeOut: latestTimeOut || latestEntry?.timeOut || '',
      hours: formattedHours,
    });
  });

  return processedEntries;
};

