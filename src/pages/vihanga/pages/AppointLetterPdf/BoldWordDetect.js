import { Box } from "@mui/material";
import React from "react";

// These are the keywords we want to bold regardless of their dynamic values
const staticBoldWords = [
  "Grameena Vikas Kendram Society for Rural Development",
  "Visakhapatnam",
  "Headquarters",
  "Reporting Manager",
  "Society ACT",
  "Villa No.61, Blue Marino, Chapaluppada, near INS Kalinga",
];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
}

export const renderContentWithBold = (text, candidateData = {}) => {
  if (!text) return null;

  // Extract dynamic values from candidateData with fallbacks
  const dynamicValues = {
    "EMPLOYEE NAME": candidateData?.candidateName || "EMPLOYEE NAME",
    "EMPLOYEE DOJ": candidateData?.joiningDate 
      ? new Date(candidateData.joiningDate).toLocaleDateString() 
      : "EMPLOYEE DOJ",
    "EMPLOYEE POSITION": candidateData?.designation || "EMPLOYEE POSITION",
    "WORK LOCATION": candidateData?.location?.split(",")[0] || "WORK LOCATION",
    "EMPLOYEE ADDRESS": candidateData?.location || "EMPLOYEE ADDRESS",
    "EMPLOYEE FATHER NAME": "[EMPLOYEE FATHER NAME]", // Not in the data, keep placeholder
  };

  // Combine static and dynamic patterns (only keys for dynamic values)
  const allPatterns = [
    ...staticBoldWords,
    ...Object.keys(dynamicValues).filter(k => k !== "EMPLOYEE FATHER NAME") // exclude this as we want to bold the placeholder
  ];

  const pattern = new RegExp(
    `(${allPatterns.map(escapeRegExp).join("|")})`,
    "gi"
  );

  const elements = [];
  let lastIndex = 0;
  let match;

  // Create a helper function to get the display text (dynamic or original)
  const getDisplayText = (matchedText) => {
    const upperMatched = matchedText.toUpperCase();
    return dynamicValues[upperMatched] || matchedText;
  };

  while ((match = pattern.exec(text)) !== null) {
    const [matchedText] = match;
    const matchIndex = match.index;

    // Push text before match
    if (lastIndex < matchIndex) {
      elements.push(
        <Box component="span" key={`text-${lastIndex}`}>
          {text.slice(lastIndex, matchIndex)}
        </Box>
      );
    }

    // Push bold matched text (with dynamic value replacement if needed)
    const displayText = getDisplayText(matchedText);
    elements.push(
      <Box component="span" fontWeight="bold" key={`bold-${matchIndex}`}>
        {displayText}
      </Box>
    );

    lastIndex = matchIndex + matchedText.length;
  }

  // Push remaining text after last match
  if (lastIndex < text.length) {
    elements.push(
      <Box component="span" key={`text-end`}>
        {text.slice(lastIndex)}
      </Box>
    );
  }

  return elements.length > 0 ? elements : text;
};