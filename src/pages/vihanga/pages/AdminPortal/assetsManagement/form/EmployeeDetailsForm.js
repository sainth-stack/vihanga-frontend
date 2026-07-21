import React from 'react';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InputTextComponent } from '../../../../components/input-elements/text';
import { SelectComponent } from '../../../../components/input-elements/select';

export const EmployeeDetailsForm = ({ formData, handleChange, errors = {}, employeeOptions = [], handleEmployeeSelect }) => {
  const { t } = useTranslation();
  console.log("employeeOptions in form", employeeOptions);

  return (
    <>
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        {t("EmployeeDetailsForm.EmployeeInformation")}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SelectComponent
            id="fullName"
            label={t("EmployeeDetailsForm.FullName")}
            value={formData.selectedEmployeeId || ""}
            onChange={(e) => {
              const selected = employeeOptions.find(opt => opt.value === e.target.value);
              handleEmployeeSelect(selected);
            }}
            options={employeeOptions}
            error={!!errors.fullName}
            helperText={errors.fullName}
            placeholder={t("EmployeeDetailsForm.SelectEmployee")}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="employeeId"
            label={t("EmployeeDetailsForm.EmployeeID")}
            value={formData.employeeId}
            onChange={handleChange}
            error={!!errors.employeeId}
            helperText={ errors.employeeId }
            disabled={true}
            sx={{
              "& .MuiOutlinedInput-root.Mui-disabled": {
                opacity: 0.85,
                backgroundColor: "#fafafa",
                "& input": {
                  color: "#424242",
                  WebkitTextFillColor: "#424242",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="department"
            label={t("EmployeeDetailsForm.Department")}
            value={formData.department}
            onChange={handleChange}
            error={!!errors.department}
            helperText={errors.department}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="position"
            label={t("EmployeeDetailsForm.Position")}
            value={formData.position}
            onChange={handleChange}
            error={!!errors.position}
            helperText={errors.position}
            disabled={true}
            sx={{
              "& .MuiOutlinedInput-root.Mui-disabled": {
                opacity: 0.85,
                backgroundColor: "#fafafa",
                "& input": {
                  color: "#424242",
                  WebkitTextFillColor: "#424242",
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="workLocation"
            label={t("EmployeeDetailsForm.WorkLocation")}
            value={formData.workLocation}
            onChange={handleChange}
            error={!!errors.workLocation}
            helperText={errors.workLocation}
          />
        </Grid>
      </Grid>
    </>
  );
}; 