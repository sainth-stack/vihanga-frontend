export function getTotalTrackedTime(data = []) {
    // Parse "HH:MM:SS" to total seconds
    function parseDurationToSeconds(durationStr) {
      if (typeof durationStr !== 'string' || !durationStr.includes(':')) return 0;
      const [h, m, s] = durationStr.split(':').map(Number);
      return (h * 3600) + (m * 60) + (s || 0);
    }
  
    // Format total seconds to "HH:MM:SS"
    function formatSecondsToHHMMSS(totalSeconds) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
  
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  
    // Sum only valid "HH:MM:SS" values
    const totalSeconds = data.reduce((sum, entry) => {
      return sum + parseDurationToSeconds(entry.hours);
    }, 0);
  
    return formatSecondsToHHMMSS(totalSeconds);
  }

  /**
   * Calculate hours between clock in and clock out times
   * @param {string} timeIn - Time in format HH:mm or HH:mm:ss
   * @param {string} timeOut - Time out format HH:mm or HH:mm:ss
   * @returns {string} Formatted hours string (e.g., "8hr 30m")
   */
  export function calculateHours(timeIn, timeOut) {
    if (!timeIn || !timeOut) return "0hr 0m";
    
    // Handle time formats: HH:mm or HH:mm:ss
    const formatTime = (time) => {
      if (!time) return null;
      // If already in HH:mm format, add :00 for seconds
      if (time.length === 5) {
        return `${time}:00`;
      }
      return time;
    };
    
    const formattedTimeIn = formatTime(timeIn);
    const formattedTimeOut = formatTime(timeOut);
    
    if (!formattedTimeIn || !formattedTimeOut) return "0hr 0m";
    
    try {
      const timeInDate = new Date(`2000-01-01 ${formattedTimeIn}`);
      const timeOutDate = new Date(`2000-01-01 ${formattedTimeOut}`);
      let diff = timeOutDate - timeInDate;
      
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000; // Handle overnight shifts
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}hr ${minutes}m`;
    } catch (err) {
      console.error("Error calculating hours:", err);
      return "0hr 0m";
    }
  }

  const currentDate = new Date();
  export  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  