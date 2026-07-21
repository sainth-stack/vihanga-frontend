import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomTable from "pages/vihanga/components/CustomTable";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import CustomButton from "pages/vihanga/components/Button/CustomButton";

// Mock permissions data
const permissionsData = Array(7).fill({
  name: "Birthday Widget",
  permissions: [
    "Goals",
    "Performance",
    "Rewards",
    "Absenses",
    "Time",
    "Attendance",
  ],
});

// Mock role assignment data
const roleAssignments = [
  { employee: "John Doe", group: "HR", status: "Active" },
  { employee: "Jane Smith", group: "Admin", status: "Inactive" },
];

// Define columns for the Permissions Table
const permissionColumns = [
  { id: "employee", label: "Employee" },
  { id: "Goals", label: "Goals" },
  { id: "Performance", label: "Performance" },
  { id: "Rewards", label: "Rewards" },
  { id: "Absenses", label: "Absenses" },
  { id: "Time", label: "Time" },
  { id: "Attendance", label: "Attendance" },
  { id: "Action", label: "Action" },
];

// Define columns for the Role Assignment Table
const roleAssignmentColumns = [
  { id: "Permission Group or users", label: "Permission Group or users" },
  { id: "Target population", label: "Target population" },
  { id: "Active", label: "Active" },
  { id: "Action", label: "Action" },
];

export default function AccessLevelPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // Generate rows for permissions table
  const generatePermissionTableData = () =>
    permissionsData.map((emp, index) => {
      const row = {
        employee: emp.name,
        Action: (
          <IconButton
            color="error"
            onClick={() => console.log("Delete permission row", index)}
          >
            <DeleteIcon />
          </IconButton>
        ),
      };

      permissionColumns.forEach((col) => {
        if (col.id !== "employee" && col.id !== "Action") {
          row[col.id] = emp.permissions.includes(col.id) ? (
            <CheckCircleIcon color="success" />
          ) : (
            ""
          );
        }
      });

      return row;
    });

  // Generate rows for role assignment table
  const generateRoleAssignmentData = () =>
    roleAssignments.map((entry, index) => ({
      ...entry,
      Action: (
        <IconButton
          color="error"
          onClick={() => console.log("Delete role assignment", index)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    }));

  return (
    <Box maxWidth="100%" sx={{ padding: "20px" }}>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: "white",
          padding: "20px",
          borderRadius: "16px",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Access Level
        </Typography>

        {/* Access Form */}
        <Box mb={4}>
          <InputTextComponent
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2, maxWidth: "45%" }}
          />
          <InputTextComponent
            label="Description"
            multiline
            rows={3}
            variant="outlined"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            sx={{ mb: 2, maxWidth: "45%" }}
          />
        </Box>
      </Box>

      {/* Permissions Table */}
      <Box
        sx={{
          mb: 4,
          mt: 2,
          padding: "16px",
          bgcolor: "white",
          borderRadius: "20px",
        }}
      >
        <Typography variant="h6" mb={2}>
          Permissions
        </Typography>
        <CustomTable
          columns={permissionColumns}
          data={generatePermissionTableData()}
        />
      </Box>

      {/* Role Assignment Section */}
      <Box p={3} bgcolor="white" borderRadius="16px">
        <Typography variant="h6" color="olive">
          Grant This Role To…
        </Typography>
        <Box
          sx={{
            my: 2,
            p: 1.5,
            bgcolor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          You may grant a group of users to manage employee records. A certain
          group of managers should edit records within their own department.
        </Box>

        <Typography variant="caption" sx={{ color: "gray", mt: 0.5 }}>
          You may grant a group of users to manage employee records. A certain
          group of managers should edit records within their own department.
        </Typography>

        <Box display="flex" gap={5} mb={1.5}>
          <CustomButton sx={{}}>Add</CustomButton>
          <CustomButton>Remove</CustomButton>
          <CustomButton>Make Active</CustomButton>
          <CustomButton>Make Inactive</CustomButton>
        </Box>

        <Box display="flex" alignItems="center" gap={4} mb={1}>
          <Typography sx={{ fontWeight: 700, mt: 1 }}>
            Permission Groups or Users
          </Typography>

          <Select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            size="small"
            sx={{ minWidth: 270, borderRadius: "20px" }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              --Select--
            </MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
          </Select>

          <TextField
            variant="outlined"
            size="small"
            placeholder="Please enter your keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              sx: {
                border: "none",
                "& fieldset": { border: "none" }, // removes the default outline
                borderRadius: "8px", // optional: rounded corners
              },
            }}
          />
        </Box>

        {/* Role Assignment Table */}
        <Box
          sx={{
            mb: 4,
            padding: "16px",
            bgcolor: "white",
            borderRadius: "20px",
            maxWidth: "100%",
          }}
        >
          {/* <Typography variant="h6" mb={2}>
            Role Assignment
          </Typography> */}
          <CustomTable
            columns={roleAssignmentColumns}
            data={generateRoleAssignmentData()}
          />
        </Box>
      </Box>
    </Box>
  );
}
