import { Box, Typography } from "@mui/material";
import React from "react";
import PdfHeader from "./Header";
import PdfFooter from "./Footer";

const Page3 = ({ candidateData }) => {
  // Function to bold specific words in text
  const boldSpecificWords = (text) => {
    const wordsToBold = [
      "Government of India",
      "District Court of Visakhapatnam",
      "independent legal advice"
    ];

    let result = [];
    let remainingText = text;

    while (remainingText.length > 0) {
      let earliestMatch = null;
      let earliestIndex = Infinity;

      wordsToBold.forEach(word => {
        const index = remainingText.indexOf(word);
        if (index >= 0 && index < earliestIndex) {
          earliestIndex = index;
          earliestMatch = word;
        }
      });

      if (earliestMatch) {
        if (earliestIndex > 0) {
          result.push(
            <Box component="span" key={`text-${result.length}`}>
              {remainingText.substring(0, earliestIndex)}
            </Box>
          );
        }

        result.push(
          <Box component="span" fontWeight="bold" key={`bold-${result.length}`}>
            {earliestMatch}
          </Box>
        );

        remainingText = remainingText.substring(earliestIndex + earliestMatch.length);
      } else {
        result.push(
          <Box component="span" key={`text-end-${result.length}`}>
            {remainingText}
          </Box>
        );
        remainingText = '';
      }
    }

    return result;
  };

  const sections3 = [
    {
      heading: "Laws",
      content:
        "This agreement shall be governed by the laws of the Government of India and all the legal issues will be resolved in the District Court of Visakhapatnam or any other court chosen by the organization only.",
    },
    {
      heading: "Independent Legal Advice",
      content:
        "The employee acknowledges that the organization has provided the employee with a reasonable opportunity to obtain independent legal advice with respect to this agreement and that either: (a) The employee has had such independent legal advice prior to executing this agreement, or; (b) The employee has willingly chosen not to obtain such advice and to execute this agreement without having obtained such advice.",
    },
    {
      heading: "",
      content:
        "We welcome you and look forward to receiving your acceptance and to working with you.",
    },
  ];
  
  const BestRegardsSection = [
    {
      name: "Meenal S Machan",
      title: "Chief Executive Officer",
    },
    {
      name: candidateData?.employeeName || "EMPLOYEE NAME",
      title: `Date: ${candidateData?.agreementDate || "DATE"}\nPlace: Visakhapatnam`,
    },
  ];
  
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "29.7cm",
        maxHeight: "29.7cm",
        width: "21cm",
        padding: "1cm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        "@page": {
          size: "A4",
          margin: "0",
        },
      }}
    >
      <Box>
        <PdfHeader />

        <Box sx={{ margin: "1rem 0" }}>
          {sections3.map((section, index) => (
            <Box key={index} sx={{ marginBottom: "0.8rem" }}>
              {section.heading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginLeft: "1.5rem",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "black",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      display: "inline-block",
                      fontSize: "1rem",
                    }}
                  >
                    {section.heading}
                  </Typography>
                </Box>
              )}
              <Typography
                sx={{
                  margin: "0.5rem 1.5rem",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  textAlign: "justify",
                }}
                component="div"
              >
                {boldSpecificWords(section.content)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            margin: "1rem 0 3rem 1.5rem",
            fontSize: "1rem",
          }}
        >
          Best Regards
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
            gap: "2rem",
            margin: "0 1.5rem",
          }}
        >
          {BestRegardsSection.map((footer, index) => (
            <Box key={index} sx={{ textAlign: "center", flex: 1 }}>
              <PdfFooter displayAddress={false} />
              <Typography variant="body1" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                {footer.name}
              </Typography>
              {footer.title.split("\n").map((line, idx) => (
                <Typography key={idx} variant="body1" sx={{ fontSize: "0.9rem" }}>
                  {line}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <PdfFooter sx={{ marginTop: "1rem" }} />
    </Box>
  );
};

export default Page3;