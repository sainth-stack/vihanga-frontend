import React from 'react';
import { EmployeeDetailsForm } from './form/EmployeeDetailsForm';
import { useTranslation } from 'react-i18next';
import { Typography, Box, Grid, CircularProgress, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { SelectComponent } from '../../../components/input-elements/select';
import { InputTextComponent } from '../../../components/input-elements/text';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AssetsManagementTable from './table/table';
import { useAssetsManagement } from './hooks/useAssetsManagement';
import { ASSET_TYPES } from './constants/assetConstants';
import { canEdit } from 'utilities/privilegeHelper';

const AssetsManagementSystem = () => { 
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    
  
  const {
    // State
    formData,
    setFormData,
    assetForms,
    isSubmitting,
    refreshTable,
    formErrors,
    isEditMode,
    
    // Actions
    handleChange,
    handleAssetTypeChange,
    handleAddAsset,
    handleRemoveAsset,
    handleEdit,
    handleReset,
    handleSubmit,
    employeeOptions,
    handleEmployeeSelect
  } = useAssetsManagement();

  return (
    <>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? ".5rem" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography sx={{ fontSize: '32px', fontWeight: '600' }}>
          {t("AssetsManagementSystem.PageTitle")}
        </Typography>

        <EmployeeDetailsForm
          formData={formData}
          handleChange={(e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))}
          errors={formErrors}
          employeeOptions={employeeOptions}
          handleEmployeeSelect={handleEmployeeSelect}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
          <Typography variant="h6">{t("AssetsManagementSystem.AssetAssignment")}</Typography>
          {canEdit() && (
            <Button
              onClick={handleAddAsset}
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '999px',
                color: '#847F3B',
                border: '1px solid #847F3B',
                '&:hover': {
                  backgroundColor: '#f7f6ef',
                  border: '1px solid #807D3A',
                  color: '#6f6b2f'
                }
              }}
            >
              {t("AssetsManagementSystem.AddAsset")}
            </Button>
          )}
        </Box>

        {assetForms.map((asset, index) => (
          <Grid container spacing={2} mt={2} key={index}>
            <Grid item xs={12} md={3}>
              <SelectComponent
                label={t("AssetsManagementSystem.AssetType")}
                id="assetType"
                name="assetType"
                value={asset.assetType || ""}
                onChange={(selectedOption) => handleAssetTypeChange(index, selectedOption)}
                options={ASSET_TYPES}
                placeholder={t("AssetsManagementSystem.SelectType")}
                error={formErrors[`assetType_${index}`]}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <InputTextComponent
                id="assetNumber"
                label={t("AssetsManagementSystem.AssetNumber")}
                value={asset.assetNumber}
                onChange={(e) => handleChange(index, e)}
                error={formErrors[`assetNumber_${index}`]}
                helperText={formErrors[`assetNumber_${index}`]}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <InputTextComponent
                id="issueDate"
                label={t("AssetsManagementSystem.IssueDate")}
                type="date"
                value={asset.issueDate}
                onChange={(e) => handleChange(index, e)}
                error={formErrors[`issueDate_${index}`]}
                helperText={formErrors[`issueDate_${index}`]}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* <Grid item xs={12} md={2}>
              <InputTextComponent
                id="collectionDate"
                label={t("AssetsManagementSystem.CollectionDate")}
                type="date"
                value={asset.collectionDate}
                onChange={(e) => handleChange(index, e)}
                error={formErrors[`collectionDate_${index}`]}
                helperText={formErrors[`collectionDate_${index}`]}
                InputLabelProps={{ shrink: true }}
              />
            </Grid> */}

            <Grid item xs={12} md={2}>
            <InputTextComponent
              id="handoverDate"
              label={t("AssetsManagementSystem.HandOverDate")}
              type="date"
              value={asset.handoverDate}
              onChange={(e) => handleChange(index, e)}
              error={formErrors[`handoverDate_${index}`]}
              helperText={formErrors[`handoverDate_${index}`]}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

            <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
              {index > 0 && canEdit() && (
                <IconButton 
                  onClick={() => handleRemoveAsset(index)}
                  sx={{ color: '#d32f2f' }}
                  title={t("AssetsManagementSystem.RemoveAsset")}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        {canEdit() && (
          <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
            <Button
              variant="outlined"
              type="button"
              sx={{ 
                color: '#847F3B', 
                borderColor: '#847F3B',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#f7f6ef',
                  borderColor: '#807D3A',
                }
              }}
              onClick={handleReset}
            >
              {t("AssetsManagementSystem.Cancel")}
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{ 
                backgroundColor: '#837F39', 
                color: '#FFFFFF', 
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#837F39', // disables background color change on hover
                }
              }}
            >
              {isSubmitting ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} thickness={5} sx={{ color: '#ffffff' }} /> 
                  {isEditMode ? t("AssetsManagementSystem.Updating") : t("AssetsManagementSystem.Submitting")}
                </Box>
              ) : (
                isEditMode ? t("AssetsManagementSystem.UpdateAsset") : t("AssetsManagementSystem.CreateAsset")
              )}
            </Button>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? ".5rem" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
      >
        <AssetsManagementTable onEdit={handleEdit} refreshTable={refreshTable} />
      </Box>
    </>
  );
};

export default AssetsManagementSystem;
