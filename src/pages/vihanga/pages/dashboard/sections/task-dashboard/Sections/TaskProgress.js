import React from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Stack,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Header from 'pages/vihanga/pages/board/components/Header';
import { useDashboardContext } from "../../../context/DashboardContext";
import { LoadingState, ErrorState, NoDataState } from "../../../components/LoadingState";
import { TaskListModal, TaskCard } from '../../../components';
import { useHistory } from 'react-router-dom';

import TargetIcon from "../../../assets/images/Target2.png"
import ZapIcon from "../../../assets/images/Zap 2.png"

export default function TaskProgressCard() {
  const { t } = useTranslation();
  const { data, loading, error, refetch, taskData } = useDashboardContext();
  const history = useHistory();
  const [openModal, setOpenModal] = React.useState(false);
  const [modalTasks, setModalTasks] = React.useState([]);

  // Show loading state
  if (loading) {
    return <LoadingState title="Loading Recent Tasks..." height={400} />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState 
        title="Failed to Load Recent Tasks" 
        error={error} 
        onRetry={refetch}
      />
    );
  }

  // Show no data state
  if (!data || !data.tasksDashboard || !data.tasksDashboard.recent) {
    return (
      <NoDataState 
        title="No Recent Tasks Available" 
        message="Recent tasks information is not available at the moment."
      />
    );
  }

  const filtered = taskData?.tasksDashboard;
  const recentTasks = (filtered?.total?.tasks || data.tasksDashboard.recent || []);
  const limitedRecent = recentTasks.slice(0, 4);

  // Transform API data to component format
  const transform = (arr) => arr.map((task, index) => ({
    id: task._id,
    title: task.title || t("TaskProgress.UntitledTask"),
    dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }) : t("TaskProgress.NoDueDate"),
    kpi: task.krReferenceId ? t("TaskProgress.KpiTask") : null,
    priority: task.priority || 'Medium',
    progress: task.progressStatus || 0,
    icon: task.krReferenceId ? TargetIcon : ZapIcon,
    cardBg: task.krReferenceId ? "#837F391A" : "#FBEEEA",
    borderColor: task.krReferenceId ? "#BEA781" : "#DB5930",
    status: task.status,
    description: task.description
  }));
  const transformedTasks = transform(limitedRecent);

  const openAllRecent = () => {
    setModalTasks(recentTasks);
    setOpenModal(true);
  };

  const goToTask = (task) => {
    const isEdit = true;
    const keyResultId = task?.krReferenceId || '';
    const taskId = task?._id || task?.id || '';
    history.push(`/admin/objectives/task?isEdit=${isEdit}&keyResultId=${keyResultId}&taskId=${taskId}&fromTask=true`);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 1 }}>
        <Header style={{ margin: 0 }} text={t("TaskProgress.RecentTasks")} />
        {recentTasks.length > 4 && (
          <Typography variant="body2" sx={{ color: '#836F39', cursor: 'pointer', fontWeight: 600 }} onClick={openAllRecent}>
            {t("TaskProgress.ViewAll")}
          </Typography>
        )}
      </Box>
      {transformedTasks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {t("TaskProgress.NoRecentTasksFound")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {transformedTasks.map((task, index) => {
            // Get the original task data for navigation
            const originalTask = limitedRecent[index];
            return (
              <Grid item xs={12} sm={6} md={12} mt={1} key={task.id || index}>
                <TaskCard {...task} onTitleClick={() => goToTask(originalTask)} />
              </Grid>
            );
          })}
        </Grid>
      )}

      <TaskListModal open={openModal} onClose={() => setOpenModal(false)} title={t("TaskProgress.AllRecentTasks")} tasks={modalTasks} />
    </>
  );
}


