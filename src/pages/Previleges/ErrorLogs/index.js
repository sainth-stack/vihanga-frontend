/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import TitleHeader from "components/TitleHeader";
import { api } from "service/api";
import { Box, Card, Grid, MenuItem } from "@mui/material";
import CustomTable from "pages/vihanga/components/CustomTable";
import dayjs from "dayjs";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { hiringOptions } from "pages/vihanga/utils/const";
import CustomButton from "pages/vihanga/components/Button/CustomButton";

const columns = [
  { id: "createdAt", label: "Date/Time", width: 140 },
  { id: "module", label: "Module", width: 120 },
  { id: "stage", label: "Stage", width: 140 },
  { id: "statusCode", label: "Status", width: 80 },
  { id: "message", label: "Message", width: 420 },
  { id: "method", label: "Method", width: 90 },
  { id: "path", label: "Path", width: 320 },
  { id: "candidateId", label: "CandidateId", width: 120 },
  { id: "companyId", label: "CompanyId", width: 120 },
];

function ErrorLogs() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [modules, setModules] = useState([]);
  const [stages, setStages] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    module: "Recruitment",
    stage: "all",
    fromDate: dayjs().startOf("day").subtract(7, "day").format("YYYY-MM-DD"),
    toDate: dayjs().endOf("day").format("YYYY-MM-DD"),
    search: "",
  });

  const companyId = useMemo(() => {
    const company = getItemFromLocalStorage("company") || {};
    return company?._id || company?.id || "";
  }, []);

  const fetchFacets = async () => {
    try {
      const resp = await api({
        method: "get",
        api: "error-logs/modules",
      });
      const mods = Array.isArray(resp?.data) ? resp.data : resp;
      setModules(mods || []);
      // set stages for current module
      const mod = (mods || []).find((m) => m.module === filters.module);
      setStages(mod?.stages || []);
    } catch (e) {
      // no-op
    }
  };

  const fetchLogs = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const resp = await api({
        method: "get",
        api: "error-logs",
        params: {
          page: pageIndex + 1,
          limit: rowsPerPage,
          module: filters.module,
          stage: filters.stage,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          search: filters.search,
          companyId,
        },
        status: true,
      });
      const payload = resp?.data || resp;
      const data = Array.isArray(payload?.data) ? payload.data : [];
      setLogs(
        data.map((r, i) => ({
          id: r._id || i + 1,
          createdAt: dayjs(r.createdAt).format("YYYY-MM-DD HH:mm"),
          module: r.module,
          stage: r.stage,
          statusCode: r.statusCode,
          message: r.message,
          method: r.method,
          path: r.path,
          candidateId: r.candidateId,
          companyId: r.companyId,
        }))
      );
      setTotalPages(payload?.totalPages || 0);
    } catch (e) {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (filters.search === "") {
      setPage(0);
      fetchLogs(0);
    }
  }, [filters.search]);

  useEffect(() => {
    fetchLogs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const onChangeModule = (val) => {
    const mod = (modules || []).find((m) => m.module === val);
    setStages(mod?.stages || []);
    setFilters((s) => ({ ...s, module: val, stage: "all" }));
  };

  const onApply = () => {
    setPage(0);
    fetchLogs(0);
  };

  return (
    <Box p={2}>
      <TitleHeader title="Error Logs" />
      <Card
        sx={{
          p: 2,
          mb: 2,
          boxShadow: "none",
          borderRadius: "16px",
          border: "1px solid #E9EAEC",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <InputTextComponent
              id="fromDate"
              label="From"
              type="date"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters((s) => ({ ...s, fromDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputTextComponent
              id="toDate"
              label="To"
              type="date"
              value={filters.toDate}
              onChange={(e) =>
                setFilters((s) => ({ ...s, toDate: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SelectComponent
              id="module"
              label="Module"
              value={filters.module}
              onChange={(e) => onChangeModule(e.target.value)}
              options={[
                ...((modules || []).map((m) => ({
                  value: m.module,
                  label: m.module,
                })) || []),
                { value: "Recruitment", label: "Recruitment" },
                { value: "General", label: "General" },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <SelectComponent
              id="stage"
              label="Stage"
              value={filters.stage}
              onChange={(e) =>
                setFilters((s) => ({ ...s, stage: e.target.value }))
              }
              options={[
                { value: "all", label: "All" },
                // Prefer common recruitment statuses if module is Recruitment,
                // otherwise fall back to server-reported stages.
                ...(
                  (filters.module === "Recruitment"
                    ? (hiringOptions || []).map((o) => o)
                    : (stages || []).filter(Boolean).map((s) => ({
                        value: s,
                        label: s,
                      }))) || []
                ),
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputTextComponent
              id="search"
              label="Search text"
              value={filters.search}
              onChange={(e) =>
                setFilters((s) => ({ ...s, search: e.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} md={3} display="flex" alignItems="center">
            <CustomButton
              text="Apply"
              onClick={onApply}
              color="#FFFFFF"
              backgroundColor="#837F39"
              hoverColor="#99965E"
              sx={{
                boxShadow: "none !important",
                "&:hover": { boxShadow: "none !important" },
              }}
            />
          </Grid>
        </Grid>
      </Card>

      <Card
        sx={{
          p: 1,
          boxShadow: "none",
          borderRadius: "16px",
          border: "1px solid #E9EAEC",
          backgroundColor: "#FFFFFF",
        }}
      >
        <CustomTable
          data={logs}
          columns={columns}
          loading={loading}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          search={filters.search}  
          setSearch={(val) =>
              setFilters((s) => ({ ...s, search: val }))
            }        />
      </Card>
    </Box>
  );
}

export default ErrorLogs;


