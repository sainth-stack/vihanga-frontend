import React from "react";
import { Box } from "@mui/material";
import CardWidget from "pages/vihanga/components/Cards/CardWidget";
import CustomCard from "pages/vihanga/components/Cards";

import me1 from "assets/images/me1.png";
import me2 from "assets/images/me2.png";
import me3 from "assets/images/me3.png";

const DashboardCards = () => {
  const data = [
    { title: "Tasks", value: "47", image: me1 },
    { title: "Achievement", value: "02", image: me2 },
    { title: "Reward Points", value: "45.0", image: me3 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: "1.5rem",
        gap: 2,
        fontFamily: "Work Sans",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {data.map((item, index) => (
        <CardWidget
          key={index}
          sx={{
            width: "100%",
            // maxWidth: "406.33px",
            // height: "83px",
            paddingRight: "16px",
          }}
        >
          <CustomCard
            icon={item.image}
            text={item.title}
            count={item.value}
            isImage={true}
            imageStyle={{
              width: "76,67px",
              height: "57px",
              borderRadius: ".4rem",

              backgroundColor: "white",
            }}
          />
        </CardWidget>
      ))}
    </Box>
  );
};

export default DashboardCards;
