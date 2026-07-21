import { Box, Typography } from "@mui/material";
import React from "react";
import PdfHeader from "./Header";
import PdfFooter from "./Footer";

const Page4 = ({ candidateData }) => {
  const grossSalary = candidateData?.grossSalary ? `INR ${candidateData.grossSalary}/-` : "INR SALARY AMOUNT/-";

  // Function to bold specific words in text
  const boldSpecificWords = (text) => {
    const wordsToBold = [
      "Grameena Vikas Kendram Society for Rural Development",
      "confidential information",
      "penal actions",
      "financial compensation",
      "fraud or misconduct",
      "legal action",
      "Non-Competition and Confidentiality",
      "solicit employment",
      grossSalary
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

  const section4 = [
    {
      heading: "",
      content: `I, ${candidateData?.employeeName || "EMPLOYEE NAME"}, agree that`,
      bullet: "false",
    },
    {
      heading: "",
      content: `If I leave my job based on personal or professional reasons or am terminated from service in the context of misconduct, the undisbursed incentive will have lapsed`,
      bullet: "true",
    },
    {
      heading: "",
      content: `As an employee, I will have access to confidential information that is the property of the organization. I am not permitted to disclose this information outside of the organization. Violation of this condition will attract penal actions and financial compensation deemed by the organization.`,
      bullet: "true",
    },
    {
      heading: "",
      content: `I compensate for any loss or damage caused to the material or non-material assets of the organization caused by me directly or indirectly.`,
      bullet: "true",
    },
    {
      heading: "",
      content: `I return any property of Grameena Vikas Kendram Society for Rural Development at the time of termination.`,
      bullet: "true",
    },
    {
      heading: "",
      content: `I demonstrate the highest financial and non-financial integrity. If I commit fraud or misconduct that will affect the organization, the organization can take legal action`,
      bullet: "true",
    },
    {
      heading: "Non-Competition and Confidentiality",
      content: ``,
      bullet: "false",
    },
    {
      heading: "",
      content: `During my time of employment with the organization, I will not disclose information or engage in any work for another organization that is related to or in competition with the organization.`,
      bullet: "true",
    },
    {
      heading: "",
      content: `It is further acknowledged that upon the termination of my employment, I will not solicit employment or business from any of the competitors who are involved in related business for a period of at least 5 years from the date of termination of employment. If I do so, I agree that I am liable to pay a compensation of at least ${grossSalary} (in words:) besides legal actions.`,
      bullet: "true",
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

        <Box>
          <Typography
            fontWeight="bold"
            sx={{
              color: "#365f91",
              fontSize: "1.5rem",
              marginLeft: "1.5rem",
              marginBottom: "1rem",
            }}
            gutterBottom
          >
            Annex 1: Terms and Conditions
          </Typography>

          {section4.map((section, index) => (
            <Box key={index} sx={{ marginBottom: "0.5rem" }}>
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
                    sx={{ fontSize: "1rem" }}
                    gutterBottom
                  >
                    {section.heading}
                  </Typography>
                </Box>
              )}

              {section.bullet === "true" ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
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
                      marginTop: "0.5rem",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                      textAlign: "justify",
                    }}
                    component="div"
                  >
                    {boldSpecificWords(section.content)}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    marginLeft: "1.5rem",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                  component="div"
                >
                  {boldSpecificWords(section.content)}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Typography
          fontWeight="bold"
          sx={{
            fontSize: "0.9rem",
            margin: "2rem 1.5rem 1rem",
            lineHeight: "1.5",
            textAlign: "justify",
          }}
        >
          Note: All the above-stated terms and conditions are explained to me both in english and telugu, and, I have understood every term and condition thoroughly before signing this employment agreement.
        </Typography>
      </Box>

      <PdfFooter sx={{ marginTop: "1rem" }} />
    </Box>
  );
};

export default Page4;