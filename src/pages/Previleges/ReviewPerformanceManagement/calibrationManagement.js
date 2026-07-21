import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import CustomTable from "pages/vihanga/components/CustomTable";
import { useTranslation } from "react-i18next";

const CalibrationManagement = ({
  templates,
  performance,
  setTemplateInfo,
  templateInfo,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Newly added missing states
  const [rows, setRows] = useState([]);
  const [distributionRows, setDistributionRows] = useState([]);

  const _options = [
    {
      key: t("CalibrationManagement.Options.Calibration"),
      label: t("CalibrationManagement.Options.Calibration"),
      value: "Calibration",
    },
    {
      key: t("CalibrationManagement.Options.SelfSubmission"),
      label: t("CalibrationManagement.Options.SelfSubmission"),
      value: "Self Submission",
    },
    {
      key: t("CalibrationManagement.Options.ManagerReview"),
      label: t("CalibrationManagement.Options.ManagerReview"),
      value: "Manager Review",
    },
    {
      key: t("CalibrationManagement.Options.ManagerSignOff"),
      label: t("CalibrationManagement.Options.ManagerSignOff"),
      value: "Manager SignOff",
    },
    {
      key: t("CalibrationManagement.Options.EmployeeSignOff"),
      label: t("CalibrationManagement.Options.EmployeeSignOff"),
      value: "Employee SignOff",
    },
  ];

  useEffect(() => {
    const performanceList = Array.isArray(performance?.data?.items)
      ? performance.data.items
      : [];

    if (performanceList.length > 0) {
      setData(performanceList);
      setRows(performanceList);
      return;
    }

    if (Array.isArray(templates) && templates.length > 0) {
      const updatedData = templates.map((item) => {
        const scores = Array.isArray(item?.ratingScale?.scores)
          ? item.ratingScale.scores
          : [];

        return {
          templateName: item.value || "",
          step: _options?.[0]?.value || "",
          ratingScale: scores,
          overallFormRating: scores.map((score) => ({
            rating: score.score,
            ratingLabel: score.label,
            distribution: "",
            key: score.label,
            label: score.label,
            value: score.score,
          })),
        };
      });

      setData(updatedData);
      setRows(updatedData);
      setTemplateInfo(updatedData);
    }
  }, [performance, templates, t]);

  const handleChangeRating = ({ target: { name, value } }, rowIndex) => {
    let updatedData = [...data];
    updatedData[selectedIndex].overallFormRating[rowIndex][name] = value;
    setData(updatedData);
    setRows(updatedData);
    setTemplateInfo(updatedData);
  };

  const handleStepChange = ({ target: { value } }, rowId) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, step: value } : row
    );
    setRows(updatedRows);
    setData(updatedRows);
    setTemplateInfo(updatedRows);
  };

  const handleDeleteRow = (rowId) => {
    const updatedRows = rows.filter((row) => row.id !== rowId);
    setRows(updatedRows);
    setData(updatedRows);
    setTemplateInfo(updatedRows);
  };

  const columns = [
    {
      id: "sn",
      label: t("CalibrationManagement.Table.SNo"),
      render: (row) => (
        <Typography sx={{ color: "#333", paddingRight: "30px" }}>
          {row.id}
        </Typography>
      ),
    },
    {
      id: "rating",
      label: t("CalibrationManagement.Table.Rating"),
      render: (row, index) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SelectComponent
            id={`template-${row.id}`}
            placeholder={t("CalibrationManagement.Placeholders.SelectTemplate")}
            name="rating"
            options={
              data[selectedIndex]?.ratingScale?.map((score) => ({
                key: score?.label,
                label: score?.label,
                value: score?.score,
              })) || []
            }
            value={row.rating}
            onChangeText={(e) => handleChangeRating(e, index)}
            sx={{ minWidth: "200px" }}
          />
          {row.isPrimary && (
            <StarIcon sx={{ color: "#837F39", fontSize: 20 }} />
          )}
        </Box>
      ),
    },
    {
      id: "routeMap",
      label: t("CalibrationManagement.Table.RouteMap"),
      render: (row) => (
        <InputTextComponent
          sx={{ color: "#333" }}
          value={row.step}
          onChange={(e) => handleStepChange(e, row.id)}
        />
      ),
    },
    {
      id: "delete",
      label: t("CalibrationManagement.Table.Delete"),
      render: (row) => (
        <IconButton onClick={() => handleDeleteRow(row.id)}>
          <DeleteIcon sx={{ color: "#707070", cursor: "pointer" }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Card
        sx={{
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          width: "100%",
          height: "100%",
          p: 2,
          borderRadius: "16px",
          background: "#fff",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontSize: "16px",
            fontWeight: "400",
            color: "#707070",
          }}
          component="span"
        >
          {t("CalibrationManagement.Notes.Part1")}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontSize: "16px",
            fontWeight: "400",
          }}
          component="span"
          color="#DB5930"
        >
          {t("CalibrationManagement.Notes.Part2")}
        </Typography>

        <Box sx={{ marginTop: "30px" }}>
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontWeight: "400",
              fontSize: "16px",
              color: "#707070",
            }}
          >
            {t("CalibrationManagement.Instructions.SelectElement")}
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", padding: 2, marginTop: "30px" }}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Checkbox
              sx={{
                color: "#837F39",
                "&.Mui-checked": {
                  color: "#837F39",
                },
              }}
            />
            <Typography
              sx={{
                color: "#0E0E0E",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "Montserrat",
              }}
            >
              {t("CalibrationManagement.OverallFormRating")}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#837F39",
              color: "#FFFFFF",
              fontFamily: "Work Sans",
              "&:hover": {
                backgroundColor: "#6f6c2f",
              },
              borderRadius: "999px",
              textTransform: "none",
            }}
          >
            {t("CalibrationManagement.Buttons.Add")}
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <CustomTable
            columns={columns}
            data={rows}
            pagination={true}
            totalPages={totalPages}
            setRowsPerPage={setRowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            setPage={setPage}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default CalibrationManagement;
