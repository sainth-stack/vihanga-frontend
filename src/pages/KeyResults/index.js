import React, { useState, useEffect, useMemo } from "react";
import "./styles.scss";
import paginationFactory from "react-bootstrap-table2-paginator";
import useWindowSize from "components/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { getUploadsByCategory } from "action/UploadAct";
import {
  deletekeyResult,
  getKeyResults,
  getKeyResultsSingle,
} from "action/keyResultAct";
import keyResultsColumns from "./keyResultColumns";
import KeyResultsMobileTable from "./KeyResultMobile/KeyResultMobileTable";
import { keyresults } from "reducer";
import { useTranslation } from "react-i18next";
import CustomTable from "pages/vihanga/components/CustomTable";
import {
  Box,
  Chip,
  LinearProgress,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ActionDropdown from "pages/vihanga/components/ActionDropdown/ActionDropdown";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleTabs from "pages/vihanga/components/commonSwichButtons";
import { useHistory } from "react-router-dom";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      okrName: data[i].okrName,
      keyResultName: data[i].keyResultName,
      frequency: data[i].frequency,
      uom: data[i].uom,
      polarity: data[i].polarity,
      msc: data[i].msc,
      targetDate: data[i].targetDate
        ? window.moment(data[i].targetDate).format("D MMM YYYY")
        : "No Date",
      actualDate: data[i].actualDate
        ? window.moment(data[i].actualDate).format("D MMM YYYY")
        : "No Date",
      target: data[i].target,
      actual: data[i].actual,
      feedAttachment: data[i].feedAttachment,
      objectiveId: data[i].objectiveId,
      dimension: data[i].dimension,
      weight: data[i].weight,
      progress: data[i].progress,
      isAlignedToCompany: data[i].isAlignedToCompany,
      createdAt: data[i].createdAt,
      updatedAt: data[i].updatedAt,
      targetDate1: data[i].targetDate,
    });
  }
  return items;
};

export default function Entity({ companyInfo }) {
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
  const [searchKey, setSearchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [, setProgress] = useState(0);
  const [, setLoaded] = useState(0);
  const [, setTotal] = useState(0);
  const isMobile = useWindowSize();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedTab = JSON.parse(localStorage.getItem("selectedTab")) || null;
  const [selectedSwitch, setSelectedSwitch] = useState(selectedTab?.tab || "me");
  const history = useHistory();
  const samData = () => {
    console.log(data);
    if (kdata.success) {
      fetchKeyResults();
      dispatch(keyresults({ success: false }));
    }
  };

  useEffect(() => {
    samData();
  }, [kdata.success]);

  useEffect(() => {
    fetchUploads();
    fetchPrivileges();
    refreshData();
  }, []);

  useEffect(()=>{
    fetchKeyResults()
  },[selectedSwitch])

  const fetchKeyResults = () => {
    try {
      setLoading(true);
      let user =
        JSON.parse(localStorage.getItem("user")) !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      let response = dispatch(getKeyResultsSingle(user._id,{
        type:selectedSwitch ||'me',
        page:page,
        pageSize:rowsPerPage
      }));
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
        setTotal(0);
        setProgress(0);
        setLoaded(0);
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

  const refreshData = () => {
    try {
    fetchKeyResults()
    } catch (error) {
      setError(error.toString());
    }
  };

  const handleDelete = (row) => {
    try {
      let response = dispatch(deletekeyResult(row._id));
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


  const handleEdit=(row)=>{
    console.log(row,'sdfiusdfhsj')
    history.push(`/admin/objectives/details?isEdit=true&objectiveId=${row?.objectiveId}7&keyResultId=${row?._id}&fromKeyResult=${true}`)
    
  }
  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  useEffect(() => {
    if (sortedData && rowsPerPage) {
      setTotalPages(Math.ceil(sortedData.length / rowsPerPage));
    }
  }, [sortedData, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, page, rowsPerPage]);

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const { t } = useTranslation();
  const getProgressLabel = (progress) => {
    if (progress >= 80)
      return { label: "OnTrack", color: "white", backgroundColor: "#4CAF50" };
    if (progress >= 50)
      return { label: "AtRisk", color: "white", backgroundColor: "#FFC107" };
    return { label: "OffTrack", color: "white", backgroundColor: "#F44336" };
  };
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };
  const renderHeader = (label, field) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <SwapVertIcon
        fontSize="small"
        sx={{ cursor: "pointer", color: "#777" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
      />
    </Box>
  );

  const StatusTextCell = ({ status }) => {
    const lowerStatus = String(status || "").toLowerCase();

    const isActive = lowerStatus === "active";
    const isInactive = lowerStatus === "inactive";

    const getColor = () => {
      if (isActive) return "black";
      if (isInactive) return "black";
      return "black";
    };

    return (
      <Typography
        sx={{
          color: getColor(),
          fontWeight: 400,
          textTransform: "capitalize",
          fontSize: "14px",
          fontFamily: "Work Sans",
        }}
      >
        {status || " "}
      </Typography>
    );
  };

  const columns = [
    {
      id: "okrName",
      label: renderHeader("Objective", "okrName"),
      render: (row) => <StatusTextCell status={row.okrName} />,
    },
    {
      id: "keyResultName",
      label: renderHeader("KR", "keyResultName"),
      render: (row) => <StatusTextCell status={row.keyResultName} />,
    },
    {
      id: "frequency",
      label: renderHeader("FREQUENCY", "frequency"),
      render: (row) => <StatusTextCell status={row.frequency} />,
    },
    {
      id: "UOM",
      label: renderHeader("UOM", "uom"),
      render: (row) => <StatusTextCell status={row.uom} />,
    },
    {
      id: "polarity",
      label: renderHeader("POLARITY", "polarity"),
      render: (row) => <StatusTextCell status={row.polarity} />,
    },

    {
      id: "targetDate",
      label: "TARGETDATE",
      render: (row) => (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={0.5}
        >
          <Chip
            label={row.targetDate}
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
      id: "actualDate",
      label: "ACTUALDATA",
      render: (row) => (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={0.5}
        >
          <Chip
            label={row.actualDate}
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
      id: "target",
      label: renderHeader("TARGET", "target"),
      render: (row) => <StatusTextCell status={row.target} />,
    },
    {
      id: "actual",
      label: renderHeader("ACTUAL", "actual"),
      render: (row) => <StatusTextCell status={row.actual} />,
    },
    {
      id: "progress",
      label: "PROGRESS",
      render: (row) => {
        const cappedProgress = Math.min(row.progress, 100); //
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
                value={Math.min(row.progress, 1000)}
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
            {
              label: "Edit",
              icon: <BorderColorIcon fontSize="small" />,
              onClick: () => handleEdit(row),
            },
            {
              label: "Delete",
              icon: <DeleteIcon fontSize="small" />,
              onClick: () => {
                console.log("---delete --- ", row);
                handleDelete(row);
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{background:'white'}}>
    <Box style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingRight:'10px'}}>
    <Typography variant="h4" sx={{ fontWeight: "bold", m: 4 }}>
        {t("KeyResult.title") && "Key Results"}
      </Typography>
    </Box>

      <Box
        sx={{
          borderRadius: "12px",
          minHeight: "100%",
          padding: "16px",
          margin: "16px",
        }}
      >
        {loading && privileges.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress size={30} />
          </Box>
        ) : error ? (
          <Typography
            variant="body2"
            align="center"
            color="error"
            sx={{ fontSize: 14, margin: 0 }}
          >
            {error}
          </Typography>
        ) : isMobile ? (
          <KeyResultsMobileTable
            privileges={privileges}
            handleDelete={handleDelete}
            refreshData={refreshData}
            title="keyresults"
            data={data}
            columns={keyResultsColumns}
            paginationFactory={paginationFactory}
            searchKey={searchKey}
          />
        ) : (
          // <TableNormal
          //   data={data.filter((item) => {
          //     return (
          //       item?.legalEntityName
          //         ?.toLowerCase()
          //         .indexOf(legalEntitySearch.legalEntityName.toLowerCase()) !==
          //         -1 &&
          //       item?.status?.indexOf(legalEntitySearch.status) !== -1 &&
          //       item?.country
          //         ?.toLowerCase()
          //         .indexOf(legalEntitySearch.country.toLowerCase()) !== -1
          //     );
          //   })}
          //   columns={keyResultsColumns(privileges, handleDelete)}
          //   paginationFactory={paginationFactory}
          //   searchKey={searchKey}
          //   updatepage={updatepage}
          //   keyField="_id"
          //   title="Company"
          // />
          <CustomTable
            columns={columns}
            data={paginatedData}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            search={searchKey}
            setSearch={setSearchKey}
            totalPages={totalPages}
            pagination
          />
        )}
      </Box>
    </div>
  );
}
