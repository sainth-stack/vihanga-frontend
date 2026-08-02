import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { CloudUpload, Edit } from "@mui/icons-material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { Toast } from "service/toast";
import { api } from "service/api";
import { themeApi } from "service/apiVariables";
import { applyThemeToCssVariables } from "theme/applyTheme";
import { useDispatch } from "react-redux";
import { loadAndApplyTheme } from "reducer/themeSlice";
import defaultLogo from "assets/images/AppNewLogo.png";

const companyId =
  localStorage.getItem("companyId") !== null
    ? JSON.parse(localStorage.getItem("companyId"))
    : null;

const initialColors = {
  primary: {
    sectionTitle: "Primary Colors",
    colors: [
      {
        name: "Brown",
        code: "#BEA781",
        description:
          "The primary color is “Brown” color, and is used across all interactive elements such as buttons, links, inputs etc..",
      },
    ],
  },
  secondary: {
    sectionTitle: "Secondary Colors",
    colors: [
      {
        name: "Black",
        code: "#000000",
        description:
          "The color is “Black” color, and is used across Typography.",
      },
      {
        name: "Grey",
        code: "#7B7B7B",
        description:
          "The color is “Grey” color, and is used across Icon and Stroke.",
      },
      {
        name: "White",
        code: "#FFFFFF",
        description:
          "The color is “White” color, and is used background color.",
      },
      {
        name: "Red",
        code: "#E8502F",
        description: "The color is “Red” color, and is used across Alert.",
      },
      {
        name: "Green",
        code: "#9DAA45",
        description:
          "The color is “Green” color, and is used across Successful and completed.",
      },
    ],
  },
};

const hexColorRegex = /^#([0-9A-F]{6}|[0-9A-F]{3})$/i;

const getThemeFromLocalStorage = (companyId) => {
  try {
    if (!companyId) return null;
    const themeKey = `theme_${companyId}`;
    const storedTheme = localStorage.getItem(themeKey);
    if (!storedTheme) return null;
    return JSON.parse(storedTheme);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

const saveThemeToLocalStorage = (companyId, themeData) => {
  try {
    if (!companyId) {
      console.error("CompanyId is required");
      return false;
    }
    const themeKey = `theme_${companyId}`;
    localStorage.setItem(themeKey, JSON.stringify(themeData));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

const ThemeSettings = () => {
  const reduxDispatch = useDispatch();
  const [themeColors, setThemeColors] = useState(initialColors);
  const [themeName, setThemeName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [themeId, setThemeId] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);

  const handleDefaultToggle = (event) => {
    const checked = event.target.checked;
    setIsDefault(checked);
    if (checked) {
      setThemeColors(initialColors);
      // Reset logo to default when enabling default theme
      setLogoFile(null);
      setLogoUrl(defaultLogo);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const fetchTheme = useCallback(async () => {
    try {
      setLoading(true);
      // Try backend first
      if (companyId) {
        try {
          const res = await api(themeApi.getCompanyTheme(companyId));
          const theme = res?.data?.data || res?.data?.theme || res?.data || null;
          if (theme && (theme.primary || theme.secondary)) {
            setThemeId(theme?._id || null);
            setThemeName(theme?.themeName || "");
            setLogoUrl(theme?.logoUrl || defaultLogo);
            setIsDefault(Boolean(theme?.isDefault));
            setThemeColors({
              primary: theme?.primary || initialColors.primary,
              secondary: theme?.secondary || initialColors.secondary,
            });
            // Cache locally for quick re-loads
            saveThemeToLocalStorage(companyId, theme);
            // Apply to CSS variables for app-wide usage
            applyThemeToCssVariables({
              primary: theme?.primary || initialColors.primary,
              secondary: theme?.secondary || initialColors.secondary,
            });
            setLoading(false);
            return;
          }
        } catch (e) {
          // fall back to local cache below
        }
      }

      // Fallback: Local storage cache
      const theme = getThemeFromLocalStorage(companyId);
      if (theme) {
        setThemeId(theme._id || null);
        setThemeName(theme.themeName || "");
        setLogoUrl(theme.logoUrl || defaultLogo);
        setIsDefault(Boolean(theme.isDefault));
        if (theme.primary && theme.secondary) {
          setThemeColors({
            primary: theme.primary,
            secondary: theme.secondary,
          });
          applyThemeToCssVariables({
            primary: theme.primary,
            secondary: theme.secondary,
          });
        }
      } else {
        setThemeId(null);
        setThemeName("");
        setLogoUrl("");
        setIsDefault(false);
        setThemeColors(initialColors);
      }
    } catch (err) {
      console.error("Failed to load theme settings:", err);
      Toast({ type: "error", message: "Failed to load theme settings" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleLogoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setLogoFile(file);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const newObjectUrl = URL.createObjectURL(file);
    objectUrlRef.current = newObjectUrl;
    setLogoUrl(newObjectUrl);
  };

  const handleColorCodeChange = (sectionKey, idx, newCode) => {
    if (isDefault) {
      Toast({
        type: "warning",
        message:
          "Cannot modify colors when default theme is enabled. Please disable default first.",
      });
      return;
    }
    setThemeColors((prev) => {
      let normalized = newCode || "";
      if (normalized && !normalized.startsWith("#")) {
        normalized = `#${normalized}`;
      }
      normalized = normalized.toUpperCase();
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          colors: prev[sectionKey].colors.map((color, colorIdx) =>
            colorIdx === idx ? { ...color, code: normalized } : color
          ),
        },
      };
    });
  };

  const validateColorPalette = () => {
    for (const section of Object.values(themeColors)) {
      if (!section?.colors?.length) {
        Toast({
          type: "error",
          message: `${
            section?.sectionTitle || "Color section"
          } must contain at least one color`,
        });
        return false;
      }
      for (const color of section.colors) {
        if (!hexColorRegex.test(color.code)) {
          Toast({
            type: "error",
            message: `${color.name} in ${section.sectionTitle} has an invalid hex code`,
          });
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!themeName.trim()) {
      Toast({ type: "error", message: "Please enter a theme name" });
      return;
    }
    if (!validateColorPalette()) {
      return;
    }
    if (!companyId) {
      Toast({ type: "error", message: "Company information not found" });
      return;
    }
    try {
      setSaving(true);

      // Upload logo to S3 via backend (multipart).
      // If default theme enabled, clear any custom logo (fallback to app default).
      let uploadedLogoUrl = isDefault ? "" : (logoUrl?.trim?.() || "");
      if (!isDefault && logoFile) {
        const form = new FormData();
        form.append("logo", logoFile);
        form.append("companyId", companyId);
        const uploadRes = await api({ ...themeApi.uploadLogo, body: form });
        uploadedLogoUrl = uploadRes?.data?.url || uploadRes?.url || uploadedLogoUrl;
      }

      const body = {
        companyId,
        themeName: themeName.trim(),
        logoUrl: uploadedLogoUrl,
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        isDefault,
      };

      let response;
      if (themeId) {
        response = await api({
          ...themeApi.updateTheme(themeId),
          body,
          // backend requires companyId in query for update
          params: { companyId },
        });
      } else {
        response = await api({ ...themeApi.createTheme, body });
      }

      const savedTheme = response?.data?.data || response?.data?.theme || response?.data || null;

      const themeData = {
        _id: savedTheme?._id || themeId || `theme-${Date.now()}`,
        companyId,
        themeName: themeName.trim(),
        logoUrl: uploadedLogoUrl,
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        isDefault,
        updatedAt: new Date().toISOString(),
      };

      const saved = saveThemeToLocalStorage(companyId, themeData);
      if (saved) {
        setThemeId(themeData._id);
        // Apply to CSS variables immediately after save
        applyThemeToCssVariables({
          primary: themeColors.primary,
          secondary: themeColors.secondary,
        });
        Toast({
          type: "success",
          message: themeId ? "Theme updated successfully" : "Theme created successfully",
        });
        // refresh redux theme in background
        try {
          reduxDispatch(loadAndApplyTheme(companyId));
        } catch {}
      } else {
        Toast({ type: "error", message: "Failed to save theme" });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setLogoFile(null);
      fetchTheme();
    } catch (err) {
      console.error("Failed to save theme:", err);
      Toast({ type: "error", message: "Failed to save theme" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setThemeName("");
    setLogoUrl("");
    setIsDefault(false);
    setThemeColors(initialColors);
    setThemeId(null);
  };

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "#fff",
        borderRadius: 4,
        fontFamily: "Work Sans, sans-serif",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Work Sans",
          fontWeight: 600,
          fontSize: "32px",
          lineHeight: "100%",
          mb: 3,
        }}
      >
        Theme Settings
      </Typography>

      {loading && (
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <CircularProgress size={20} />
          <Typography sx={{ fontFamily: "Work Sans", color: "#555" }}>
            Loading theme settings...
          </Typography>
        </Box>
      )}

      <Box mb={3}>
        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontWeight: 500,
            fontSize: "16px",
            mb: 1,
          }}
        >
          Theme Name
        </Typography>
        <InputTextComponent
          id="themeName"
          placeholder="Vihanga Classic"
          value={themeName}
          onChange={(event) => setThemeName(event.target.value)}
          sx={{
            maxWidth: "70%",
            fontFamily: "Work Sans",
          }}
        />
      </Box>

      <Box mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={isDefault}
              onChange={handleDefaultToggle}
              color="success"
              disabled={saving}
            />
          }
          label="Set as default theme"
          sx={{
            fontFamily: "Work Sans",
            ".MuiFormControlLabel-label": {
              fontFamily: "Work Sans",
              fontWeight: 500,
              color: "#555",
            },
          }}
        />
        {isDefault && (
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontSize: "14px",
              color: "#666",
              mt: 1,
              ml: 4,
            }}
          >
            ℹ️ Default theme uses predefined colors. Color editing is disabled.
          </Typography>
        )}
      </Box>

      <Box mb={4}>
        <Typography
          sx={{
            fontFamily: "Work Sans",
            fontWeight: 500,
            fontSize: "16px",
            mb: 2,
          }}
        >
          Company Logo
        </Typography>

        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: 2,
              border: "1px dashed #B0B57D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              backgroundColor: "#FAFAFA",
            }}
          >
            {isDefault || logoUrl ? (
              <img
                src={isDefault ? defaultLogo : logoUrl}
                alt="Theme logo"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            ) : (
              <Typography
                sx={{
                  fontFamily: "Work Sans",
                  color: "#707070",
                  fontSize: "14px",
                }}
              >
                No logo selected
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={handleLogoButtonClick}
              disabled={saving || isDefault}
              sx={{
                color: "#B0B57D",
                borderColor: "#B0B57D",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Work Sans",
                borderRadius: "20px",
              }}
            >
              Upload Logo
            </Button>
          </Box>
        </Box>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Box>

      {Object.entries(themeColors).map(([sectionKey, section]) => (
        <Box key={sectionKey} mb={4}>
          <Typography
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 600,
              fontSize: "24px",
              mb: 3,
            }}
          >
            {section.sectionTitle}
          </Typography>

          {section.colors.map((color, idx) => {
            const colorInputId = `theme-color-${sectionKey}-${idx}`;
            const displayName = color.name?.trim() || color.name;
            const isColorValid = hexColorRegex.test(color.code);
            return (
              <Grid
                container
                spacing={2}
                alignItems="center"
                mb={3}
                key={`${sectionKey}-${color.name}-${idx}`}
              >
                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat",
                      fontWeight: 600,
                      fontSize: "24px",
                      color: "#0E0E0E",
                      mb: 2,
                    }}
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Work Sans",
                      fontWeight: 400,
                      fontSize: "16px",
                      width: "366px",
                      color: "#0E0E0E",
                    }}
                  >
                    {color.description}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: color.code,
                        borderRadius: 1,
                        mr: 2,
                        border: "1px solid #ccc",
                      }}
                    />
                    <Box>
                      <Typography sx={{ fontFamily: "Work Sans", color: "text.secondary" }}>
                        {(color.code || "").toUpperCase()}
                      </Typography>
                      <TextField
                        size="small"
                        value={color.code || ""}
                        error={!isColorValid}
                        helperText={!isColorValid ? "Use format #RRGGBB or #RGB" : ""}
                        onChange={(event) =>
                          handleColorCodeChange(sectionKey, idx, event.target.value)
                        }
                        disabled={isDefault}
                        sx={{
                          width: 160,
                          mt: 1,
                          "& input": {
                            fontFamily: "Work Sans",
                            textTransform: "uppercase",
                          },
                        }}
                        inputProps={{
                          maxLength: 7,
                        }}
                      />
                    </Box>
                    <input
                      id={colorInputId}
                      type="color"
                      value={color.code}
                      onChange={(event) =>
                        handleColorCodeChange(sectionKey, idx, event.target.value)
                      }
                      disabled={isDefault}
                      style={{ width: 0, height: 0, opacity: 0, position: "absolute" }}
                    />
                    <label htmlFor={colorInputId} style={{ marginLeft: "16px" }}>
                      <IconButton
                        component="span"
                        edge="end"
                        disabled={isDefault}
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "4px",
                          border: "0.5px solid rgba(112, 112, 112, 1)",
                          padding: "6px",
                          "&:hover": {
                            backgroundColor: "white",
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </label>
                  </Box>
                </Grid>
              </Grid>
            );
          })}
        </Box>
      ))}

      <Box display="flex" justifyContent="flex-end" maxWidth="85%" gap={2} mt={4}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={saving}
          sx={{
            color: "#B0B57D",
            borderColor: "#B0B57D",
            textTransform: "none",
            fontWeight: 600,
            fontFamily: "Work Sans",
            borderRadius: "20px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            backgroundColor: "#B0B57D",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontFamily: "Work Sans",
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: "#9EA762",
            },
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default ThemeSettings;

