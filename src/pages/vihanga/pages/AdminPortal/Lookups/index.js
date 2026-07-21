 // src/LookUpsPage.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import LookupsForm from "./form";
import { Box, Typography, IconButton, Card, Button } from "@mui/material";
import CustomTable from "../../../components/CustomTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Toast } from "../../../../../service/toast";
import { appURL, companyId } from "utilities";
import { useTranslation } from 'react-i18next';
import { canEdit, canDelete } from "utilities/privilegeHelper";

function LookUpsPage() {
  const [lookups, setLookups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { t } = useTranslation();
  const [search,setSearch]=useState("")

  const fetchLookups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${appURL}/getAllLookupsByCompany`, {
        params: { companyId }
      });
      const items = Array.isArray(response.data?.data) ? response.data.data : response.data;
      setLookups(items || []);
    } catch (err) {
      setError("Failed to load lookups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`${appURL}/deleteLookups/${id}`, {
        params: { companyId }
      });
      Toast({ type: "success", message: "Lookup deleted successfully" });
      fetchLookups();
    } catch (err) {
      Toast({ type: "error", message: "Failed to delete lookup" });
    }
  }, [fetchLookups]);
console.log('Type:', t('LookUpScreen.Type'));

  const columns = useMemo(() => [
    {
      id: "lookType",
      label: t("LookUpScreen.Type"),
    },
    {
      id: "meaning",
      label: t("LookUpScreen.Meaning"), 
    },
    {
      id: "actions",
      label: t("LookUpScreen.Actions"),  
      render: (row) => {
        const actions = [];
        
        if (canEdit()) {
          actions.push(
            <Button
              key="edit"
              onClick={() => setEditData(row)}
              sx={{ minWidth: "auto", color: "#837F39" }}
            >
              <EditIcon fontSize="small" />
            </Button>
          );
        }
        
        if (canDelete()) {
          actions.push(
            <Button
              key="delete"
              onClick={() => handleDelete(row._id)}
              sx={{ minWidth: "auto", color: "#d32f2f" }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          );
        }
        
        return actions.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            {actions}
          </Box>
        ) : null;
      }
    }
  ], [handleDelete]);

  const handleSuccess = useCallback(() => {
    setEditData(null);
    fetchLookups();
  }, [fetchLookups]);

  const pagedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return lookups.slice(start, end);
  }, [lookups, page, rowsPerPage]);

  return (
    <Card
      elevation={2}
      sx={{
        margin: 2,
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2 }}>
        <LookupsForm 
          editData={editData} 
          onSuccess={handleSuccess} 
          onCancel={() => setEditData(null)}
        />
      </Box>

      <Box sx={{ px: 5, pt: 0,pb:2 }}>
        <CustomTable
          columns={columns}
          data={pagedData}
          loading={loading}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={Math.ceil((lookups.length || 0) / rowsPerPage)}
          pagination
          search={search}
          setSearch={setSearch}
        />
      </Box>
    </Card>
  );
}

export default LookUpsPage;
