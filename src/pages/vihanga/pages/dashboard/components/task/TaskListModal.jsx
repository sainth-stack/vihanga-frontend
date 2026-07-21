import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Button, Divider, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom';
import TaskCard from '../TaskCard';

import TargetIcon from "../../assets/images/Target2.png"
import ZapIcon from "../../assets/images/Zap 2.png"

export default function TaskListModal({ open, onClose, title = 'Tasks', tasks = [], showAdd = true }) {
  const history = useHistory();

  const handleAddTask = () => {
    history.push(`/admin/objectives/task?fromTask=true`);
  };

  const goToTask = (task) => {
    const isEdit = true;
    const keyResultId = task?.krReferenceId || '';
    const taskId = task?._id || task?.id || '';
    history.push(`/admin/objectives/task?isEdit=${isEdit}&keyResultId=${keyResultId}&taskId=${taskId}&fromTask=true`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#FBF9F2', borderBottom: '1px solid #EAE7DC' }}>
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="outlined" size="small" sx={{ color: '#836F39', borderColor: '#836F39', textTransform: 'none' }} onClick={() => history.push('/admin/tasks')}>View</Button>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: '#FFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {tasks?.length || 0} tasks
          </Typography>
          {showAdd && (
            <Button variant="contained" size="small" onClick={handleAddTask} sx={{ textTransform: 'none', backgroundColor: '#837F39', '&:hover': { backgroundColor: '#837F39' } }}>
              Add Task
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {(!tasks || tasks.length === 0) ? (
          <Typography variant="body2" color="text.secondary">No tasks found</Typography>
        ) : (
          <Grid container spacing={2}>
            {tasks.map((task) => {
              const transformedTask = {
                id: task._id,
                title: task.title || 'Untitled Task',
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'No due date',
                kpi: task.krReferenceId ? 'KPI Task' : null,
                priority: task.priority || 'Medium',
                progress: task.progressStatus || 0,
                icon: task.krReferenceId ? TargetIcon : ZapIcon,
                cardBg: task.krReferenceId ? "#837F391A" : "#FBEEEA",
                borderColor: task.krReferenceId ? "#BEA781" : "#DB5930",
                status: task.status,
                description: task.description
              };

              return (
                <Grid item xs={12} key={task._id || task.id}>
                  <TaskCard {...transformedTask} onTitleClick={() => goToTask(task)} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}


