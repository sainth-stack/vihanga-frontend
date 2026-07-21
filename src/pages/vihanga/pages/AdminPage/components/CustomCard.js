// components/CommonCard.jsx
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom"; 
const CommonCard = ({ icon, title, description ,link}) => {
  return (
  <Box component={Link} to={link} sx={{ textDecoration: "none !important" }}>
      <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
        p: 2,
        transition: "0.3s",
       
        "&:hover": {
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          transform: "translateY(-4px)",
          backgroundColor:" rgb(59 130 246 / 0.2)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto 16px auto",
              backgroundColor: "#fff",
          }}
        >
          {icon}
        </Box>
        <Typography  sx={{color:"#0E0E0E",fontSize:"20px",fontWeight:"500",fontFamily:"Work Sans",marginBottom:"5px",lineHeight: 1.5, minHeight: 60}} >
          {title}
        </Typography>
        <Typography sx={{color:"#707070",fontweight:"400",fontSize:"14px",fontFamily:"Work Sans",marginBottom:"5px", lineHeight: 1.5, minHeight: 40 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
    </Box>
  );
};

export default CommonCard;
