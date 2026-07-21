import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Toast } from "service/toast";

import CustomTable from "../../../../components/CustomTable";
import ActionDropdown from "../../../../components/ActionDropdown/ActionDropdown";
import { assetsService, formatAssetData, showToast } from "../services/assetsService";
import { ASSET_TYPES } from '../constants/assetConstants';
import { canEdit, canDelete } from "utilities/privilegeHelper";

const AssetsManagementTable = ({ onEdit, refreshTable }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const handleDelete = async (row) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    setLoading(true);
    try {
      await assetsService.deleteAsset(row.assetId);
      showToast("Asset deleted successfully", "success");

      // Remove deleted row from state directly
      setData((prevData) => prevData.filter((item) => item.assetId !== row.assetId));
    } catch (err) {
      console.error("Delete Error:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete asset";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async ({
    page: currentPage = 0,
    limit = 10,
    search: searchTerm = "",
    filters: currentFilters = {},
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage + 1,
        limit,
        search: searchTerm,
        ...currentFilters,
      };

      const result = await assetsService.getAssets(params);

      // Group assets by employee and create comma-separated display
      const employeeAssetMap = new Map();

      result.forEach(employee => {
        const { _id, fullName, employeeId, position, workLocation, department, assets = [] } = employee;

        if (assets.length > 0) {
          const assetTypes = assets.map(asset => asset.assetType).join(', ');
          const assetNumbersDisplay = assets.map(asset => asset.assetNumber).join(', ');
          const issueDateDisplay = assets.map(asset =>
            new Date(asset.issueDate).toLocaleDateString()
          ).join(', ');
          const handoverDateDisplay = assets.map(asset =>
            new Date(asset?.handoverDate).toLocaleDateString()
          ).join(', ');
          const firstAssetNumber = parseInt(assets[0].assetNumber) || 0;
          const firstIssueDate = new Date(assets[0].issueDate).getTime();
          const firstHandoverDate = assets[0]?.handoverDate
            ? new Date(assets[0].handoverDate).getTime()
            : 0;

          // For edit functionality, we'll use the first asset's ID
          const firstAssetId = assets[0]._id;

          employeeAssetMap.set(employeeId, {
            _id,
            employeeId,
            fullName,
            position,
            workLocation,
            department,
            assetType: assetTypes,
            assetNumber: firstAssetNumber,      // NUMBER for sorting
            issueDate: firstIssueDate,          // TIMESTAMP for sorting
            handoverDate: firstHandoverDate,    // TIMESTAMP for sorting           
            // ✅ NEW: Display values for UI (formatted strings)
            assetNumberDisplay: assetNumbersDisplay,
            issueDateDisplay: issueDateDisplay,
            handoverDateDisplay: handoverDateDisplay,
            assetId: firstAssetId,
            assets // Keep original assets for editing
          });
        }
      });

      const transformedData = Array.from(employeeAssetMap.values());
      setData(transformedData);
      setTotalPages(Math.ceil(transformedData.length / limit));
    } catch (err) {
      console.error("Fetch Error:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch data";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder, data]);

  useEffect(() => {
    fetchData({ page, limit: rowsPerPage, search: debouncedSearch, filters });
  }, [page, rowsPerPage, debouncedSearch, filters, refreshTable]);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

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
    {
      id: "name",
      label: renderHeaderWithSort(t("AssetsManagementTable.TableHeaders.Name"), "fullName"),
      render: (row) => row.fullName
    },
    {
      id: "employeeId",
      label: renderHeaderWithSort(t("AssetsManagementTable.TableHeaders.EmployeeID"), "employeeId"),
      render: (row) => row.employeeId
    },
    {
      id: "department",
      label: renderHeaderWithSort(t("AssetsManagementTable.TableHeaders.Department"), "department"),
      render: (row) => row.department
    },
    {
      id: "assetType",
      label: renderHeaderWithSort(t("AssetsManagementTable.TableHeaders.AssetType"), "assetType"),
      render: (row) => {
        const typeObj = ASSET_TYPES.find(type => type.value === row.assetType);
        const label = typeObj ? typeObj.label : row.assetType;
        return (
          <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
            {label}
          </Box>
        );
      }
    },
    {
      id: "assetNo",
      label: renderHeaderWithSort(t("AssetsManagementTable.TableHeaders.AssetNo"), "assetNumber"),
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.assetNumberDisplay}
        </Box>
      )
    },
    {
      id: "issueDate",
      label: renderHeaderWithSort(t("AssetsManagementTable.TableHeaders.IssueDate"), "issueDate"),
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.issueDateDisplay && !String(row.issueDateDisplay).includes('1970') ? row.issueDateDisplay : ''}
        </Box>
      )
    },
    {
      id: "handoverDate",
      label: renderHeaderWithSort(t("AssetsManagementTable.TableHeaders.HandOverDate"), "handoverDate"),
      render: (row) => (
        <Box sx={{ maxWidth: 200, wordWrap: 'break-word' }}>
          {row.handoverDateDisplay && !String(row.handoverDateDisplay).includes('1970') ? row.handoverDateDisplay : ''}
        </Box>
      )
    },



    {
      id: "action",
      label: <span style={{ fontWeight: 500 }}>{t("AssetsManagementTable.TableHeaders.Action")}</span>,
      render: (row) => {
        const actions = [];

        if (canEdit()) {
          actions.push({
            label: t("AssetsManagementTable.Actions.Edit"),
            icon: <BorderColorIcon fontSize="small" />,
            onClick: () => onEdit(row)
          });
        }

        if (canDelete()) {
          actions.push({
            label: t("AssetsManagementTable.Actions.Delete"),
            icon: <DeleteIcon tabIndex={0} fontSize="small" />,
            onClick: () => handleDelete(row),
          });
        }

        return actions.length > 0 ? (
          <ActionDropdown
            row={row}
            actions={actions}
          />
        ) : null;
      },
    },
  ];



  if (error) {
    return (
      <Box
        sx={{
          margin: "1rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography color="error">{t("AssetsManagementTable.Error")}: {error}</Typography>
      </Box>
    );
  }

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
          {t("AssetsManagementTable.AssetManagementHistory")}
        </Typography>
      </Box>

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
          totalPages={totalPages}
          loading={loading}
          skipInternalFilter={true}
          pagination
        />
      
    </Box>
  );
};

export default AssetsManagementTable;
