import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Chip
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useDispatch, useSelector } from "react-redux";
import { getUploadsByCategory } from "action/UploadAct";
import {
  deletekeyResult,
  getKeyResults,
  getKeyResultsSingle,
} from "action/keyResultAct";
import { Toast } from "service/toast";
import CustomTable from "../../../vihanga/components/CustomTable";
import ActionDropdown from "../../../../pages/vihanga/components/ActionDropdown/ActionDropdown";
import { keyresults } from "reducer";
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";


const staticData = [
  {
    _id: "1",
    objective: "John Doe",
    KR: "good",
    frequency: "sainath",
    UOM: "97",
    polarity: "positive",
    targetDate: "2024-12-22",
    actualDate: "2024-12-22",
    target: "10",
    actual: "9",
    dueDate: "31 Mar 2025",
    progress: 20,
  },
  {
    _id: "3",
    objective: "gurusai",
    KR: "good",
    frequency: "sainath",
    UOM: "97",
    polarity: "positive",
    targetDate: "2024-12-22",
    actualDate: "2024-12-22",
    target: "10",
    actual: "9",
    dueDate: "31 Mar 2025",
    progress: 20,
  },
  // Add more mock entries if needed
];

const LeaveTable1 = () => {
  const kdata = useSelector((state) => state.data.keyresults);
  const dispatch = useDispatch();
  let legalEntityObj = {
    legalEntityName: "",
    status: "",
    country: "",
    _id: null,
  };

  const [legalEntitySearch] = useState(legalEntityObj);
  const [, setUploads] = useState([]);
  const [searchKey] = useState("");
  const [page, setPage] = useState(0);
  const [updatepage] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState(staticData);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privileges, setPrivileges] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([
    "OnTrack",
    "AtRisk",
    "OffTrack",
  ]);
  const samData = () => {
    if (kdata.success) {
      setData([]);
      fetchKeyResults();
      dispatch(keyresults({ success: false }));
    }
  };

  // const totalPages = Math.ceil(refreshData.length / rowsPerPage);
  // const paginatedData = refreshData.slice(
  //   page * rowsPerPage,
  //   (page + 1) * rowsPerPage
  // );


  const getProgressLabel = (progress) => {
    if (progress >= 80)
      return { label: "OnTrack", color: "white", backgroundColor: "#4CAF50" };
    if (progress >= 50)
      return { label: "AtRisk", color: "white", backgroundColor: "#FFC107" };
    return { label: "OffTrack", color: "white", backgroundColor: "#F44336" };
  };

  useEffect(() => {
    samData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kdata.success]);

  const refreshData = () => {
    try {
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setError("");
        } else if (data.length === 0) {
          setData([]);
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

const history = useHistory();
  const onEdit = (row) => {
  // Any other edit logic you need
  
  // Navigation logic
  history.push({
    pathname: "/admin/objectives/okrdetails",
    state: {
      data: {
        objective: row.okrName,
        objectiveId: row.objectiveId,
        ...row,
        keyId: row._id,
        privileges,
        _id: row.objectiveId,
        objectiveStatus: row.objectiveStatus,
        polarity: row.polarity || "Positive",
      },
    },
  });
};

  const fetchKeyResults = () => {
    try {
      setLoading(true);
      let user =
        JSON.parse(localStorage.getItem("user")) !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      let response = dispatch(getKeyResultsSingle(user._id));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setData([]);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const fetchPrivileges = () => {
    try {
      setLoading(true);
      let privileges =getItemFromLocalStorage("privileges");
      setPrivileges(privileges);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  
  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("company"));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setUploads(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setUploads([]);
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  const handleDelete = (id) => {
    try {
      let response = dispatch(deletekeyResult(id));
      response.then(({ success, message }) => {
        if (success) {
          refreshData();
          setError("");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    fetchKeyResults();
    fetchUploads();
    fetchPrivileges();
    //eslint-disable-next-line
  }, []);

  const { t } = useTranslation();

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = useMemo(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    return [...filtered].sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder, search]);

  const renderHeaderWithSort = (label, field) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <SwapVertIcon
        style={{ fontSize: 16, color: "#777", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
      />
    </Box>
  );

  const columns = [
    { id: "okrName", label: renderHeaderWithSort("objective", "objective"), render: (row) => row.okrName },
    { id: "keyResultName", label: renderHeaderWithSort("KR", "KR"), render: (row) => row.keyResultName },
    { id: "frequency", label: renderHeaderWithSort("frequency", "frequency"), render: (row) => row.frequency },
    { id: "UOM", label: renderHeaderWithSort("UOM", "UOM"), render: (row) => row.UOM },
    { id: "polarity", label: renderHeaderWithSort("polarity", "polarity"), render: (row) => row.polarity },
    {
      id: "targetDate",
      label: renderHeaderWithSort("targetDate", "targetDate"),
      render: (row) => new Date(row.targetDate).toLocaleDateString(),
    },
    {
      id: "actualDate",
      label: renderHeaderWithSort("actualDate", "actualDate"),
      render: (row) => new Date(row.actualDate).toLocaleDateString(),
    },
    { id: "target", label: renderHeaderWithSort("target", "target"), render: (row) => row.target },
    { id: "actual", label: renderHeaderWithSort("actual", "actual"), render: (row) => row.actual },
    {
      id: "progress",
      label:"progress",
      width: 160,
      render: (row) => {
        const { label, color, backgroundColor } = getProgressLabel(
          row.progress
        );
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1.5}
          >
            <Box sx={{ display: "flex", gap: "5px" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: backgroundColor,
                  fontFamily: "Work Sans",
                }}
              >
                {row.progress}%
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color,
                  padding: "5px",
                  backgroundColor,
                  borderRadius: "50px",
                  fontFamily: "Work Sans",
                }}
              >
                {label}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: 110, height: 11 }}>
              <LinearProgress
                variant="determinate"
                value={row.progress}
                sx={{
                  height: "100%",
                  borderRadius: 50,
                  backgroundColor: "#E0E0E0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor,
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
                  fontSize: "10px",
                  fontFamily: "Work Sans",
                }}
              >
                {row.progress}%
              </Typography>
            </Box>
            <Chip
              label={row.dueDate || "--"}
              size="small"
              sx={{
                backgroundColor: color,
                color: "#FFFFFF",
                height: "17px",
                borderRadius: "100px",
              }}
            />
          </Box>
        );
      },
    },
 {
  id: "action",
  label: <span style={{ fontWeight: 500 }}>Action</span>,
  render: (row) => (
    <ActionDropdown
      row={row}
      actions={[
        ...(privileges?.some(p => p.page === "Key Results" && p.edit) 
          ? [{
              label: "Edit",
              icon: <BorderColorIcon fontSize="small" />,
              onClick: () => onEdit(row),
            }]
          : []),
        {
          label: "Delete",
          icon: <DeleteIcon fontSize="small" />,
          onClick: () => handleDelete(row._id),
        },
      ]}
    />
  ),
}
  ];

  const tableGenerator = (data, length) => {
    // Implement your table generation logic here
    return data;
  };

  return (
    <Box
      sx={{
        margin: "1rem",
        padding: "2rem",
        bgcolor: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        paddingBottom: "70px",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            color: "#0E0E0E",
            fontWeight: "600",
            fontSize: "24px",
            fontFamily: "Montserrat",
            mb: "30px",
            pl: "22px",
          }}
        >
          Asset Management History
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : sortedData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            color: "#777",
            fontSize: "18px",
          }}
        >
          No data found
        </Box>
      ) : (
        <CustomTable
          columns={columns}
          data={sortedData}
          page={page} 
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          search={search}
          setSearch={setSearch}
          onEdit={onEdit}
          // totalPages={totalPages}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          pagination
        />
      )}
    </Box>
  );
};

export default LeaveTable1;