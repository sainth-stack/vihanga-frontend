import { Box, Typography } from "@mui/material";
import React from "react";
import PdfHeader from "./Header";
import PdfFooter from "./Footer";

const Page2 = ({ candidateData }) => {
  // Extract data from candidateData or provide defaults
  const employeeName = candidateData?.candidateName || "Employee Name";
  const noticePeriod = candidateData?.noticePeriod 
    ? `${candidateData.noticePeriod} days` 
    : "1 month";
  const salary = candidateData?.grossSalary 
    ? `₹${candidateData.grossSalary.toLocaleString('en-IN')}` 
    : "XXXXX";
  const penaltyAmount = candidateData?.grossSalary 
    ? `₹${(candidateData.grossSalary * 2).toLocaleString('en-IN')}` 
    : "2 Months of your salary";

  // Function to bold specific words in text
  const boldSpecificWords = (text) => {
    const wordsToBold = [
      "Grameena Vikas Kendram Society for Rural Development",
      noticePeriod,
      penaltyAmount,
      employeeName,
      salary,
      "termination of employment",
      "legal actions",
      "regenerative and circular agricultural supply chains",
      "small and marginal farmers",
      "Meenal S Machan",
      "Chief Executive Officer (CEO)"
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

  const finalContent = `If you wish to take any planned/unplanned leaves during the ${noticePeriod} notice period those days will be added
to the notice period. Any deviation from this shall attract severe consequences and all your
payments will be kept on hold/eliminated and no final settlement will be made. Should you wish to
leave without complying with the terms and conditions around the notice period, you will be
obliged to pay ${penaltyAmount} to the organization.

Discrimination, abuse in any form, financial fraud and any acts of employees that potentially
compromise the reputation of Grameena Vikas Kendram Society for Rural Development will lead
to severe and immediate consequences such as, but not limited to, termination of employment
besides appropriate legal actions.

Please indicate your acceptance of this offer by signing one copy of this letter. The additional copy
is for your file. We look forward to having you join our team to build regenerative and circular
agricultural supply chains that optimise value for small and marginal farmers. Should you have any
questions, please don't hesitate to contact me.

Best regards!

Meenal S Machan,
Chief Executive Officer (CEO)

Employee Name: ${employeeName}
Date: ${new Date().toLocaleDateString()}
Place: ${candidateData?.location || "Location"}`;

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

        <Box sx={{ 
          margin: "0 1.5rem",
          paddingTop: "1rem"
        }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: "1.5",
              textAlign: "left",
              whiteSpace: "pre-line"
            }}
            component="div"
          >
            {boldSpecificWords(finalContent)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        marginTop: "2rem",
        marginLeft: "1.5rem",
        marginBottom: "1rem"
      }}>
        <PdfFooter />
      </Box>
    </Box>
  );
};

export default Page2;