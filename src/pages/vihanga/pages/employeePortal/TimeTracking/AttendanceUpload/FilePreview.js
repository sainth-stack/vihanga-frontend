import React from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTranslation } from 'react-i18next';

const FilePreview = ({ data, fileName }) => {
  const { t } = useTranslation();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Get top 10 records
  const previewData = data.slice(0, 10);
  
  // Get all unique keys from the data to create table headers
  const allKeys = new Set();
  previewData.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key));
  });
  const headers = Array.from(allKeys);

  // Function to format Excel date serial number to readable date
  const formatDateValue = (value, headerName) => {
    // Check if header name suggests it's a date column
    const isDateColumn = headerName && /date/i.test(headerName);
    
    if (!isDateColumn) {
      // Not a date column, return as is
      return value !== null && value !== undefined ? String(value) : '-';
    }
    
    // If value is already a formatted date string, preserve it exactly as is
    // This is the most important check - preserve original format to avoid month/day swaps
    if (typeof value === 'string' && value.trim()) {
      const trimmedValue = value.trim();
      // Check if it matches common date formats (DD-MM-YYYY, MM-DD-YYYY, YYYY-MM-DD, etc.)
      const datePattern = /^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$|^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/;
      if (datePattern.test(trimmedValue)) {
        // Return the original string exactly as it is - don't parse or reformat
        // This prevents month/day swapping issues
        return trimmedValue;
      }
      // Also check for dates with spaces or other formats
      const datePattern2 = /^\d{1,2}\s+[A-Za-z]+\s+\d{4}$/i; // e.g., "12 August 2025"
      if (datePattern2.test(trimmedValue)) {
        return trimmedValue;
      }
    }
    
    // Only convert if value is a pure number (Excel serial number)
    // Important: Don't convert strings that look like dates (e.g., "12-08-2025")
    // Only convert actual numeric values that Excel uses as serial numbers
    const isPureNumber = typeof value === 'number';
    
    // Also check if it's a string that's purely numeric (no dashes, slashes, or other date characters)
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // If it contains date separators, it's already a formatted date - don't convert
      if (trimmed.includes('-') || trimmed.includes('/') || trimmed.includes(' ')) {
        // It's a date string, return as is
        return trimmed;
      }
    }
    
    if (isPureNumber) {
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      
      if (Number.isFinite(numValue) && numValue > 0 && numValue < 1000000) {
        try {
          // Excel date conversion:
          // Excel epoch: January 1, 1900 (serial number 1)
          // JavaScript epoch: January 1, 1970
          // Excel incorrectly treats 1900 as a leap year, so the offset is 25569
          // Use UTC to avoid timezone issues that cause day shifts
          const excelEpochOffset = 25569; // Days between 1900-01-01 and 1970-01-01
          const millisecondsPerDay = 86400000;
          const jsDate = new Date((numValue - excelEpochOffset) * millisecondsPerDay);
          
          // Use UTC methods to avoid timezone shifts
          const year = jsDate.getUTCFullYear();
          const month = jsDate.getUTCMonth() + 1;
          const day = jsDate.getUTCDate();
          
          // Check if the date is valid and reasonable (between 1900 and 2100)
          if (!isNaN(jsDate.getTime()) && year >= 1900 && year <= 2100) {
            // Format as DD-MM-YYYY (preserve the format that seems to be used)
            return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
          }
        } catch (e) {
          // If conversion fails, return original value
        }
      }
    }
    
    // Return original value if not a date or conversion failed
    return value !== null && value !== undefined ? String(value) : '-';
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          borderRadius: "8px",
          border: "1px solid #eee",
          backgroundColor: "#fafafa"
        }}
      >
        <Typography 
          variant="subtitle1" 
          fontWeight={600} 
          sx={{ mb: 2, color: 'rgb(153, 150, 94)' }}
        >
          {t("File Preview")} - {fileName}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          {t("Showing")} {previewData.length} {t("of")} {data.length} {t("records")}
        </Typography>
        
        <TableContainer 
          sx={{ 
            maxHeight: '280px', // Show approximately 3-4 rows initially
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgb(153, 150, 94)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgb(133, 130, 74)',
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      backgroundColor: 'rgb(153, 150, 94)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '14px',
                      padding: '5px 10px',
                      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                      whiteSpace: 'nowrap',
                      '&:last-child': {
                        borderRight: 'none'
                      }
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {previewData.map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: '#f9f9f9',
                    },
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                >
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontSize: '14px',
                        padding: '5px 10px',
                        borderRight: '1px solid #e0e0e0',
                        whiteSpace: 'nowrap',
                        '&:last-child': {
                          borderRight: 'none'
                        }
                      }}
                    >
                      {formatDateValue(row[header], header)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FilePreview;

