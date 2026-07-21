import React from 'react';
import { Typography, Link } from '@mui/material';

/**
 * Utility function to render text with clickable links
 * @param {string} text - The text that may contain URLs
 * @param {object} textStyles - MUI sx styles for the text
 * @returns {JSX.Element} - React element with clickable links
 */
export const renderTextWithLinks = (text, textStyles = {}) => {
  if (!text) return null;

  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split text by URLs
  const parts = text.split(urlRegex);
  
  return (
    <Typography sx={textStyles}>
      {parts.map((part, index) => {
        // Check if this part is a URL
        if (urlRegex.test(part)) {
          return (
            <Link
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#1976d2',
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {part}
            </Link>
          );
        }
        // Regular text
        return part;
      })}
    </Typography>
  );
};

/**
 * Alternative function that returns an array of React elements for more complex layouts
 * @param {string} text - The text that may contain URLs
 * @returns {Array} - Array of React elements
 */
export const parseTextWithLinks = (text) => {
  if (!text) return [];

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <Link
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#1976d2',
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
};
