import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { formatDate } from "pages/vihanga/utils";
import { useHistory } from "react-router-dom";
import { LinearProgress, Typography, Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

const menuItemsStage = [
  { value: "newapplied", text: "New Applied", progress: 10 },
  { value: "psychometrictest", text: "Psychometric Test", progress: 20 },
  { value: "interview1", text: "Interview 1", progress: 40 },
  { value: "interview2", text: "Interview 2", progress: 50 },
  { value: "Document Upload", text: "Document Upload", progress: 60 },
  { value: "Offer Letter", text: "Offer Letter", progress: 70 },
  { value: "onboarding", text: "Onboarding", progress: 80 },
  { value: "rejected", text: "Rejected", progress: 100 },
  { value: "Convert to Employee", label: "Convert to Employee",progress:100 },
  // { text: "Shortlisted", progress: 100, value: "shortlisted" },
];

const StatusCell = ({ row }) => {
      const { t } = useTranslation(); 

  const selectedStage = menuItemsStage.find(
    (item) => item.value === row.status || item.text === row.status
  );
  // Ensure progress is a valid number between 0-100
  const progressValue = Math.min(100, Math.max(0, 
    selectedStage?.progress ? Number(selectedStage.progress) : 0
  ));

  return (
    <Grid style={{display: 'flex', flexDirection: 'column'}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: '100%' 
        }}
      >
        <Typography
          fontSize="14px"
          sx={{
            fontFamily: "Work Sans",
          }}
        >
          {selectedStage
            ? t(`RecruitmentManagement.${selectedStage.text}`)
            : row.status}
        </Typography>
        {/* <KeyboardArrowDownIcon fontSize="small" className="ml-2" /> */}
      </Box>

      <Box mt={1} sx={{ width: '115px' }}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            height: "10px",
            borderRadius: "20px",
            backgroundColor: "#ddd",
            "& .MuiLinearProgress-bar": {
              backgroundColor: selectedStage?.text === "Rejected" ? "#EF3838" : "#388e3c",
              borderRadius: "20px", 
            },
          }}
        />
      </Box>
    </Grid>
  );
};

const FeedBackPopPup = ({ isOpen, setIsOpen, popupTitle, PoupData }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const handleViewDetails = (row) => {
    history.push({
      pathname: `/admin/previlages/candidate/create/${row?.candidateId}`,
      state: { candidateData: row },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "950px",
          padding: "20px",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "rgba(14, 14, 14, 1)",
          fontSize: "20px",
          fontStyle: "Work Sans",
          fontWeight: "600",
        }}
      >
        <span style={{
          color: "rgba(14, 14, 14, 1)",
          fontSize: "20px",
          fontStyle: "Work Sans",
          fontWeight: "600",
        }}>
          {popupTitle}
        </span>
        <span
          style={{
            background: "rgba(215, 245, 231, 1)",
            fontWeight: "bold",
            marginLeft: "17px",
            color: "black",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {PoupData.length}
        </span>
      </DialogTitle>
      <DialogContent>
        <table className="w-full">
          <thead
            style={{
              background: "rgba(244, 244, 244, 1)",
              gap: "5px",
              marginLeft: "10px 14px",
            }}
          >
            <tr
              className="border-b text-center align-middle text-lg"
              style={{
                fontStyle: "Work Sans",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.03em",
              }}
            >
               <th className="p-2">{t("RecruitmentManagement.ID")}</th>
              <th className="p-2">{t("RecruitmentManagement.Name")}</th>
              <th className="p-2">{t("RecruitmentManagement.Email")}</th>
              <th className="p-2">{t("RecruitmentManagement.AppliedOn")}</th>
              <th className="p-2">{t("RecruitmentManagement.Stages")}</th>
              <th className="p-2">{t("RecruitmentManagement.Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {PoupData.map((row, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td
                  className="p-2 text-yellow-600 font-bold text-center align-middle"
                  style={{
                    fontStyle: "Work Sans",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0.03em",
                    color: "rgba(131, 127, 57, 1)",
                  }}
                >
                  {row.candidateId}
                </td>
                <td
                  className="p-2 text-center align-middle"
                  style={{
                    fontStyle: "Work Sans",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0.03em",
                    width: "150px",
                  }}
                >
                  {row.candidateName}
                </td>
                <td
                  className="p-2 text-center align-middle"
                  style={{
                    fontStyle: "Work Sans",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0.03em",
                  }}
                >
                  {row.email}
                </td>
                <td
                  className="p-2 text-center align-middle"
                  style={{
                    fontStyle: "Work Sans",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0.03em",
                    width: "150px",
                  }}
                >
                  {formatDate(row.appliedOn)}
                </td>
                <td
                  className="p-2 text-center align-middle"
                  style={{
                    fontStyle: "Work Sans",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0.03em",
                  }}
                >
                  <StatusCell row={row} />
                </td>
                <td className="p-2 text-center align-middle">
                  <Button
                    variant="contained"
                    style={{
                      background: "rgba(131, 127, 57, 1)",
                      color: "white",
                      width: "120px",
                      borderRadius: "60px",
                      fontStyle: "Plus Jakarta Sans",
                      fontWeight: 500,
                      fontSize: "12px",
                    }}
                    onClick={() => handleViewDetails(row)}
                  >
                    {t("RecruitmentManagement.CandidateDetails")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
};

export default FeedBackPopPup;