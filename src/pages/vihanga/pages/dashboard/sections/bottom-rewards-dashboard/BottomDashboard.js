import { Grid, Box } from "@mui/material";
import AvailableRewards from "../available-rewards/index";
import RecentUpdates from "../recent-updates/index";
import BirthdayList from "../birthday-list/index";
import AnniversaryList from "../anniversary-list/index";

export const BottomDashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* <Grid item xs={12} md={8}>
          <AvailableRewards />
          <RecentUpdates />
        </Grid> */}

        {/* <Grid item xs={12} md={4}>
          <BirthdayList />
          <AnniversaryList />
        </Grid> */}
      </Grid>
    </Box>
  );
};
export default BottomDashboard;