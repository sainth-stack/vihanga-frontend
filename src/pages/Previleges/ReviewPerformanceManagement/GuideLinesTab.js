import React, { useState } from "react";
import { useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import StarIcon from "@mui/icons-material/Star";

// Import MUI components from vihanga/components
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import CustomTable from "pages/vihanga/components/CustomTable";
import CustomButton from "pages/vihanga/components/Button/CustomButton";
import { useTranslation } from "react-i18next";

// import "./style.scss";

const GuideLinesTab = ({ templates, performance, setTemplateInfo }) => {
  const { t } = useTranslation();
  const templateData = templates;
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("Status All");

  const _options = [
    {
      key: t("GuideLinesTab.Options.Calibration"),
      label: t("GuideLinesTab.Options.Calibration"),
      value: "Calibration",
    },
    {
      key: t("GuideLinesTab.Options.SelfSubmission"),
      label: t("GuideLinesTab.Options.SelfSubmission"),
      value: "Self Submission",
    },
    {
      key: t("GuideLinesTab.Options.ManagerReview"),
      label: t("GuideLinesTab.Options.ManagerReview"),
      value: "Manager Review",
    },
    {
      key: t("GuideLinesTab.Options.ManagerSignOff"),
      label: t("GuideLinesTab.Options.ManagerSignOff"),
      value: "Manager SignOff",
    },
    {
      key: t("GuideLinesTab.Options.EmployeeSignOff"),
      label: t("GuideLinesTab.Options.EmployeeSignOff"),
      value: "Employee SignOff",
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Default rating scale if none is provided
  const defaultRatingScale = [
    { score: 1, label: t("GuideLinesTab.RatingScale.Ineffective") },
    { score: 2, label: t("GuideLinesTab.RatingScale.SomewhatAchieved") },
    { score: 3, label: t("GuideLinesTab.RatingScale.Achieved") },
    { score: 4, label: t("GuideLinesTab.RatingScale.Overperformed") },
    { score: 5, label: t("GuideLinesTab.RatingScale.Outstanding") },
  ];

  // Sample data to match the image
  const sampleTemplates = [
    { id: 1, name: "Tempt 2", isPrimary: false },
    { id: 2, name: "Suncal Template VTI", isPrimary: false },
    { id: 3, name: "Maxilera", isPrimary: true },
    { id: 4, name: "Template 4", isPrimary: false },
    { id: 5, name: "Template 5", isPrimary: false },
    { id: 6, name: "Template 6", isPrimary: false },
  ];

  useEffect(() => {
    if (performance && performance.length > 0) {
      // Map the performance data to match the expected table structure
      const mappedPerformanceData = performance.map((item, index) => ({
        id: index, // Ensure each row has a unique id
        templateName: item.templateName, // Keep the template ID
        templateId: item.templateName,
        step: item.step || t("GuideLinesTab.DefaultStep"),
        routingStep: item.step || t("GuideLinesTab.Options.Calibration"),
        ratingScale: item.ratingScale || defaultRatingScale,
        overallFormRating: item.overallFormRating || [],
        displayOptions: item.displayOptions || [],
        displaySteps: item.displaySteps || [],
        isPrimary: item.isPrimary || false,
      }));
      setData(mappedPerformanceData);
      setTotalPages(Math.ceil(mappedPerformanceData.length / rowsPerPage));
    } else if (templates && templates.length > 0) {
      let updatedData = templates.map((item, index) => {
        // Check if ratingScale exists and has scores, otherwise use default
        const ratingScale = item.ratingScale?.scores || defaultRatingScale;

        let formattedRating = ratingScale.map((score, index) => {
          return {
            rating: score.score,
            ratingLabel: score.label,
            distribution: "",
            key: score.label,
            label: score.label,
            value: score.score,
          };
        });
        return {
          id: index,
          templateName: item.templateName,
          templateId: item.value,
          step: item.displaySteps?.[0]?.value || _options[0].value,
          routingStep:
            item.displaySteps?.[0]?.value ||
            t("GuideLinesTab.Options.Calibration"),
          ratingScale: ratingScale,
          overallFormRating: formattedRating,
          displayOptions: item.displayOptions || [],
          displaySteps: item.displaySteps || [],
          isPrimary: item.isPrimary || false,
        };
      });
      setData(updatedData);
      setTemplateInfo(updatedData);
      setTotalPages(Math.ceil(updatedData.length / rowsPerPage));
    } else {
      // Use sample data if no templates available
      const sampleData = sampleTemplates.map((item, index) => ({
        id: index,
        templateName: item.name,
        step: t("GuideLinesTab.DefaultStep"),
        routingStep: t("GuideLinesTab.Options.Calibration"),
        isPrimary: item.isPrimary,
      }));
      setData(sampleData);
      setTotalPages(Math.ceil(sampleData.length / rowsPerPage));
    }
  }, [templates, performance, setTemplateInfo, rowsPerPage, t]);

  const handleChange = ({ target: { name, value } }, index) => {
    let updatedData = [...data];
    updatedData[index][name] = value;
    setData(updatedData);
    setTemplateInfo(updatedData);
  };

  const handleChangeRating = ({ target: { name, value } }, index) => {
    let updatedData = [...data];
    if (
      updatedData[selectedIndex] &&
      updatedData[selectedIndex].overallFormRating
    ) {
      updatedData[selectedIndex].overallFormRating[index][name] = value;
      setData(updatedData);
      setTemplateInfo(updatedData);
    }
  };

  useEffect(() => {}, [selectedIndex]);

  const handleUpdate = () => {
    if (performance && performance.length > 0) {
      setData(performance);
    } else if (templates && templates.length > 0) {
      let updatedData = templates.map((item, index) => {
        return {
          id: index,
          templateName: item.value,
          step: _options[0].value,
          ratingScale: item.ratingScale || defaultRatingScale,
          overallFormRating: [
            {
              rating: 1,
              ratingLabel: t("GuideLinesTab.RatingScale.Ineffective"),
              distribution: "",
            },
            {
              rating: 2,
              ratingLabel: t("GuideLinesTab.RatingScale.SomewhatAchieved"),
              distribution: "",
            },
            {
              rating: 3,
              ratingLabel: t("GuideLinesTab.RatingScale.Achieved"),
              distribution: "",
            },
            {
              rating: 4,
              ratingLabel: t("GuideLinesTab.RatingScale.Overperformed"),
              distribution: "",
            },
            {
              rating: 5,
              ratingLabel: t("GuideLinesTab.RatingScale.Outstanding"),
              distribution: "",
            },
          ],
        };
      });
      setData(updatedData);
      setTemplateInfo(updatedData);
      setTotalPages(Math.ceil(updatedData.length / rowsPerPage));
    }
  };

  // Function to get template display name from template ID
  const getTemplateDisplayName = (templateId) => {
    if (!templates || !Array.isArray(templates)) return templateId;
    const template = templates.find(
      (t) => t.value === templateId || t._id === templateId
    );
    return template ? template.templateName : templateId;
  };

  // Custom handler for templateName select change
  const handleChangeTemplateName = (e, rowId) => {
    const { value } = e.target;
    let updatedData = [...data];
    const rowIndex = updatedData.findIndex((row) => row.id === rowId);

    if (rowIndex !== -1) {
      updatedData[rowIndex].templateName = value;
      setData(updatedData);
      setTemplateInfo(updatedData);
    }
  };

  const columns = [
    {
      id: "templateName",
      label: t("GuideLinesTab.Table.Template"),
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SelectComponent
            id={`template-${row.id}`}
            name="templateName"
            placeholder={t("GuideLinesTab.Placeholders.SelectTemplate")}
            options={(templates || []).map((t) => ({
              key: t.value || t._id,
              value: t.value || t._id,
              label: t.templateName,
            }))}
            value={row.templateName}
            onChange={(e) => handleChangeTemplateName(e, row.id)}
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
      label: t("GuideLinesTab.Table.RouteMap"),
      render: (row) => (
        <Typography variant="body2" sx={{ color: "#333" }}>
          {row.step}
        </Typography>
      ),
    },
    {
      id: "routingStep",
      label: t("GuideLinesTab.Table.RoutingStep"),
      render: (row) => {
        // Use displaySteps from template data if available, otherwise use default options
        const stepOptions =
          row.displaySteps && row.displaySteps.length > 0
            ? row.displaySteps.map((step) => ({
                key: step.key,
                value: step.value,
                label: step.key,
              }))
            : _options;

        return (
          <SelectComponent
            id={`routing-${row.id}`}
            name="routingStep"
            placeholder={t("GuideLinesTab.Placeholders.SelectStep")}
            options={stepOptions}
            value={row.routingStep || t("GuideLinesTab.Options.Calibration")}
            onChange={(e) => handleChange(e, row.id)}
            sx={{ minWidth: "200px" }}
          />
        );
      },
    },
    {
      id: "info",
      label: "",
      render: (row) => (
        <Typography
          variant="body2"
          sx={{ color: "#707070", cursor: "pointer" }}
        >
          i
        </Typography>
      ),
    },
  ];

  const handleExport = () => {
    const exportData = data.map((item) => ({
      Template: item.templateName,
      "Route Map": item.step,
      "Routing Step":
        item.routingStep || t("GuideLinesTab.Options.Calibration"),
    }));

    const csvContent = [
      Object.keys(exportData[0] || {}).join(","),
      ...exportData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "calibration_templates.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      sx={{
        mt: 3,
        backgroundColor: "#fff",
        p: 3,
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Typography variant="body2" sx={{ color: "#707070", mb: 2 }}>
        {t("GuideLinesTab.Instructions.SelectDataSource")}
      </Typography>

      <FormControlLabel
        control={<Checkbox defaultChecked />}
        label={
          <Typography variant="h6" sx={{ color: "#333", fontWeight: 500 }}>
            {t("GuideLinesTab.Performance.Title")}
          </Typography>
        }
      />

      <Box sx={{ ml: 4, mt: 2 }}>
        <Typography variant="body2" sx={{ color: "#707070", mb: 2 }}>
          {t("GuideLinesTab.Performance.Description")}
        </Typography>

        <Box sx={{ width: "100%" }}>
          <CustomTable
            data={data}
            columns={columns}
            loading={false}
            search={searchKey}
            setSearch={setSearchKey}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalPages={totalPages}
            pagination={true}
            onExport={handleExport}
            sx={{
              tableSx: {
                border: "1px solid #E9EAEC",
                borderRadius: "10px",
              },
              headerSx: {
                backgroundColor: "#F8F9FA",
              },
              rowSx: {
                "&:hover": {
                  backgroundColor: "#F8F9FA",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GuideLinesTab;
