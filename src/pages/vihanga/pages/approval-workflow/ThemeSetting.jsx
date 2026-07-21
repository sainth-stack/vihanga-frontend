import React from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import { CloudUpload, Edit } from "@mui/icons-material";
import Header from "../board/components/Header";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import FileUpload from "../../components/filesUplode/draganddropFile";

const colors = {
  primary: {
    sectionTitle: "Primary Colors",
    colors: [
      {
        name: "Brown",
        code: "#B8955C",
        description:
          "The primary color is “Brown” color, and is used across all interactive elements such as buttons, links, inputs etc..",
      },
    ],
  },
  secondary: {
    sectionTitle: "Secondary Colors",
    colors: [
      {
        name: " Green",
        code: "#9DAA45",
        description:
          "The color is “Green” color, and is used across all interactive elements such as success and completed.",
      },
      {
        name: "Black",
        code: "#000000",
        description:
          "The color is “Black” color, and is used across Typography.",
      },
      {
        name: "Yellow",
        code: "#F5C521",
        description:
          "The color is “Yellow” color, and is used across Warning buttons.",
      },
      {
        name: "Red",
        code: "#E8502F",
        description: "The color is “Red” color, and is used across Alert.",
      },
      {
        name: "Green",
        code: "#9DAA45",
        description:
          "The color is “Green” color, and is used across Successful and completed.",
      },
      {
        name: "Grey",
        code: "#7B7B7B",
        description:
          "The color is “Grey” color, and is used across Icon and Stroke.",
      },
      {
        name: "White",
        code: "#FFFFFF",
        description:
          "The color is “White” color, and is used background color.",
      },
      {
        name: "Lite Grey",
        code: "#F5F5F5",
        description:
          "The color is “Grey” color, and is used across Icon and stroke.",
      },
    ],
  },
};

const ThemeSettings = () => {
  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 4,
        fontFamily: "Work Sans, sans-serif",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Work Sans",
          fontWeight: 600,
          fontSize: "32px",
          lineHeight: "100%",
          letterSpacing: "0%",

          mb: 3,
        }}
      >
        Tasks Overview
      </Typography>

      <Box mb={3}>
        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0%",
            mb: 0.5,
          }}
        >
          Theme Name
        </Typography>
        <InputTextComponent
          placeholder="Lorem Ipsum"
          sx={{
            maxWidth: "70%",
            fontFamily: "Work Sans",
          }}
        />
      </Box>

      <Box mb={4}>
        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0%",
            mb: -2,
          }}
        >
          Resume
        </Typography>
        <FileUpload
          id="resume-upload"
          sx={{
            maxWidth: "85%",
            marginLeft: "0px",
            fontFamily: "Work Sans",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: "-30px",
          marginLeft: "80px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "100%",
            letterSpacing: "0",
            color: "#555",
            mb: 0.5,
            marginLeft: "-10px",
          }}
        >
          Base Color
        </Typography>
        <Box
          sx={{
            width: "190px",
            height: "2px",
            backgroundColor: "#000000",
            marginLeft: "90px",
          }}
        />
      </Box>

      {[colors.primary, colors.secondary].map((section, index) => (
        <Box key={index} mb={4}>
          <Typography
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 600,
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0",

              marginBottom: "27px",
            }}
          >
            {section.sectionTitle}
          </Typography>

          {section.colors.map((color, idx) => (
            <Grid container spacing={2} alignItems="center" mb={3} key={idx}>
              <Grid item xs={12} md={6}>
                <Typography
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: 600,

                    fontSize: "24px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "rgba(0, 0, 0, 1)",
                    marginBottom: "20px",
                  }}
                >
                  {color.name}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Work Sans",
                    fontWeight: 400,
                    fontSize: "16px",
                    width: "366px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "rgba(14, 14, 14, 1)", // Remove var() unless defined
                  }}
                >
                  {color.description}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: color.code,
                      borderRadius: 1,
                      mr: 2,
                      border: "1px solid #ccc",
                    }}
                  />

                  <Box>
                    <Typography
                      sx={{ fontFamily: "Work Sans", color: "text.secondary" }}
                    >
                      {color.name}
                    </Typography>
                    <Typography
                      sx={{ fontFamily: "Work Sans", color: "text.secondary" }}
                    >
                      {color.code}
                    </Typography>
                  </Box>
                  <IconButton
                    edge="end"
                    sx={{
                      ml: 2,
                      backgroundColor: "white",
                      borderRadius: "4px", // rounded box
                      border:
                        "0.5px solid var(--HR-Colors-Coding-main-gray, rgba(112, 112, 112, 1))",
                      padding: "6px",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
      ))}

      {/* <Divider sx={{ my: 4 }} /> */}

      <Box display="flex" justifyContent="end" maxWidth={"85%"} gap={2}>
        <Button
          variant="outlined"
          sx={{
            color: "#B0B57D",
            borderColor: "#B0B57D",
            textTransform: "none",
            fontWeight: 600,
            fontFamily: "Work Sans",
            borderRadius: "20px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#B0B57D",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontFamily: "Work Sans",
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: "#9EA762",
            },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ThemeSettings;
