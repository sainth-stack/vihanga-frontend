import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";

const Timer = ({ onTimeUp, initialTime = 900 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: { xs: "0", sm: "1rem" },
        marginBottom: "0px",
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          marginBottom: { xs: ".5rem", sm: "0" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <TimerSharpIcon sx={{ fontSize: { xs: 30, sm: 50 } }} />
        <Typography component="span" sx={{ fontWeight: 300 }}>
          Remaining Time:
          <Typography
            component="span"
            sx={{
              display: "flex",
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.2rem" },
              marginLeft: "0.5rem",
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default Timer;
