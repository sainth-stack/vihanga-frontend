import React, { useState } from "react";
import CustomTable from '../../../../components/CustomTable/index';
import { Chip, Avatar, IconButton, Tooltip, LinearProgress, Typography, Box } from "@mui/material";
import { Add, Edit, MoreVert } from "@mui/icons-material";
import CommentIcon from "@mui/icons-material/Comment";
import messageIcon from '../../../../../../assets/svg/messageIcon.svg';
import addButtonIcon from '../../../../../../assets/svg/addButtonIcon.svg'
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'; // or use TaskOutlined
import {mockData} from '../screen1/data'
import CheckIcon from '@mui/icons-material/Check'; // using simple check mark
import taskIcon from '../../../../../../assets/svg/obticon.svg'
import { renderTextWithLinks } from "utils/linkUtils";


const TaskTable4 = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedTasks, setSelectedTasks] = useState({}); // ✅
  
    const handleCheckboxChange = (id) => { // ✅
      setSelectedTasks((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

  const columns = [
    {
        id: "Objective",
        label: "Objective",
        render: (row) => (
          <Box sx={{ display: "flex" ,alignItems: "start", gap:1 }}>
            <Box sx={{display:"flex",flexDirection:"row" , gap:1}}>
            <Checkbox
              checked={selectedTasks[row.id] || false}
              onChange={() => handleCheckboxChange(row.id)}
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #535353',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: '#837F39',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
                </Box>
              }
              sx={{ padding: 0 }}
            />
            <img src={taskIcon} alt="icon" sx={{width:"18px",height:"18px", color: "#837F39" ,cursor:"pointer"}} />
            </Box>
           <Box sx={{display:"flex",flexDirection:"column",alignItems:"start"}} >
           <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "19px",
                color: "#0E0E0E",
                fontFamily: "Work Sans",
                fontWeight:"600",
              }}
            >
              {row.task}
            </Typography>
            {renderTextWithLinks(row.description, {
              fontSize: "14px",
              lineHeight: "19px",
              color: "#535353",
              fontFamily: "Work Sans",
              fontWeight: "400"
            })}

           </Box>
          </Box>
        ),
      },
      
    {
      id: "Progress",
      label: "Progress",
      render: (row) => (
        <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
         <Box sx={{ position: "relative", width: 110, height: 11 }}>
      <LinearProgress
        variant="determinate"
        value={row.progress}
        sx={{
          height: "100%",
          borderRadius: 50,
          backgroundColor: "#E9E8E7",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#EF3838",
            borderRadius: 95,
          },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          color: "#FFFFFF",
          fontWeight: "400",
          fontSize: "6.67px",
          fontFamily:"Work Sans",
        }}
      >
        {row.progress}%
      </Typography>
    </Box>
    <Chip
  label={row.dueDate}
  size="small"
  sx={{
    backgroundColor: "#EF3838",
    color: "#FFFFFF",
    height: "17px",
    borderRadius: "100px",
    fontFamily: "Work Sans",
    fontWeight: 400,
    fontSize: "10px",
    lineHeight: "100%",
    letterSpacing: "3%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
/>


        </Box>
      ),
    },
    {
        id: "owner",
        label: "Owner",
        render: (row) => (
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
            <Typography  fontSize={14} color="#707070" sx={{fontFamily:"Work Sans",fontWeight:"400"}}>
              {row.owner}
            </Typography>
            <Chip
              label={row.ownerRole}
              size="small"
              sx={{
                backgroundColor: "#26925F",
                color: "#fff",
                fontSize: "12px",
                height: "22px",
                padding: "0 6px",
                fontWeight: 500,
              }}
            />
          </Box>
        ),
      },

      {
        id: "weight",
        label: "Weight",
        render: (row) => (
        <Chip
        label={row.weight}
        size="small"
        sx={{
          backgroundColor: "#C5FFE4",
          color: "#26925F",
          fontSize: "14px",
          height: "22px",
          fontWeight: 600,
          fontFamily:"Work Sans"
        }}
      />
    ),
      },
      
      
      {
        id:"status",
        label: "Approve/Reject",
        render: (row) => {
          const getStatusColor = (status) => {
            switch (status) {
              case "Submit":
                return {
                  backgroundColor: "#26925F",
                  color: "#FFFFFF",
                };
              case "Draft":
                return {
                  backgroundColor: "#707070",
                  color: "#FFFFFF",
                };
              default:
                return {
                  backgroundColor: "#26925F",
                  color: "#000",
                };
            }
          };
      
          return (
           <Box display="flex" flexDirection="column" alignItems="center">
             <Chip
              label={row.status}
              size="small"
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                height: "23px",
                
                borderRadius: "100px",
                 display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Work Sans",
                 color: "#FFFFFF", // white text

                ...getStatusColor(row.status),
              }}
            />
           </Box>
          );
        },
      },
      

    {
      id: "actions",
      label: "Action",
      render: (row) => (
        <IconButton>
          <MoreVert />
        </IconButton>
      ),
    },
    {
        id: "Add KR",
        label: "Add KR",
        render: (row) => (
          <Tooltip title="Add Subtask">
            <img src={addButtonIcon} />
          </Tooltip>
        ),
      },
  ];


  
  return (
    <CustomTable
      columns={columns}
      data={mockData}
      page={page}
      setPage={setPage}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      totalPages={Math.ceil(mockData.length / rowsPerPage)}
      pagination
    />
  );
};

export default TaskTable4;