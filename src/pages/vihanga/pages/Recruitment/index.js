import React from "react";
import { Box } from "@mui/material";
import "./index.css";
import RecuitementTable from "./sections/section1";

const RecruitmentManagement = () => {
  return (
    <>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: 2,
          }}
          className="recruitment-page"
        >
          <Box sx={{ mt: 2 }}>
            <RecuitementTable />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default RecruitmentManagement;
