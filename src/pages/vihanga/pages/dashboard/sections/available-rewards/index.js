import { Box, Button, Typography } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CustomBadgeCard from "../../components/CustomBadgeCard";
import StarsIcon from "@mui/icons-material/Stars";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CardWidget from "pages/vihanga/components/Cards/CardWidget";
import { useDashboardContext } from "../../context/DashboardContext";
import { LoadingState, ErrorState, NoDataState } from "../../components/LoadingState";
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AvailableRewards = () => {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useDashboardContext();
  const history = useHistory();

  // Handle reward card click
  const handleRewardClick = () => {
    history.push("/admin/rewards/rewardsRedemption");
  };

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading Available Rewards..." height={300} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Available Rewards" 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data) {
    return (
      <NoDataState 
        title="No Rewards Data Available" 
        message="Available rewards information is not available at the moment."
      />
    );
  }

  // For now, we'll use static data since the API doesn't include rewards data
  // This can be enhanced when rewards data is added to the API
  const rewardsData = [
    {
      icon: StarsIcon,
      title: t("AvailableRewards.Rewards.ExpertBadge"),
      subtitle: t("AvailableRewards.Rewards.Achievement"),
      backgroundColor: "#E0DECF66",
      iconColor: "#C2BFA6",
      showActionBorder: true,
      ActionTextLabel: t("AvailableRewards.Rewards.Claim"),
    },
    {
      icon: EmojiEventsIcon,
      title: t("AvailableRewards.Rewards.TeamPlayerAward"),
      subtitle: t("AvailableRewards.Rewards.Recognition"),
      backgroundColor: "#BEA78133",
      iconColor: "#BEA781",
      showActionBorder: true,
      ActionTextLabel: t("AvailableRewards.Rewards.Claim"),
    },
  ];

  // Get user's reward points from leaderboard data if available
  const userPoints = data.leaderboard?.company?.find(
    person => person.employeeId === data.userId
  )?.points || 0;

  return (
    <CardWidget sx={{ m: "1rem 0" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CardGiftcardIcon style={{ fontSize: 30, color: "gray" }} />
          <Typography
            sx={{ fontWeight: 600, fontSize: "20px", color: "#0E0E0E" }}
          >
            {t("AvailableRewards.AvailableRewards")}
          </Typography>
        </Box>
        <Button
          sx={{
            backgroundColor: "#837F39",
            fontWeight: 600,
            color: "white",
            borderRadius: "20px",
            px: 1,
            "&:hover": {
              backgroundColor: "#837F39",
              color: "white",
            },
          }}
        >
          {userPoints} {t("AvailableRewards.Pts")}
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CardGiftcardIcon 
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
          {t("AvailableRewards.ComingSoonTitle")}
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
          {t("AvailableRewards.ComingSoonDescription")}
        </Typography>
      </Box>
    </CardWidget>
  );
};

export default AvailableRewards;
