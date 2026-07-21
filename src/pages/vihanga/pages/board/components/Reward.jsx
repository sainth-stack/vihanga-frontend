import React from "react";
import { Box, Typography, CardContent, Avatar, Stack } from "@mui/material";

import reward1 from "assets/images/reward1.png";
import reward2 from "assets/images/reward2.png";

const rewards = [
  {
    title: "Appreciation Certificate",
    subtitle: "Non Monotery",
    image: reward1,
  },
  {
    title: "Expert Badge",
    subtitle: "Non Monotery",
    image: reward2,
  },
];

// RewardCard Component
const RewardCard = ({ title, subtitle, image }) => (
  <Box
    sx={{
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      // width: "558px",
      height: "96px",
      padding: "16px",
      background: " rgba(255, 255, 255, 1)",
      boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
    }}
  >
    <Avatar
      src={image}
      variant="rounded"
      sx={{
        width: 64,
        height: 64,
        mr: 2,
        bgcolor: "transparent",
        "& img": {
          objectFit: "contain",
        },
      }}
    />
    <CardContent sx={{ padding: 0 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Box>
);

// RewardsList Component
const RewardsList = () => {
  return (
    <Box
      sx={{
        height: "239px",
        maxWidth: "100%",
        gap: "16px",
        borderRadius: "16px",
        marginTop: "25px",
      }}
    >
      <Typography
        variant="subtitle1"
        color="text.secondary"
        fontWeight={600}
        mb={2}
        ml="5px"
      >
        Don’t miss out on these exciting upcoming Rewards!
      </Typography>

      <Stack direction="column" spacing={1.75}>
        {" "}
        {rewards.map((item, idx) => (
          <RewardCard key={idx} {...item} />
        ))}
      </Stack>
    </Box>
  );
};

export default RewardsList;
