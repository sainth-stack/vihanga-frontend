import { Box, Typography } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CustomBadgeCard from "../../components/CustomBadgeCard";
import CardWidget from "pages/vihanga/components/Cards/CardWidget";
import { useDashboardContext } from "../../context/DashboardContext";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";
import { useTranslation } from 'react-i18next';

const RecentUpdates = () => {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useDashboardContext();

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading Recent Updates..." height={300} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Recent Updates" 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data) {
    return (
      <NoDataState 
        title="No Recent Updates Available" 
        message="Recent updates information is not available at the moment."
      />
    );
  }

  return (
    <CardWidget sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ChatBubbleOutlineIcon style={{ fontSize: 30, color: "gray" }} />
        <Typography
          sx={{ fontWeight: 600, fontSize: "20px", color: "#0E0E0E" }}
        >
          {t("RecentUpdates.RecentUpdates")}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ChatBubbleOutlineIcon 
          sx={{ 
            fontSize: 64, 
            color: "#E0E0E0", 
            mb: 2,
            opacity: 0.6
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500, 
            color: "#666", 
            mb: 1 
          }}
        >
          {t("RecentUpdates.ComingSoonTitle")}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#999", 
            maxWidth: 300, 
            mx: 'auto',
            lineHeight: 1.5
          }}
        >
          {t("RecentUpdates.ComingSoonDescription")}
        </Typography>
      </Box>
    </CardWidget>
  );
};

export default RecentUpdates;
