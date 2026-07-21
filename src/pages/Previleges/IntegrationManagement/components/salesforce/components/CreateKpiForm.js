import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  InputLabel,
  TextareaAutosize,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Button, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast } from "service/toast";
import { createKPI } from 'service/integrationapis';


const CreateKpiForm = ({ setIsOpen,kpiquery }) => {
  const [tabValue, setTabValue] = useState(0);
  const queryClient = useQueryClient();

  // Setup mutation
  const createKpiMutation = useMutation({
    mutationFn: createKPI,
    onSuccess: () => {
      // Invalidate and refetch KPI list
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      Toast({ message: "KPI created successfully!", type: "success" });
      setIsOpen(false);
    },
    onError: (error) => {
      Toast({ message: error.response?.data?.message || 'Failed to create KPI', type: "error" });
    },
  });

  const formik = useFormik({
    initialValues: {
      kpiName: '',
      category: 'Salesforce',
      subCategory: '',
      description: '',
      decimal: '0',
      roundingMode: '',
      digitFormat: false,
    },
    validationSchema: Yup.object({
      kpiName: Yup.string().required('KPI Name is required'),
      description: Yup.string(),
      roundingMode: Yup.string(),
    }),
    onSubmit: (values) => {
      const payload = {
        name: values.kpiName,
        category: values.category,
        subCategory: 'others',
        description: values.description,
        decimal: values.decimal,
        roundingMode: values.roundingMode,
        digitFormat: values.digitFormat,
        measurementType: getMeasurementType(tabValue),
        orgId: localStorage.getItem('organization_id'),
        userId: localStorage.getItem('user_id'),
      };

      createKpiMutation.mutate(payload);
    },
  });

  // Helper function to get measurement type based on tab value
  const getMeasurementType = (tab) => {
    switch (tab) {
      case 0: return 'Number';
      case 1: return 'Currency';
      case 2: return 'Percentage';
      case 3: return 'Time';
      default: return 'Number';
    }
  };

  const handleTabChange = (_, newValue) => setTabValue(newValue);
  const handleSwitchChange = (event) => {
    formik.setFieldValue('digitFormat', event.target.checked);
  };
  const handleSelectChange = (event) => {
    formik.setFieldValue('roundingMode', event.target.value);
  };

  const labeledInput = (label, children) => (
    <Grid item xs={12} md={label==='Description'?12:6}>
      <InputLabel sx={{ fontSize: "14px", fontWeight: 550 }}>{label}</InputLabel>
      {children}
    </Grid>
  );

  return (
    <div style={{margin:'20px'}}>
        {!kpiquery &&  <div
        className="d-flex p-3 justify-content-between align-items-center"
        style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}
      >
        <Typography>Create Salesforce KPI</Typography>
        <CloseIcon onClick={() => setIsOpen(false)} />
      </div>}
     
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{ p: 2,mt:2 }}>
          <Grid container spacing={4}>
            {labeledInput(
              "KPI Name*",
              <TextField 
                fullWidth 
                name="kpiName"
                placeholder="Enter KPI name" 
                variant="outlined"
                value={formik.values.kpiName}
                onChange={formik.handleChange}
                error={formik.touched.kpiName && Boolean(formik.errors.kpiName)}
                helperText={formik.touched.kpiName && formik.errors.kpiName}
              />
            )}
         
            {labeledInput(
              "Category",
              <TextField 
                fullWidth 
                name="category"
                variant="outlined" 
                value={formik.values.category} 
                disabled 
              />
            )}
          </Grid>
          {labeledInput(
            "Description",
            <TextareaAutosize
              name="description"
              minRows={4}
              placeholder="Enter description"
              style={{ width: "100%", border: "1px solid #ddd", borderRadius: 4, padding: 4 }}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          )}
          <Grid container spacing={4}  mt={2}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: "14px", fontWeight: 550 }}>Measurement Type</Typography>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="Measurement Type Tabs">
                <Tab label="123" />
                <Tab label="$" />
                <Tab label="%" />
                <Tab icon={<AccessTimeIcon />} aria-label="Time" />
              </Tabs>
              <Grid mt={2} mb={2}>
              {labeledInput(
                "Decimal",
                <TextField fullWidth variant="outlined" value="0" disabled />
              )}
              </Grid>
              <Typography>Harvest Frequency: On Every Day</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontSize: "14px", fontWeight: 550 }}>Digit Format</Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={formik.values.digitFormat}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label={formik.values.digitFormat ? "On" : "Off"}
              />
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <InputLabel>Rounding Mode</InputLabel>
                <Select
                  name="roundingMode"
                  value={formik.values.roundingMode}
                  onChange={handleSelectChange}
                  label="Rounding Mode"
                >
                  <MenuItem value=""><em>No Rounding</em></MenuItem>
                  <MenuItem value={10}>Round To Nearest</MenuItem>
                  <MenuItem value={20}>Round Up</MenuItem>
                  <MenuItem value={30}>Round Down</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid container  display={'flex'} gap={'10px'} justifyContent={'end'} position={'absolute'} right={10} bottom={2}>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={() => setIsOpen(false)}
          disabled={createKpiMutation.isPending}
        >
          Cancel
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          type="submit"
          disabled={createKpiMutation.isPending || !formik.isValid}
        >
          {createKpiMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
        </Grid>
      </form>
    </div>
  );
};

export default CreateKpiForm;