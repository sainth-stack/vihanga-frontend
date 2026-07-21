import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { canEdit, canDelete } from "utilities/privilegeHelper";

const Fotter = ({ createdDate, onEdit, onDelete }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        width: '100%',
       paddingRight: '10px',
        paddingBottom:'10px',
      }}
    >
      {/* Left Section: Created Date */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,ml:"40px" ,mr:"40px",}}>
        <FiberManualRecordIcon sx={{ fontSize: 10, color: '#837F39' }} />
        <Typography sx={{color:"#707070",fontFamily:"Work Sans",fontWeight:"400",fontSize:"12px"}}>
          Created {createdDate}
        </Typography>
      </Box>

      {/* Right Section: Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: "15px" }}>
        {canEdit() && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon sx={{width:"16px",height:"16px"}} />}
            onClick={onEdit}
            sx={{
              borderColor: '#837F39',
              color: '#837F39',
              textTransform: 'none',
              borderRadius: '20px',
              fontWeight: 500,
              fontFamily:"Work Sans",
              fontSize:"16px",
              backgroundColor:"#FFFFFF",
              px: 2,
            }}
          >
            Edit
          </Button>
        )}
        {canDelete() && (
          <Button
            variant="contained"
            size="small"
            startIcon={<DeleteIcon sx={{color:"#FFFFFF",width:"16px",height:"16px"}} />}
            onClick={onDelete}
            sx={{
              backgroundColor: '#837F39',
              color: '#FFFFFF',
              textTransform: 'none',
              borderRadius: '20px',
              fontWeight: 500,
              fontSize:"16px",
              fontFamily:"Work Sans",
              px: 2,
              '&:hover': {
                backgroundColor: '#6f6a2f',
              },
            }}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Fotter;
