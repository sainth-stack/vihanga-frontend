import React from 'react';
import { Box, Typography, Button, Stack, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom';
import { useDashboardContext } from '../../../context/DashboardContext';
import { canEdit } from 'utilities/privilegeHelper';

export default function TaskDashboardHeader() {
  const { t } = useTranslation();
  const { taskFilter, setTaskFilter } = useDashboardContext();
  const [filter, setFilter] = React.useState(taskFilter || 'all');
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleFilterChange = (event) => {
    const v = event.target.value;
    setFilter(v);
    // Map UI -> backend values
    const backendMap = {
      week: 'week',
      month: 'month',
      year: 'year',
      all: 'all',
      thisWeek: 'week',
      thisMonth: 'month',
      thisYear: 'year',
    };
    setTaskFilter(backendMap[v] || 'all');
  };

  const handleAddTask = () => {
    history.push(`/admin/objectives/task?fromTask=true`);
  };

  const handleIssueTracker = () => {
    // Open Google Sheets in new tab
    window.open('https://docs.google.com/spreadsheets/d/14hlsOHuIik__dX_1Y0lf5AECHcfG9PtvdBG-KXNTN9Y/edit?gid=144481847#gid=144481847', '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        width: '100%',
        padding: { xs: '12px 0', sm: '16px 0' },
        gap: { xs: 2, sm: 0 }
      }}
    >
      {/* Left - Title */}
      <Typography 
        variant="h6" 
        fontWeight={700}
        sx={{
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
          marginBottom: { xs: 1, sm: 0 }
        }}
      >
        {t("TaskDashboardHeader.TaskDashboard")}
      </Typography>

      {/* Right - Actions */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={{ xs: 1.5, sm: 2 }} 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        {/* Filter Dropdown with Icon */}
        <Stack 
          direction="row" 
          alignItems="center" 
          spacing={1}
          sx={{ 
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <FilterListIcon 
            sx={{ 
              color: '#C1A875', 
              fontSize: { xs: 18, sm: 20 },
              flexShrink: 0
            }} 
          />
          {/*Issue Tracker Button */}
          {/* <Button
            variant="outlined"
            onClick={handleIssueTracker}
            sx={{
              color: '#836F39',
              borderColor: '#836F39',
              borderRadius: '20px',
              fontWeight: 600,
              textTransform: 'none',
              padding: { xs: '8px 16px', sm: '4px 16px' },
              minWidth: 'auto',
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              '&:hover': {
                borderColor: '#836F39',
                backgroundColor: 'rgba(131, 111, 57, 0.04)',
              },
            }}
          >
            Issue Tracker
          </Button> */}

          <Select
            value={filter}
            onChange={handleFilterChange}
            size="small"
            sx={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              fontWeight: 500,
              color: '#000',
              '& .MuiSelect-icon': { color: '#C1A875' },
              minWidth: { xs: '120px', sm: '100px' },
              width: { xs: '100%', sm: 'auto' },
              padding: '2px 8px',
              borderColor: '#836F39',
              borderRadius: '20px',
              '&:hover': {
                borderColor: '#836F39 !important',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#836F39',
              },
              '& .MuiSelect-select': {
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                padding: { xs: '8px 12px', sm: '6px 8px' }
              }
            }}
          >
            <MenuItem value="week">{t("TaskDashboardHeader.FilterOptions.ThisWeek")}</MenuItem>
            <MenuItem value="month">{t("TaskDashboardHeader.FilterOptions.ThisMonth")}</MenuItem>
            <MenuItem value="year">{t("TaskDashboardHeader.FilterOptions.ThisYear")}</MenuItem>
            <MenuItem value="all">{t("TaskDashboardHeader.FilterOptions.All")}</MenuItem>
          </Select>
        </Stack>

        {/* Action Buttons Container */}
        <Stack 
          direction={{ xs: 'row', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {/* View Button */}
          <Button
            variant="outlined"
            startIcon={<PersonOutlineIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            sx={{
              color: '#836F39',
              borderColor: '#836F39',
              borderRadius: '20px',
              fontWeight: 600,
              textTransform: 'none',
              padding: { xs: '8px 16px', sm: '4px 16px' },
              minWidth: 'auto',
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              '&:hover': {
                borderColor: '#836F39',
                backgroundColor: 'rgba(131, 111, 57, 0.04)'
              }
            }}
            onClick={() => history.push('/admin/tasks')}
          >
            {t("TaskDashboardHeader.Buttons.View")}
          </Button>

          {/* Add Task Button */}
          {canEdit() && (
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              sx={{
                backgroundColor: '#837F39',
                borderRadius: '20px',
                fontWeight: 600,
                textTransform: 'none',
                padding: { xs: '8px 16px', sm: '4px 16px' },
                minWidth: 'auto',
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                '&:hover': {
                  backgroundColor: '#6B5A2F',
                },
              }}
              onClick={handleAddTask}
            >
              {t("TaskDashboardHeader.Buttons.AddTask")}
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}