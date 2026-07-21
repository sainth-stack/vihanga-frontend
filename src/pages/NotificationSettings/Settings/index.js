/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useState } from "react";
import { Validator, Role, actionsData } from "utilities";
import { useDispatch } from "react-redux";
import TabsContainer from "./tabs";
import {
  createNotificationSettings,
  getAllNotificationSettings,
  updateNotificationSettings,
} from "action/NotificationSettingsAct";
import axios from "axios";
import CKEditorContainer from "components/CKEditorContainer";
import { Typography, Grid, Box, Button } from "@mui/material";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import { useTranslation } from "react-i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      role: data[i].role,
      description: data[i].description,
      active: data[i].active,
      privileges: data[i].privileges,
      updatedAt: data[i].updatedAt,
    });
  }
  return items;
};

function NotificationSettings() {
  const { t } = useTranslation();
  const [roleData, setRoleData] = useState({
    toAddress: "",
    ccAddress: "",
    subject: "",
    message: "",
    attachment: "",
  });
  const [, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [, setData] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const validator = Validator();
  const [actions, setActions] = useState(actionsData);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleUpload = (e) => {
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "ma7nge92");
    axios
      .post("https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload", formData, {
        onUploadProgress: (progressEvent) => {},
      })
      .then((response) => {
        let updatedData = { ...roleData };
        updatedData.attachment = response.data.secure_url;
        setRoleData(updatedData);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };
  const handleSubmit = () => {
    if (validator.current.allValid()) {
      if (editId) {
        let finalActions = [...actions];
        if (selectedIndex !== null) {
          finalActions[selectedIndex].toAddress = roleData.toAddress;
          finalActions[selectedIndex].ccAddress = roleData.ccAddress;
          finalActions[selectedIndex].subject = roleData.subject;
          finalActions[selectedIndex].message = roleData.message;
          finalActions[selectedIndex].attachment = roleData.attachment;
        }
        const finalData = {
          actions: finalActions,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(updateNotificationSettings(editId, finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        let finalActions = [...actions];
        finalActions[selectedIndex].toAddress = roleData.toAddress;
        finalActions[selectedIndex].ccAddress = roleData.ccAddress;
        finalActions[selectedIndex].subject = roleData.subject;
        finalActions[selectedIndex].message = roleData.message;
        finalActions[selectedIndex].attachment = roleData.attachment;
        const finalData = {
          actions: finalActions,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createNotificationSettings(finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllNotificationSettings());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setData(data);
          setActions(data[0].actions);
          setEditId(data[0]._id);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError(t("notification.noDataFound"));
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

  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllNotificationSettings());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setData(data);
          setActions(data[0].actions);
          setEditId(data[0]._id);
          setError("");
        } else if (data.length === 0) {
          setError(t("notification.noDataFound"));
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  const emptyData = () => {
    setRoleData({
      toAddress: "",
      ccAddress: "",
      subject: "",
      message: "",
      attachment: "",
    });
    setActions(actionsData);
    setEditId(null);
    validator.current.hideMessages();
  };

  const reUpload = () => {
    let updatedData = { ...roleData };
    updatedData.attachment = "";
    setRoleData(updatedData);
  };

  useEffect(() => {
    getPrivilegesData();
  }, []);

  return (
    <>
      <Box
        sx={{
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: "600",
            fontFamily: `"Montserrat"`,
            color: "#0E0E0E",
            p: 2,
            mr: "30px",
          }}
        >
          {t("notification.settingsTitle")}
        </Typography>

        <Box sx={{ p: 2 }}>
          <Grid container spacing={1} sx={{ ml: 2 }}>
            <Grid item md={6}>
              <TabsContainer
                actions={actions}
                setActions={setActions}
                setRoleData={setRoleData}
                setSelectedIndex={setSelectedIndex}
              />
            </Grid>

            <Grid item md={5}>
              {selectedIndex !== null && (
                <Typography
                  align="center"
                  sx={{
                    fontWeight: 600,
                    border: "1px solid #ccc",
                    p: 2,
                    borderRadius: 1,
                    mb: 3,
                  }}
                >
                  {actions[selectedIndex].page}
                </Typography>
              )}

              <Box mb={5}>
                <SelectComponent
                  label={t("notification.to")}
                  placeholder={t("notification.select")}
                  name="toAddress"
                  options={Role}
                  value={roleData.toAddress}
                  onChange={handleChangeSearch}
                />
              </Box>

              <Box mb={5}>
                <SelectComponent
                  label={t("notification.cc")}
                  placeholder={t("notification.select")}
                  name="ccAddress"
                  options={Role}
                  value={roleData.ccAddress}
                  onChange={handleChangeSearch}
                />
              </Box>

              <Grid container spacing={1} alignItems="center" mt={4}>
                <Grid item xs={12} md={12}>
                  <InputTextComponent
                    id="subject"
                    name="subject"
                    label={t("notification.subject")}
                    rows="5"
                    value={roleData.subject}
                    onChange={handleChangeSearch}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={1} alignItems="center" mt={4}>
                <Grid item xs={12} md={12}>
                  {roleData.toAddress ? (
                    <CKEditorContainer
                      onChange={(e) => handleChangeSearch(e)}
                      message={roleData.message}
                    />
                  ) : (
                    <InputTextComponent
                      label={t("notification.message")}
                      multiline={true}
                      minRows={4}
                    />
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={1} alignItems="center" mt={4}>
                <Grid item xs={12} md={5}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {t("notification.attachment")}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                  {roleData.attachment.length > 0 ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <a
                        href={roleData.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("notification.view")}
                      </a>
                      <Button
                        variant="contained"
                        onClick={reUpload}
                        sx={{
                          backgroundColor: "#837F39",
                          color: "#FFFFFF",
                          fontFamily: "Work Sans",
                          fontWeight: "500",
                          borderRadius: "20px",
                          "&:hover": {
                            backgroundColor: "#837F39",
                          },
                        }}
                      >
                        {t("notification.reupload")}
                      </Button>
                    </Box>
                  ) : (
                    <FileUploadCustom
                      id="attachment-upload"
                      sx={{ width: "100%", p: 1 }}
                      onFileUpload={handleUpload}
                      acceptedFileTypes=".pdf,.doc,.docx"
                      maxFileSize={5000000}
                      file=""
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box m={4}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#837F39",
                color: "#FFFFFF",
                fontFamily: "Work Sans",
                fontWeight: "500",
                borderRadius: "20px",
                "&:hover": {
                  backgroundColor: "#837F39",
                },
              }}
            >
              {editId
                ? t("notification.updateSettings")
                : t("notification.saveSettings")}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default NotificationSettings;
