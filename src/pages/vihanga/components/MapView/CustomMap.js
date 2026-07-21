import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";

const GOOGLE_MAPS_API_KEY = "AIzaSyBMX6skTdH9I1c7cLGSMKczxcjruYoRz8E";

const CustomMap = ({ latitude, longitude, offlineMode = false, accuracy, todayTimeEntries = [], bundledTilesBaseUrl = null, city, region, country }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px

  const mapRef = useRef(null); // for DOM reference
  const googleMapRef = useRef(null); // store Google Map instance
  const markerRef = useRef(null); // store current location marker instance
  const accuracyCircleRef = useRef(null); // store accuracy circle instance
  const timeEntryMarkersRef = useRef([]); // store time entry markers
  const infoWindowRef = useRef(null); // store info window instance
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [tilesCached, setTilesCached] = useState(true);
  const isInitializingRef = useRef(false);
  const lastMobileUpdateRef = useRef(0);
  const lastMobileMarkersUpdateRef = useRef(0);

  // Load Google Maps script
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      // Wait for it to load
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsGoogleMapsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleMapsLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps");
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts before load
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript && existingScript === script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    // Initialize ONLY once. On mobile, GPS/props can change frequently and cause a "reload loop"
    if (!isGoogleMapsLoaded || !mapRef.current || !latitude || !longitude || isInitializingRef.current) return;
    if (googleMapRef.current) return;

    // Prevent concurrent initializations
    isInitializingRef.current = true;

    // Ensure coordinates are valid numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates:', { latitude, longitude });
      isInitializingRef.current = false;
      return;
    }

    try {
      // Initialize Google Map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 18,
        minZoom: 3,
        maxZoom: 20,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_RIGHT,
        },
      });
      googleMapRef.current = map;

      // Create info window for current location marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; border-radius: 8px; text-align: center;">
            <b>Your Location</b><br/>
            <b>Latitude:</b> ${lat.toFixed(6)}<br/>
            <b>Longitude:</b> ${lng.toFixed(6)}
          </div>
        `,
      });
      infoWindowRef.current = infoWindow;

      // Add current location marker
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: "Your Location",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
      markerRef.current = marker;

      // Open info window on marker click
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Open info window initially
      infoWindow.open(map, marker);

      // Create accuracy circle if accuracy is provided
      if (typeof accuracy === 'number' && !isNaN(accuracy) && accuracy > 0) {
        const circle = new window.google.maps.Circle({
          strokeColor: '#1976d2',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#1976d2',
          fillOpacity: 0.18,
          map: map,
          center: { lat, lng },
          radius: accuracy,
        });
        accuracyCircleRef.current = circle;
      }

      // Add Wxmarkers for today's time entries
      const entryMarkers = [];
      todayTimeEntries.forEach((entry) => {
        if (entry.distanceTraveled) {
          const { clockInCoordinates, clockOutCoordinates } = entry.distanceTraveled;
          
          // Clock In marker
          if (clockInCoordinates && clockInCoordinates.latitude && clockInCoordinates.longitude) {
            const clockInMarker = new window.google.maps.Marker({
              position: {
                lat: clockInCoordinates.latitude,
                lng: clockInCoordinates.longitude,
              },
              map: map,
              title: "Clock In",
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: '#4CAF50',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              },
              label: {
                text: '🕐',
                fontSize: '16px',
              },
            });

            const clockInInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; border-radius: 8px; text-align: center;">
                  <b style="color: #4CAF50;">Clock In</b><br/>
                  <b>Employee:</b> ${entry.employeeInfo?.name || 'Unknown'}<br/>
                  <b>Time In:</b> ${entry.timeIn || 'N/A'}<br/>
                  <b>Date:</b> ${entry.dateString || 'N/A'}<br/>
                  <b>Location:</b> ${clockInCoordinates.latitude.toFixed(6)}, ${clockInCoordinates.longitude.toFixed(6)}
                </div>
              `,
            });

            clockInMarker.addListener("click", () => {
              clockInInfoWindow.open(map, clockInMarker);
            });

            entryMarkers.push(clockInMarker);
          }

          // Clock Out marker
          if (clockOutCoordinates && clockOutCoordinates.latitude && clockOutCoordinates.longitude && entry.timeOut) {
            const clockOutMarker = new window.google.maps.Marker({
              position: {
                lat: clockOutCoordinates.latitude,
                lng: clockOutCoordinates.longitude,
              },
              map: map,
              title: "Clock Out",
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: '#F44336',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
              },
              label: {
                text: '🕛',
                fontSize: '16px',
              },
            });

            const clockOutInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; border-radius: 8px; text-align: center;">
                  <b style="color: #F44336;">Clock Out</b><br/>
                  <b>Employee:</b> ${entry.employeeInfo?.name || 'Unknown'}<br/>
                  <b>Time Out:</b> ${entry.timeOut}<br/>
                  <b>Date:</b> ${entry.dateString || 'N/A'}<br/>
                  <b>Location:</b> ${clockOutCoordinates.latitude.toFixed(6)}, ${clockOutCoordinates.longitude.toFixed(6)}
                </div>
              `,
            });

            clockOutMarker.addListener("click", () => {
              clockOutInfoWindow.open(map, clockOutMarker);
            });

            entryMarkers.push(clockOutMarker);
          }
        }
      });
      timeEntryMarkersRef.current = entryMarkers;

      // Fit bounds to show all markers if there are time entries
      if (entryMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat, lng }); // Add current location
        entryMarkers.forEach(marker => {
          bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(map, "bounds_changed", () => {
          if (map.getZoom() > 18) map.setZoom(18);
          window.google.maps.event.removeListener(listener);
        });
      }

      // Map initialization complete
      isInitializingRef.current = false;
    } catch (error) {
      console.error('Error initializing Google Map:', error);
      isInitializingRef.current = false;
    }

    // Cleanup on unmount
    return () => {
      isInitializingRef.current = false;
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setMap(null);
        accuracyCircleRef.current = null;
      }
      timeEntryMarkersRef.current.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      timeEntryMarkersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, [isGoogleMapsLoaded, accuracy, latitude, longitude, todayTimeEntries]); // Initialize once (guarded by googleMapRef) - deps for hook lint

  // Update map position and accuracy when coordinates change
  useEffect(() => {
    if (googleMapRef.current && latitude && longitude && !isInitializingRef.current && isGoogleMapsLoaded) {
      // On mobile, throttle updates to once every 10 seconds to avoid constant re-render / "loading" feel
      if (isMobile) {
        const now = Date.now();
        if (now - lastMobileUpdateRef.current < 10000) return;
        lastMobileUpdateRef.current = now;
      }
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        try {
          // Update map center
          googleMapRef.current.setCenter({ lat, lng });
          
          // Update marker position
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
            // Update info window content
            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(`
                <div style="padding: 10px; border-radius: 8px; text-align: center;">
                  <b>Your Location</b><br/>
                  <b>Latitude:</b> ${lat.toFixed(6)}<br/>
                  <b>Longitude:</b> ${lng.toFixed(6)}
                </div>
              `);
            }
          }
          
          // Update accuracy circle
          if (typeof accuracy === 'number' && !isNaN(accuracy) && accuracy > 0) {
            if (!accuracyCircleRef.current) {
              accuracyCircleRef.current = new window.google.maps.Circle({
                strokeColor: '#1976d2',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#1976d2',
                fillOpacity: 0.18,
                map: googleMapRef.current,
                center: { lat, lng },
                radius: accuracy,
              });
            } else {
              accuracyCircleRef.current.setCenter({ lat, lng });
              accuracyCircleRef.current.setRadius(accuracy);
            }
          } else if (accuracyCircleRef.current) {
            // Remove circle if accuracy is not available
            accuracyCircleRef.current.setMap(null);
            accuracyCircleRef.current = null;
          }
        } catch (error) {
          console.warn('Error updating Google Map view:', error);
        }
      }
    }
  }, [latitude, longitude, accuracy, isGoogleMapsLoaded, isMobile]);

  // Update time entry markers when they change (throttled on mobile)
  useEffect(() => {
    if (!isGoogleMapsLoaded || !googleMapRef.current || isInitializingRef.current) return;
    if (isMobile) {
      const now = Date.now();
      if (now - lastMobileMarkersUpdateRef.current < 10000) return;
      lastMobileMarkersUpdateRef.current = now;
    }

    // Clear existing time entry markers
    timeEntryMarkersRef.current.forEach((marker) => {
      if (marker) marker.setMap(null);
    });
    timeEntryMarkersRef.current = [];

    const map = googleMapRef.current;
    const entryMarkers = [];

    (todayTimeEntries || []).forEach((entry) => {
      if (entry.distanceTraveled) {
        const { clockInCoordinates, clockOutCoordinates } = entry.distanceTraveled;

        // Clock In marker
        if (clockInCoordinates && clockInCoordinates.latitude && clockInCoordinates.longitude) {
          const clockInMarker = new window.google.maps.Marker({
            position: {
              lat: clockInCoordinates.latitude,
              lng: clockInCoordinates.longitude,
            },
            map: map,
            title: "Clock In",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: '#4CAF50',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            label: {
              text: '🕐',
              fontSize: '16px',
            },
          });

          const clockInInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; border-radius: 8px; text-align: center;">
                <b style="color: #4CAF50;">Clock In</b><br/>
                <b>Employee:</b> ${entry.employeeInfo?.name || 'Unknown'}<br/>
                <b>Time In:</b> ${entry.timeIn || 'N/A'}<br/>
                <b>Date:</b> ${entry.dateString || 'N/A'}<br/>
                <b>Location:</b> ${clockInCoordinates.latitude.toFixed(6)}, ${clockInCoordinates.longitude.toFixed(6)}
              </div>
            `,
          });

          clockInMarker.addListener("click", () => {
            clockInInfoWindow.open(map, clockInMarker);
          });

          entryMarkers.push(clockInMarker);
        }

        // Clock Out marker
        if (clockOutCoordinates && clockOutCoordinates.latitude && clockOutCoordinates.longitude && entry.timeOut) {
          const clockOutMarker = new window.google.maps.Marker({
            position: {
              lat: clockOutCoordinates.latitude,
              lng: clockOutCoordinates.longitude,
            },
            map: map,
            title: "Clock Out",
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 15,
              fillColor: '#F44336',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
            label: {
              text: '🕛',
              fontSize: '16px',
            },
          });

          const clockOutInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; border-radius: 8px; text-align: center;">
                <b style="color: #F44336;">Clock Out</b><br/>
                <b>Employee:</b> ${entry.employeeInfo?.name || 'Unknown'}<br/>
                <b>Time Out:</b> ${entry.timeOut}<br/>
                <b>Date:</b> ${entry.dateString || 'N/A'}<br/>
                <b>Location:</b> ${clockOutCoordinates.latitude.toFixed(6)}, ${clockOutCoordinates.longitude.toFixed(6)}
              </div>
            `,
          });

          clockOutMarker.addListener("click", () => {
            clockOutInfoWindow.open(map, clockOutMarker);
          });

          entryMarkers.push(clockOutMarker);
        }
      }
    });

    timeEntryMarkersRef.current = entryMarkers;
  }, [todayTimeEntries, isGoogleMapsLoaded, isMobile]);

  useEffect(() => {
    if (offlineMode) {
      setTilesCached(!!bundledTilesBaseUrl);
    } else {
      setTilesCached(true);
    }
  }, [offlineMode, bundledTilesBaseUrl]);

  return (
    <Box
      sx={{
        padding: isMobile ? ".3px" : ".1rem",
        position: 'relative',
      }}
    >
      <Box
        id="map"
        ref={mapRef}
        sx={{
          height: { xs: 350, md: 450 },
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          position: 'relative',
          border: '2px solid #1976d2',
        }}
      />
      {/* Show accuracy label if available */}
      {typeof accuracy === 'number' && !isNaN(accuracy) && accuracy > 0 && (
        <Paper elevation={2} sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          bgcolor: '#fff',
          color: '#1976d2',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          fontWeight: 600,
          fontSize: 15,
          zIndex: 20,
        }}>
          Accuracy: ±{Math.round(accuracy)} meters
        </Paper>
      )}
      
      {/* Show legend for time entry markers if there are any */}
      {todayTimeEntries && todayTimeEntries.length > 0 && (
        <Paper elevation={3} sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          bgcolor: '#fff',
          px: 2,
          py: 1.5,
          borderRadius: 2,
          zIndex: 20,
        }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Today's Time Entries
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              bgcolor: '#4CAF50', 
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}>🕐</Box>
            <Typography variant="caption">Clock In</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              bgcolor: '#F44336', 
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}>🕛</Box>
            <Typography variant="caption">Clock Out</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 20, 
              height: 20, 
              borderRadius: '50%', 
              bgcolor: '#1976d2', 
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}>📍</Box>
            <Typography variant="caption">Current Location</Typography>
          </Box>
        </Paper>
      )}
      
      {offlineMode && !tilesCached && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(255,255,255,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          zIndex: 10,
        }}>
          <Typography sx={{ color: '#FFA000', fontWeight: 600, fontSize: 18, textAlign: 'center' }}>
            Map is unavailable offline. Please connect to the internet to view the map.
          </Typography>
        </Box>
      )}

      {!isGoogleMapsLoaded && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          zIndex: 10,
        }}>
          <Typography sx={{ color: '#1976d2', fontWeight: 600, fontSize: 16, textAlign: 'center' }}>
            Loading Google Maps...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CustomMap;

