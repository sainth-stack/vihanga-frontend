import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export const toCamelCase = (str) => {
  // Handle null, undefined, or non-string inputs
  if (str == null || typeof str !== "string") {
    return str == null ? "" : String(str);
  }
  
  // Handle empty string
  if (str.trim().length === 0) {
    return "";
  }
  
  // First, handle camelCase by inserting spaces before capital letters
  // This converts "createdAt" to "created At" or "CreatedAt" to "Created At"
  let processed = str
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before capital letters (camelCase detection)
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"); // Handle consecutive capitals like "ID" followed by "Name"
  
  // Replace hyphens and underscores with spaces
  processed = processed.replace(/[\-_]/g, " ");
  
  // Split by spaces and filter out empty strings
  const words = processed
    .split(/\s+/) // Split by one or more spaces
    .map(word => word.trim())
    .filter(word => word.length > 0);
  
  // Handle case where no valid words found
  if (words.length === 0) {
    return "";
  }
  
  // Capitalize first letter of every word, lowercase the rest, and join with spaces
  return words
    .map((word) => {
      // Remove any non-word characters and get only alphanumeric characters
      const cleanWord = word.replace(/[^\w]/g, "");
      if (cleanWord.length === 0) return "";
      
      // Capitalize first letter, rest lowercase
      const lowerWord = cleanWord.toLowerCase();
      return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    })
    .filter(word => word.length > 0) // Remove any empty words
    .join(" "); // Join with spaces instead of no space
};

/**
 * Transforms an object's keys to camelCase
 * @param {Object} obj - The object to transform
 * @returns {Object} - New object with camelCase keys
 */
export const transformKeysToCamelCase = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  
  const transformed = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = toCamelCase(key);
      transformed[camelKey] = obj[key];
    }
  }
  return transformed;
};

/**
 * Transforms an array of objects' keys to camelCase
 * @param {Array} data - Array of objects to transform
 * @returns {Array} - New array with objects having camelCase keys
 */
export const transformDataKeysToCamelCase = (data) => {
  if (!Array.isArray(data)) return data;
  return data.map(item => transformKeysToCamelCase(item));
};

export const exportToCSV = (data) => {
  // Transform data keys to Title Case format (preserves spaces)
  const transformedData = transformDataKeysToCamelCase(data);
  
  if (!transformedData || transformedData.length === 0) {
    alert("No data to export");
    return;
  }
  
  // Get headers from the first object (they should already be in Title Case)
  const headers = Object.keys(transformedData[0]);
  
  // Create worksheet with proper headers
  const worksheet = XLSX.utils.json_to_sheet(transformedData);
  
  // Ensure headers are preserved (XLSX should handle this, but we'll verify)
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "export.csv");
};

export const exportToExcel = (data) => {
  // Transform data keys to Title Case format (preserves spaces)
  const transformedData = transformDataKeysToCamelCase(data);
  
  if (!transformedData || transformedData.length === 0) {
    alert("No data to export");
    return;
  }
  
  // Create worksheet - XLSX should preserve the keys as headers
  const worksheet = XLSX.utils.json_to_sheet(transformedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(blob, "export.xlsx");
};

export const exportToPDF = (data) => {
  // Transform data keys to Title Case format (preserves spaces)
  const transformedData = transformDataKeysToCamelCase(data);
  const doc = new jsPDF();

  // Set smaller font size for the title (default is 12, reducing by 4 makes it 8)
  doc.setFontSize(8);
//   doc.text("Exported Data", 14, 20);

  const headers = Object.keys(transformedData[0]);
  const body = transformedData.map((row) => headers.map((header) => row[header]));

  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 30,
    // Set smaller font size for the table (default is 10, reducing by 2 makes it 8)
    styles: {
      fontSize: 8,
    },
    // Optional: set smaller font size specifically for header
    headStyles: {
      fontSize: 8,
    },
    // Optional: set smaller font size specifically for body
    bodyStyles: {
      fontSize: 8,
    },
  });

  doc.save("export.pdf");
};
