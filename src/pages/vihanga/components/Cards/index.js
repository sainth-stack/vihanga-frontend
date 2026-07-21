import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const CustomCard = ({ icon, text, count, isImage, imageStyle }) => {
  return (
    <Box
      container
      alignItems="center"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left Section: Text and Count */}
      <Grid item>
        <Typography
          sx={{ fontSize: "14px", fontWeight: "500", fontFamily: "Work Sans" }}
          color="#797979"
        >
          {text}
        </Typography>
        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#0E0E0E",
            fontFamily: "Work Sans",
          }}
        >
          {String(count).padStart(2, "0")}
        </Typography>
      </Grid>

      {/* Right Section: Icon or Image */}
      <Grid item xs={4} display="flex" justifyContent="flex-end">
        <Box
          sx={{
            backgroundColor: "#E9C034",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: ".4rem",
          }}
        >
          {isImage ? (
            <img
              src={icon}
              alt="icon"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                ...imageStyle, // optional custom style
              }}
            />
          ) : (
            <icon.type {...icon.props} sx={{ fontSize: 24, color: "white" }} />
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default CustomCard;
