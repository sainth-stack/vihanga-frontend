import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import React, { useCallback, useState } from "react";
import { appURL } from "./../../../../../utilities/baseurl";
import axios from "axios";
import { Toast } from "service/toast";
import CustomRadio from "pages/vihanga/components/CustomRadio";
import HolidayTable from "./HolidayTable";
import { differenceInDays, isValid, parse } from "date-fns";
import { canEdit, hasPrivilege } from 'utilities/privilegeHelper';

const Holiday = () => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
    const [holidays, setHolidays] = useState([]);
// Check permissions
const hasViewPermission = hasPrivilege("view");
const hasEditPermission = canEdit();
  const [formData, setFormData] = useState({
    holidayName: "",
    fromDate: "",
    toDate:"",
    holidayDuration:"",
    type: "",
    description: "",
  });

  const typeOptions = [
    { label: t("HolidaysCalendar.TypeOptions.PublicHoliday"), value: "public" },
    { label: t("HolidaysCalendar.TypeOptions.CompanyHoliday"), value: "company" },
    { label: t("HolidaysCalendar.TypeOptions.ReligiousHoliday"), value: "religious" },
  ];

  const companyId =
    localStorage.getItem("companyId") !== null
      ? JSON.parse(localStorage.getItem("companyId"))
      : null;

  const formFields = [
    {
      id: "holidayName",
      label: t("HolidaysCalendar.FormFields.HolidayName"),
      type: "text",
      component: "input",
    },
    {
      id: "fromDate",
      label: "From Date",
      type: "date",
      component: "input",
    },
{
      id: "toDate",
      label: "To Date",
      type: "date",
      component: "input",
    },{
      id: "holidayDuration",
      label: "Holiday Duration",
      type: "text",
      component: "input",
      disabled:true,
    },
    {
      id: "type",
      label: t("HolidaysCalendar.FormFields.Type"),
      component: "radio",
      options: typeOptions,
    },
    {
      id: "description",
      label: t("HolidaysCalendar.FormFields.Description"),
      type: "text",
      component: "input",
    },
  ];

  const buttonConfigs = [
    {
      label: t("HolidaysCalendar.Buttons.Cancel"),
      type: "button",
      variant: "contained",
      sx: {
        backgroundColor: "#FFFFFF",
        color: "#847F3B",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#FFFFFF",
        },
        "&:active": {
          backgroundColor: "#FFFFFF",
        },
      },
      onClick: () => {
        setFormData({
          holidayName: "",
          fromDate: "",
          toDate:"",
          holidayDuration:"",
          type: "",
          description: "",
        });
        setError(null);
      },
    },
    {
      label: formData._id ? t("HolidaysCalendar.Buttons.Update") : t("HolidaysCalendar.Buttons.Submit"),
      type: "submit",
      variant: "contained",
      sx: {
        backgroundColor: "#837F39",
        color: "#FFFFFF",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#837F39",
        },
        "&:active": {
          backgroundColor: "#837F39",
        },
      },
      disabled: isSubmitting,
    },
  ];

  const handleEdit = useCallback((selectedRow) => {
    setFormData({
      _id: selectedRow._id || "",
      holidayName: selectedRow.holidayName || "",
      fromDate: selectedRow.fromDate || "",
      toDate:selectedRow.toDate ||"",
      holidayDuration:selectedRow.holidayDuration || "",
      type: selectedRow.type || "",
      description: selectedRow.description || "",
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      //  Auto-calculate duration when fromDate or toDate changes
      if (name === "fromDate" || name === "toDate") {
        const fromDate = name === "fromDate" ? value : prev.fromDate;
        const toDate = name === "toDate" ? value : prev.toDate;
        if (
          fromDate &&
          toDate &&
          isValid(new Date(fromDate)) &&
          isValid(new Date(toDate))
        ) {
          const parsedFrom = parse(fromDate, "yyyy-MM-dd", new Date());
          const parsedTo = parse(toDate, "yyyy-MM-dd", new Date());

          if (parsedTo >= parsedFrom) {
            const diffDays = differenceInDays(parsedTo, parsedFrom) + 1;
            updatedData.holidayDuration = diffDays.toString();
          } else {
            updatedData.holidayDuration = "";
          }
        } else {
          updatedData.holidayDuration = "";
        }
      }

      return updatedData;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || Object.keys(formData).length === 0) {
      Toast({
        message: "Please fill details before submitting",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = {
        holidayName: formData.holidayName,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        holidayDuration:formData.holidayDuration,
        type: formData.type,
        description: formData.description,
        companyId:companyId
      };

      const isEditMode = Boolean(formData._id);
      
    
        const url = isEditMode
        ? `${appURL}/updateHoliday?id=${formData._id}&companyId=${companyId}`
        : `${appURL}/createHoliday`;

      if (!isEditMode) {
        submitData.companyId = companyId;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

 const response = await axios[isEditMode ? "put" : "post"](
        url,
        submitData,
        config
      );   

      Toast({
        message:
          response?.data?.message ||
          (isEditMode
            ? "Holiday updated successfully"
            : "Holiday created successfully"),
        type: "success",
      });

      setFormData({
        holidayName: "",
        fromDate: "",
        toDate:"",
        holidayDuration:"",
        type: "",
        description: "",
      });
      setRefreshTable((prev) => !prev);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting the form. Please try again."
      );
      Toast({
        message:
          err.response?.data?.message ||
          "An error occurred while submitting the form. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Box sx={{ padding: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "8px 16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: `"Montserrat"`,
                color: "#0E0E0E",
                marginLeft: "-17px",
              }}
            >
              {t("HolidaysCalendar.PageTitle")}
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {field.component === "input" ? (
                  <InputTextComponent
                    // MODIFIED: Removed code field specific styling since code field is removed
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    type={field.type}
                    value={formData[field.id] || ""}
                    // onChange={(e) => {
                    //   setFormData({
                    //     ...formData,
                    //     [field.id]: e.target.value,
                    //   });
                    // }}
                    onChange={handleChange}
                    disabled={isSubmitting || field.disabled}
                    {...(field.id === "description" && {
                      multiline: true,
                      minRows: 5,
                    })}
                  />
                ) : field.component === "radio" ? (
                  <CustomRadio
                    label={field.label}
                    name={field.id}
                    options={field.options || []}
                    color="#837F39"
                    direction="row"
                    value={formData[field.id] || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, [field.id]: value })
                    }
                    disabled={isSubmitting}
                  />
                ) : null}
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
            {buttonConfigs.map((btn, index) => (
              <Button
                key={index}
                type={btn.type}
                variant={btn.variant}
                sx={btn.sx}
                onClick={btn.onClick}
                disabled={isSubmitting && btn.type === "submit"}
              >
                {isSubmitting && btn.type === "submit" ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress
                      size={16}
                      thickness={5}
                      sx={{ color: "#ffffff" }}
                    />
                    {t("HolidaysCalendar.Buttons.Submitting")}
                  </Box>
                ) : (
                  btn.label
                )}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      <HolidayTable onEdit={handleEdit} refreshTable={refreshTable} />
    </>
  );
};

export default Holiday;