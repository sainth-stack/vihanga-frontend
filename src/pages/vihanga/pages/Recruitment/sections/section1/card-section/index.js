import { Typography, Box } from "@mui/material";
import React, { useState } from "react";
import CustomCard from "../../../../../components/Cards/index";
import CardWidget from "../../../../../components/Cards/CardWidget";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FeedBackPopPup from "./../../feedBack/FeedBackPopPup";
import { useTranslation } from "react-i18next";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

const Icons = {
  briefCaseIcon: BusinessCenterOutlinedIcon,
  barChartIcon: BarChartOutlinedIcon,
  appShortcutIcon: AppShortcutIcon,
  assignmentIcon: AssignmentOutlinedIcon,
};

export const SectionCards = ({ summaryData, loading, onCardClick }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [popupTitle, setPopupTitle] = useState("");
const { t } = useTranslation();
  const handleCardClick = (data, title) => {
    setPopupData(data);
    setPopupTitle(title);
    setIsPopupOpen(true);
    onCardClick(data, title);
  };
const userName = getItemFromLocalStorage("user")?.name;
  return (
    <>
      <Box>
        <Typography sx={{ fontSize: "2rem", fontFamily: "Work Sans", fontWeight: 400, color: "#1a1a1a" }}>
{t("RecruitmentManagement.WelcomeBack")}, {userName}!        </Typography>
        {loading ? (
          <Typography>Loading summary...</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
              gap: "24px",
              fontFamily: "Work Sans",
            }}
          >
            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(summaryData.newCandidate, t("RecruitmentManagement.NewCandidate"))
              }
            >
              <CustomCard
                icon={Icons.briefCaseIcon}
                text={t("RecruitmentManagement.NewCandidate")}
                count={summaryData.newCandidate.length || 0}
              />
            </CardWidget>

            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(summaryData.inProgress, t("RecruitmentManagement.InProgress"))
              }
            >
              <CustomCard
                icon={Icons.barChartIcon}
                text={t("RecruitmentManagement.InProgress")}
                count={summaryData.inProgress.length || 0}
              />
            </CardWidget>

            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(
                  summaryData.waitingForFeedback,
                   t("RecruitmentManagement.WaitingForFeedback")
                )
              }
            >
              <CustomCard
                icon={Icons.appShortcutIcon}
                 text={t("RecruitmentManagement.WaitingForFeedback")}
                count={summaryData.waitingForFeedback.length || 0}
              />
            </CardWidget>

            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(summaryData.offerReleased, t("RecruitmentManagement.OfferReleased"))
              }
            >
              <CustomCard
                icon={Icons.assignmentIcon}
                text={t("RecruitmentManagement.OfferReleased")}
                count={summaryData.offerReleased.length || 0}
              />
            </CardWidget>
          </Box>
        )}
        {isPopupOpen && (
          <FeedBackPopPup
            isOpen={isPopupOpen}
            setIsOpen={setIsPopupOpen}
            PoupData={popupData}
            popupTitle={popupTitle}
          />
        )}
      </Box>
    </>
  );
};
