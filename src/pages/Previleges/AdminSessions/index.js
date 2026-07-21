import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { api } from "service/api";
import { exportToCSV } from "utilities/ExportFunctions";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import CardWidget from "../../vihanga/components/Cards/CardWidget";
import CustomTable from "../../vihanga/components/CustomTable";

export default function AdminSessions() {
  const [activeTab, setActiveTab] = useState("active");
  const [activeSessions, setActiveSessions] = useState([]);
  const [notActiveEmployees, setNotActiveEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyRows, setHistoryRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [activityRows, setActivityRows] = useState([]);
  const [activityTotalPages, setActivityTotalPages] = useState(0);
  // Map to Recruitment filter keys to reuse existing header and filter component
  const [filters, setFilters] = useState({
    candidateId: "",
    candidateName: "",
    department: [],
    position: [],
    stage: [],
    fromDate: "",
    toDate: "",
  });

  const companyId = useMemo(() => {
    return getItemFromLocalStorage("companyId");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activeRes, notActiveRes] = await Promise.all([
          api({ method: "get", api: `sessions/active/${companyId}` }),
          api({ method: "get", api: `sessions/not-active/${companyId}` }),
        ]);
        setActiveSessions(activeRes?.data || []);
        setNotActiveEmployees(notActiveRes?.data || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    if (companyId) fetchData();
  }, [companyId]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!companyId || activeTab !== "history") return;
      setLoading(true);
      try {
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search,
          candidateId: filters.candidateId,
          candidateName: filters.candidateName,
          department: filters.department,
          position: filters.position,
          stage: filters.stage,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        };
        const res = await api({ method: "get", api: `sessions/history/${companyId}`, params });
        setHistoryRows(res?.data || []);
        setTotalPages(res?.totalPages || 0);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [companyId, activeTab, page, rowsPerPage, search, filters]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!companyId || activeTab !== "activity") return;
      setLoading(true);
      try {
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          search,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        };
        const res = await api({ method: "get", api: `sessions/activity/${companyId}`, params });
        setActivityRows(res?.data || []);
        setActivityTotalPages(res?.totalPages || 0);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [companyId, activeTab, page, rowsPerPage, search, filters.fromDate, filters.toDate]);

  const columnsActive = [
    { id: "empId", label: "Emp. Id", sortable: true },
    { id: "name", label: "Name", sortable: true },
    { id: "designation", label: "Designation", sortable: true },
    { id: "department", label: "Function", sortable: true },
    { id: "location", label: "Location", sortable: true },
    { id: "loginAt", label: "Login At", sortable: true, render: (r) => r.loginAt ? new Date(r.loginAt).toLocaleString() : "" },
    { id: "logoutAt", label: "Logout At", sortable: true, render: (r) => r.logoutAt ? new Date(r.logoutAt).toLocaleString() : "" },
    { id: "status", label: "Status", sortable: true },
  ];

  const columnsNotActive = [
    { id: "empId", label: "Emp. Id", sortable: true },
    { id: "name", label: "Name", sortable: true },
    { id: "designation", label: "Designation", sortable: true },
    { id: "department", label: "Function", sortable: true },
    { id: "location", label: "Location", sortable: true },
  ];

  const exportRows = (rows) => {
    exportToCSV(rows.map((r) => ({
      // Force Excel to keep leading zeros by exporting as a formula string
      empId: r.empId != null && r.empId !== "" ? `="${String(r.empId)}"` : "",
      name: r.name || "",
      designation: r.designation || "",
      department: r.department || "",
      location: r.location || "",
      ...(r.loginAt !== undefined ? { loginAt: r.loginAt ? new Date(r.loginAt).toLocaleString() : "" } : {}),
      ...(r.logoutAt !== undefined ? { logoutAt: r.logoutAt ? new Date(r.logoutAt).toLocaleString() : "" } : {}),
      ...(r.status !== undefined ? { status: r.status || "" } : {}),
    })));
  };

  const exportHistoryAll = async () => {
    try {
      const params = {
        page: 1,
        limit: 100000,
        search,
        candidateId: filters.candidateId,
        candidateName: filters.candidateName,
        department: filters.department,
        position: filters.position,
        stage: filters.stage,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };
      const res = await api({ method: "get", api: `sessions/history/${companyId}`, params });
      exportRows(res?.data || []);
    } catch (e) {}
  };

  const exportActivityAll = async () => {
    try {
      const params = {
        page: 1,
        limit: 100000,
        search,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };
      const res = await api({ method: "get", api: `sessions/activity/${companyId}`, params });
      exportRows(res?.data || []);
    } catch (e) {}
  };

  const headerBar = (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant={activeTab === "active" ? "contained" : "outlined"}
          onClick={() => setActiveTab("active")}
          sx={{
            textTransform: "none",
            borderRadius: "5rem",
            backgroundColor: activeTab === "active" ? "#85803c" : "transparent",
            color: activeTab === "active" ? "#fff" : "#85803c",
            borderColor: "#85803c",
            '&:hover': { backgroundColor: activeTab === "active" ? "#6f6a30" : "transparent" }
          }}
        >
          Active Sessions
        </Button>
        <Button
          variant={activeTab === "notactive" ? "contained" : "outlined"}
          onClick={() => setActiveTab("notactive")}
          sx={{
            textTransform: "none",
            borderRadius: "5rem",
            backgroundColor: activeTab === "notactive" ? "#85803c" : "transparent",
            color: activeTab === "notactive" ? "#fff" : "#85803c",
            borderColor: "#85803c",
            '&:hover': { backgroundColor: activeTab === "notactive" ? "#6f6a30" : "transparent" }
          }}
        >
          Not Active Users
        </Button>
        <Button
          variant={activeTab === "history" ? "contained" : "outlined"}
          onClick={() => setActiveTab("history")}
          sx={{
            textTransform: "none",
            borderRadius: "5rem",
            backgroundColor: activeTab === "history" ? "#85803c" : "transparent",
            color: activeTab === "history" ? "#fff" : "#85803c",
            borderColor: "#85803c",
            '&:hover': { backgroundColor: activeTab === "history" ? "#6f6a30" : "transparent" }
          }}
        >
          History
        </Button>
        <Button
          variant={activeTab === "activity" ? "contained" : "outlined"}
          onClick={() => setActiveTab("activity")}
          sx={{
            textTransform: "none",
            borderRadius: "5rem",
            backgroundColor: activeTab === "activity" ? "#85803c" : "transparent",
            color: activeTab === "activity" ? "#fff" : "#85803c",
            borderColor: "#85803c",
            '&:hover': { backgroundColor: activeTab === "activity" ? "#6f6a30" : "transparent" }
          }}
        >
          Activity Export
        </Button>
      </Box>
    </Box>
  );

  const toolRow = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, pb: 1 }}>
      <input
        type="date"
        value={filters.fromDate}
        onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
        style={{ border: "1px solid #837F39", borderRadius: "40px", padding: "8px 12px" }}
      />
      <input
        type="date"
        value={filters.toDate}
        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
        style={{ border: "1px solid #837F39", borderRadius: "40px", padding: "8px 12px" }}
      />
      <input
        placeholder="Search here.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ flex: 1, border: "1px solid #837F39", borderRadius: "40px", padding: "8px 14px" }}
      />
      <Button
        onClick={() => (activeTab === "history" ? exportHistoryAll() : exportActivityAll())}
        sx={{ textTransform: "none", color: "#fff", backgroundColor: "#85803c", borderRadius: "5rem", padding: ".5rem 1rem", '&:hover': { backgroundColor: "#6f6a30" } }}
      >
        Export
      </Button>
    </Box>
  );

  return (
    <CardWidget sx={{ mt: 2 }}>
      {activeTab === "history" ? (
        <CustomTable
          header={<Box>{headerBar}{toolRow}</Box>}
          showHeader={false}
          onExport={exportHistoryAll}
          columns={[
            { id: "empId", label: "Emp. Id", sortable: true },
            { id: "name", label: "Name", sortable: true },
            { id: "designation", label: "Designation", sortable: true },
            { id: "department", label: "Function", sortable: true },
            { id: "location", label: "Location", sortable: true },
            { id: "loginAt", label: "Login At", sortable: true, render: (r) => r.loginAt ? new Date(r.loginAt).toLocaleString() : "" },
            { id: "logoutAt", label: "Logout At", sortable: true, render: (r) => r.logoutAt ? new Date(r.logoutAt).toLocaleString() : "" },
            { id: "status", label: "Status", sortable: true },
          ]}
          data={historyRows}
          loading={loading}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          skipInternalFilter
        />
      ) : activeTab === "activity" ? (
        <CustomTable
          header={<Box>{headerBar}{toolRow}</Box>}
          showHeader={false}
          onExport={exportActivityAll}
          columns={[
            { id: "empId", label: "Emp. Id", sortable: true },
            { id: "name", label: "Name", sortable: true },
            { id: "designation", label: "Designation", sortable: true },
            { id: "department", label: "Function", sortable: true },
            { id: "location", label: "Location", sortable: true },
            { id: "activityCount", label: "Activity Count", sortable: true },
          ]}
          data={activityRows}
          loading={loading}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={activityTotalPages}
          skipInternalFilter
        />
      ) : (
        <CustomTable
          header={headerBar}
          showHeader={false}
          columns={activeTab === "active" ? columnsActive : columnsNotActive}
          data={activeTab === "active" ? activeSessions : notActiveEmployees}
          loading={loading}
          pagination={false}
        />
      )}
    </CardWidget>
  );
}


