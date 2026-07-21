//for Available-rewards and recent-updates in dashboard
import { Box, Typography } from "@mui/material";

export default function CustomBadgeCard({
  backgroundColor = "#F3F2EB",
  icon: IconComponent,
  iconColor = "#B0B0B0",
  title = "",
  titleSize = 18,
  subtitle = "",
  subtitleSize = 14,
  ActionTextLabel = "",
  showActionBorder = false,
  actionColor = "#333",
  subtitleColor = "gray",
  onButtonClick,
  sx = {},
}) {
  return (
    <Box
      sx={{
        // width: "680px",
        // height: "85px",
        borderRadius: "20px",
        opacity: 1,
        padding: "20px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        backgroundColor: backgroundColor,
        mt: 2,
        ...sx,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {IconComponent && (
          <IconComponent style={{ fontSize: 30, color: iconColor }} />
        )}
        <Box>
          <Typography
            sx={{
              fontFamily: "Work Sans, sans-serif",
              fontSize: titleSize,
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: subtitleColor, fontSize: subtitleSize ,fontWeight:"600",fontFamily:"Work Sans"}}>
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography
          onClick={onButtonClick}
          sx={{
            border: showActionBorder ? "2px solid #ccc" : "none",
            borderRadius: showActionBorder ? "50px" : "0px",
            padding: showActionBorder ? "4px 16px" : "0px",
            color: actionColor,
          }}
        >
          {ActionTextLabel}
        </Typography>
      </Box>
    </Box>
  );
}
