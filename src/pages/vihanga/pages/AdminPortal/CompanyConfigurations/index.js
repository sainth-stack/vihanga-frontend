import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import { getCompanies, getCompanyConfig, updateCompanyConfig } from "action/CompanyAct";
import { LoadingIndicator } from "utilities";
import { getThemeColors } from "utilities/getThemeColors";

const defaultConfig = {
  googleSheetEnable: false,
  googleSheetEditURL: "",
  revampCascade: false,
  apiBaseURL: "", // optional: e.g. https://vihanga.talentspotifyapp.com — used for Apps Script webhook URL when set
};

const CompanyConfigurations = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { primaryColor } = getThemeColors();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [configJson, setConfigJson] = useState(JSON.stringify(defaultConfig, null, 2));
  const [configError, setConfigError] = useState("");
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const loadCompanies = useCallback(() => {
    setLoadingCompanies(true);
    setFetchError("");
    dispatch(getCompanies())
      .then(({ data }) => {
        if (data?.length) {
          setCompanies(data);
          setSelectedCompany((prev) => prev || data[0]);
        } else {
          setCompanies([]);
        }
      })
      .catch(() => setFetchError("Failed to load companies"))
      .finally(() => setLoadingCompanies(false));
  }, [dispatch]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  useEffect(() => {
    if (!selectedCompany?._id) {
      setConfigJson(JSON.stringify(defaultConfig, null, 2));
      setConfigError("");
      return;
    }
    setLoadingConfig(true);
    dispatch(getCompanyConfig(selectedCompany._id))
      .then(({ data }) => {
        const config = data?.config && typeof data.config === "object" ? data.config : defaultConfig;
        setConfigJson(JSON.stringify(config, null, 2));
        setConfigError("");
      })
      .catch(() => {
        setConfigJson(JSON.stringify(defaultConfig, null, 2));
        setConfigError("Failed to load config");
      })
      .finally(() => setLoadingConfig(false));
  }, [selectedCompany?._id, dispatch]);

  const validateJson = (str) => {
    if (!str || !str.trim()) return "Config cannot be empty";
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === "object" && parsed !== null ? null : "Config must be a JSON object";
    } catch (e) {
      return e.message || "Invalid JSON";
    }
  };

  const handleSave = () => {
    const err = validateJson(configJson);
    if (err) {
      setConfigError(err);
      return;
    }
    if (!selectedCompany?._id) return;
    setConfigError("");
    setSaving(true);
    const config = JSON.parse(configJson);
    dispatch(updateCompanyConfig(selectedCompany._id, config))
      .then(() => setSaving(false))
      .catch(() => setSaving(false));
  };

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setConfigJson(value);
    setConfigError(validateJson(value));
  };

  return (
    <Box sx={{ fontFamily: "Work Sans, sans-serif" }}>
      {/* Page header - aligned with Admin Center */}
      <Box sx={{ marginTop: "30px", marginBottom: "50px", marginLeft: "100px", paddingRight: "100px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <IconButton
            onClick={() => history.push("/admin/previlages/AdminCenter")}
            size="small"
            sx={{
              color: "#707070",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.04)", color: primaryColor || "#8A8543" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              color: "#0E0E0E",
              fontSize: "40px",
              fontWeight: 600,
              fontFamily: "Montserrat",
              marginBottom: "10px",
            }}
          >
            Company Configurations
          </Typography>
        </Box>
        <Typography
          sx={{
            color: "#707070",
            fontWeight: 400,
            fontSize: "20px",
            fontFamily: "Work Sans",
            marginBottom: "30px",
          }}
        >
          Select a company and edit its feature configuration (e.g. googleSheetEnable, googleSheetEditURL). Config is stored per company and loaded on login.
        </Typography>
      </Box>

      {/* Content area - same padding as Admin Center grid */}
      <Box sx={{ paddingLeft: "100px", paddingRight: "100px", marginBottom: "50px" }}>
        {fetchError && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              fontFamily: "Work Sans",
              "& .MuiAlert-message": { fontFamily: "Work Sans" },
            }}
          >
            {fetchError}
          </Alert>
        )}

        {loadingCompanies && companies.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <LoadingIndicator size="3" />
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 3,
              boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
              p: 4,
              fontFamily: "Work Sans, sans-serif",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: 600,
                    fontSize: "24px",
                    color: "#0E0E0E",
                    mb: 2,
                  }}
                >
                  Companies
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {companies.length === 0 ? (
                    <Typography sx={{ fontFamily: "Work Sans", color: "#707070", fontSize: "16px" }}>
                      No companies found
                    </Typography>
                  ) : (
                    companies.map((c) => {
                      const isSelected = selectedCompany?._id === c._id;
                      return (
                        <Card
                          key={c._id}
                          onClick={() => setSelectedCompany(c)}
                          sx={{
                            cursor: "pointer",
                            border: isSelected ? 2 : 1,
                            borderColor: isSelected ? primaryColor || "#8A8543" : "#E0E0E0",
                            borderRadius: "12px",
                            boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                            "&:hover": {
                              backgroundColor: "rgba(131, 127, 57, 0.06)",
                              borderColor: primaryColor || "#8A8543",
                            },
                          }}
                        >
                          <CardContent sx={{ py: 2, "&:last-child": { pb: 2 }, px: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <SettingsIcon
                                sx={{
                                  fontSize: 22,
                                  color: isSelected ? primaryColor || "#8A8543" : "#707070",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontFamily: "Work Sans",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  color: "#0E0E0E",
                                }}
                              >
                                {c.companyEntityName || c._id}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                {selectedCompany && (
                  <>
                    <Typography
                      sx={{
                        fontFamily: "Montserrat",
                        fontWeight: 600,
                        fontSize: "24px",
                        color: "#0E0E0E",
                        mb: 1.5,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Config JSON — {selectedCompany.companyEntityName}
                      {loadingConfig && (
                        <CircularProgress size={18} sx={{ ml: 1.5, color: primaryColor || "#8A8543" }} />
                      )}
                    </Typography>
                    {configError && (
                      <Alert
                        severity="warning"
                        sx={{
                          mb: 2,
                          fontFamily: "Work Sans",
                          "& .MuiAlert-message": { fontFamily: "Work Sans" },
                        }}
                      >
                        {configError}
                      </Alert>
                    )}
                    <TextField
                      fullWidth
                      multiline
                      minRows={16}
                      maxRows={28}
                      value={configJson}
                      onChange={handleJsonChange}
                      placeholder='{"googleSheetEnable": false, "googleSheetEditURL": ""}'
                      sx={{
                        fontFamily: "Work Sans",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#fff",
                          fontFamily: "monospace",
                          fontSize: "14px",
                          alignItems: "flex-start",
                          "& fieldset": { borderColor: "#E0E0E0" },
                          "&:hover fieldset": { borderColor: primaryColor || "#8A8543" },
                          "&.Mui-focused fieldset": { borderColor: primaryColor || "#8A8543", borderWidth: 2 },
                        },
                      }}
                    />
                    <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
                      <Button
                        variant="outlined"
                        onClick={() => history.push("/admin/previlages/AdminCenter")}
                        disabled={saving}
                        sx={{
                          color: primaryColor || "#B0B57D",
                          borderColor: primaryColor || "#B0B57D",
                          textTransform: "none",
                          fontWeight: 600,
                          fontFamily: "Work Sans",
                          borderRadius: "20px",
                          "&:hover": {
                            borderColor: primaryColor || "#9EA762",
                            backgroundColor: "rgba(131, 127, 57, 0.06)",
                          },
                        }}
                      >
                        Back to Admin Center
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving || !!validateJson(configJson)}
                        sx={{
                          backgroundColor: primaryColor || "#B0B57D",
                          color: "#fff",
                          textTransform: "none",
                          fontWeight: 600,
                          fontFamily: "Work Sans",
                          borderRadius: "20px",
                          "&:hover": {
                            backgroundColor: primaryColor ? undefined : "#9EA762",
                            filter: primaryColor ? "brightness(0.95)" : undefined,
                          },
                        }}
                      >
                        {saving ? <CircularProgress size={24} color="inherit" /> : "Save config"}
                      </Button>
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CompanyConfigurations;
