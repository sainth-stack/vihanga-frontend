import { Box, Typography } from "@mui/material";
import React from "react";
import PdfHeader from "./Header";
import PdfFooter from "./Footer";

const Page1 = ({ candidateData }) => {
  // Extract data from candidateData or provide defaults
  const employeeName = candidateData?.candidateName || "Employee Name";
  const doj = candidateData?.joiningDate 
    ? new Date(candidateData.joiningDate).toLocaleDateString() 
    : "Date of Joining";
  const position = candidateData?.designation || "Employee Position";
  const projectName = candidateData?.projectName || "Project Name";
  const location = candidateData?.location || "Location";
  const reportingManager = candidateData?.reportingManager?.name || "Reporting Manager";
  const salary = candidateData?.grossSalary 
    ? `₹${candidateData.grossSalary.toLocaleString('en-IN')}` 
    : "XXXXX";
  const probationPeriod = candidateData?.probationPeriod 
    ? `${candidateData.probationPeriod} days` 
    : "6 months";
  const noticePeriod = candidateData?.noticePeriod 
    ? `${candidateData.noticePeriod} days` 
    : "1 month";

  // Function to bold specific words in text
  const boldSpecificWords = (text) => {
    const wordsToBold = [
      "Grameena Vikas Kendram Society for Rural Development",
      "Visakhapatnam",
      employeeName,
      position,
      projectName,
      location,
      reportingManager,
      salary,
      probationPeriod,
      noticePeriod,
      "Earned and sick leave",
      "Travelling Allowance",
      "PAN card",
      "Aadhar Card",
      "Education Certificates",
      "Experience Certificates",
      "Relieving letter",
      "Pay slips",
      "driving license",
      "Bank Passbook",
      "probation",
      "notice period"
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

  const offerLetterContent = `Dear ${employeeName},

It is with great pleasure that we offer you the position of ${position} under the ${projectName}. You will be based in ${location} and will report to ${reportingManager}. Based on your credentials we believe that your contributions will benefit the Grameena Vikas Kendram Society for Rural Development and the community it supports. I am confident; our association will assist you in reaching your personal and professional goals.

Your compensation shall be ${salary}/- rupees only) CTC per annum. Your compensation includes Earned and sick leave and other benefits per the organization's policy. Travelling Allowance is applicable based on your mobility within the project area or travel involved for professional purposes. No other transportation expenses shall be covered by the organization (eg: commute from home to office). The detailed compensation plan shall be provided at the time of your joining.

The effective date of joining shall be from ${doj}, and we anticipate that you will accept this offer. Upon joining you will be required to sign an 'Appointment Letter'. You will also be required to submit the following documents on the date of your reporting at our head office in Visakhapatnam:

- Copy of PAN card
- Aadhar Card
- Two passport-sized photographs
- Education Certificates
- Copies of Experience Certificates
- Copy of the Relieving letter from the last employer
- Pay slips for the last 3 months
- Copy of driving license
- Bank Passbook first page

You will be on probation for ${probationPeriod} from the date of your joining. Your services shall be confirmed in writing after the successful completion of your probation period. The probation period may be extended if your performance does not meet expectations.

If for any reason you resign or wish to quit, you must serve at least ${noticePeriod} notice period, starting from the day you formally submit your resignation by letter/email. During the notice period, you will not be eligible to take any leaves.`;

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

        <Box sx={{ textAlign: "center", margin: "1rem 0" }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Employment Offer Letter
          </Typography>
          <Typography variant="body2" mb={2}>
            Date: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ margin: "0 1.5rem" }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: "1.5",
              textAlign: "left",
              whiteSpace: "pre-line"
            }}
            component="div"
          >
            {boldSpecificWords(offerLetterContent)}
          </Typography>
        </Box>
      </Box>

      <PdfFooter />
    </Box>
  );
};

export default Page1;