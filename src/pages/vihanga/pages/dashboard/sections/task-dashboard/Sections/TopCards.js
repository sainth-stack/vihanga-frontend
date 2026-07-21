import React from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useDashboardContext } from "../../../context/DashboardContext";

import Header from "pages/vihanga/pages/board/components/Header";
import TaskDashboardHeader from "./Header";
import { TaskListModal } from '../../../components';
import { api } from 'service/api';
import { dashboardApi } from 'service/apiVariables';
import { AuthUserId, companyId } from 'utilities';

import ZapIcon from "../../../assets/images/Zap.png"
import infoIcon from "../../../assets/images/Info.png";
import userGroupIcon from "../../../assets/images/Target.png"

const TaskCards = () => {
  const { t } = useTranslation();
  const { data, dashboardType, taskData, taskLoading, taskError } = useDashboardContext();
  const tasksDashboard = data?.tasksDashboard;
  const filtered = taskData?.tasksDashboard;
  const [openModal, setOpenModal] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalTasks, setModalTasks] = React.useState([]);

  const TaskData = [
    {
      title: t("TopCards.KpiTasks"),
      count: (filtered?.kpiTasks?.count) ?? (tasksDashboard?.kpiTasks || 0),
      icon: userGroupIcon,
      iconBg: "#BEA781",
      cardBg: "#BEA78126",
    },
    {
      title: t("TopCards.AdHocTasks"),
      count: (filtered?.adHocTasks?.count) ?? (tasksDashboard?.adHocTasks || 0),
      icon: ZapIcon,
      iconBg: "#DB5930",
      cardBg:"#FBEEEA"
    },
    {
      title: t("TopCards.Urgent"),
      count: (filtered?.urgent?.count) ?? (tasksDashboard?.urgent || 0),
      icon: infoIcon,
      iconBg: "#837F39",
      cardBg:"#837F3926"
    },
  ];

  const openTasks = async (title) => {
    try {
      let list = [];
      if (filtered) {
        const td = filtered;
        if (title === 'KPI Tasks') list = td?.kpiTasks?.tasks || [];
        else if (title === 'Ad Hoc Tasks') list = td?.adHocTasks?.tasks || [];
        else if (title === 'Urgent') list = td?.urgent?.tasks || [];
      }
      if (!list?.length) {
        // Fallback to recent from main dashboard payload
        list = tasksDashboard?.recent || [];
      }
      setModalTitle(title);
      setModalTasks(list);
      setOpenModal(true);
    } catch (e) {
      setModalTitle(title);
      setModalTasks(tasksDashboard?.recent || []);
      setOpenModal(true);
    }
  };

  return (
    <>
      <TaskDashboardHeader/>

      <Grid container spacing={2} mb={2}>
        {TaskData.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  backgroundColor: item.cardBg,
                  borderRadius: "16px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onClick={() => openTasks(item.title)}
                style={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    backgroundColor: item.iconBg,
                    borderRadius: "12px",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={IconComponent}
                    alt="icon"
                    style={{ width: "18px", height: "18px" }}
                  />
                </Box>

                <Stack spacing={0.5}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {item.count}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <TaskListModal open={openModal} onClose={() => setOpenModal(false)} title={modalTitle} tasks={modalTasks} />
    </>
  );
};

export default TaskCards;
