import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  Grid,
  Divider,
  IconButton
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import BrowseFiles from "components/Company/BrowseFiles";
import UploadProgress from "components/Company/UploadProgress";
import { Toast } from "service/toast";
import {InputTextComponent} from '../../vihanga/components/input-elements/text'
import {SelectComponent} from '../../vihanga/components/input-elements/select'
import FileUploadCustom from '../../../pages/vihanga/components/filesUplode/draganddropFile'
import { mapOKRImportData } from './utils'
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";

export function OKRTab({
  handleChangeSearch2,
  handleChangeSearch3,
  handleChangeRages,
  handleAddOkrTab,
  handleDeleteOkrTab,
  data2,
  validator,
  okrData,
  handleCancel,
  handleSubmit2,
  handleChangeEligibilityGroup,
  downloadExcel,
  importObjectives,
  showProgress,
  uploads,
  deleteUploadData,
  fileName,
  progress,
  cancelUpload,
  loaded,
  total,
  handleFileUpload,
  isMobile,
  downloadTemplate
})
 {
    const { t } = useTranslation();

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      {/* OKR Template Name */}
   
        <Grid container spacing={4} sx={{ mb: 3 }}>
        {/* OKR Template Name */}
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="okrTemplateName"
            label={t('OKRManagement.OkrTemplateName') + '*'}
            value={okrData.okrTemplateName || ''}
            onChange={handleChangeSearch2}
          />
        </Grid>

        {/* Instructions to Users */}
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="instructionsToUsers"
            label={t('OKRManagement.InstructionsToUsers') + '*'}
            value={okrData.instructionsToUsers || ''}
            onChange={handleChangeSearch2}
            multiline
            rows={5}
          />
        </Grid>
      </Grid>

   
      {/* Date Range */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="startDate"
            label={t('OKRManagement.StartDate')}
            type="date"
            value={okrData.startDate || ''}
            onChange={handleChangeSearch2}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="endDate"
            label={t('OKRManagement.EndDate')}
            type="date"
            value={okrData.endDate || ''}
            onChange={handleChangeSearch2}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Value Ranges */}
      {!isMobile && (
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body1" align="center" >{t('OKRManagement.Min')}</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body1" align="center">{t('OKRManagement.Max')}</Typography>
          </Grid>
        </Grid>
      )}

      {/* Low Value Range */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Typography variant="body1" sx={{ fontWeight: 400, color: '#707070', mb: 1 ,fontFamily:"Work Sans",fontSize:"16px"}}>
            {t('OKRManagement.LowValueRange')}*
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            placeholder={isMobile ? t('OKRManagement.Min') : ''}
            variant="outlined"
            name="lowValueRange"
            value={okrData.lowValueRange[0].min}
            onChange={(e) => handleChangeRages(e, "min")}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                height: '43px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            placeholder={isMobile ? t('OKRManagement.Max')  : ''}
            variant="outlined"
            name="lowValueRange"
            value={okrData.lowValueRange[0].max}
            onChange={(e) => handleChangeRages(e, "max")}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                height: '43px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Mid Value Range */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Typography variant="body1"  sx={{ fontWeight: 400, color: '#707070', mb: 1 ,fontFamily:"Work Sans",fontSize:"16px"}}>
           { t('OKRManagement.MidValueRange') }*
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            placeholder={isMobile ? "Min" : ''}
            variant="outlined"
            name="midValueRange"
            value={okrData.midValueRange[0].min}
            onChange={(e) => handleChangeRages(e, "min")}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                height: '43px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            placeholder={isMobile ? "Max" : ''}
            variant="outlined"
            name="midValueRange"
            value={okrData.midValueRange[0].max}
            onChange={(e) => handleChangeRages(e, "max")}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                height: '43px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
              },
            }}
          />
        </Grid>
      </Grid>

      {/* High Value Range */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Typography variant="body1"  sx={{ fontWeight: 400, color: '#707070', mb: 1 ,fontFamily:"Work Sans",fontSize:"16px"}}>
           { t('OKRManagement.HignValueRange') }*
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            placeholder={isMobile ? "Min" : ''}
            variant="outlined"
            name="highValueRange"
            value={okrData.highValueRange[0].min}
            onChange={(e) => handleChangeRages(e, "min")}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                height: '43px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            type="number"
            placeholder={isMobile ? "Max" : ''}
            variant="outlined"
            name="highValueRange"
            value={okrData.highValueRange[0].max}
            onChange={(e) => handleChangeRages(e, "max")}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                height: '43px',
                '& fieldset': {
                  borderColor: '#E0E0E0',
                },
              },
            }}
          />
        </Grid>
      </Grid>

      {/* Eligibility Group */}
      {okrData.eligibilityGroup.map((item, index) => (
        <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <SelectComponent
              id={`eligibilityGroup_${index}`}
              label={t('OKRManagement.EligibilityGroup') + '*'}
              value={item}
              onChange={(e) => {
                if (data2.filter(itemm => itemm.value === item && okrData.eligibilityGroup.includes(itemm.value)).length === 0) {
                  let updatedEligibilities = okrData.eligibilityGroup;
                  updatedEligibilities[index] = e.target.value;
                  handleChangeSearch2({ target: { name: "eligibilityGroup", value: updatedEligibilities } })
                } else {
                  Toast({ message: "Already added", type: "warning", time: 4000 })
                }
              }}
              options={data2.map(option => ({ value: option.value, label: option.key }))}
            />
          </Grid>
          {canEdit() && (
            <Grid item xs={12} md={6} sx={{display:"flex",gap:"20px"}}>
              <IconButton onClick={(e) => handleAddOkrTab(e)}  sx={{
                                          width: 40,
                                          height: 40,
                                          backgroundColor: "#88823B",
                                          color: "#fffff",
                                          borderRadius: "50%",
                                          "&:hover": {
                                              backgroundColor: "#6f6a2f",
                                          },
                                      }}
                                  >
                <AddIcon />
              </IconButton>
              <IconButton onClick={(e) => handleDeleteOkrTab(index)} sx={{
                                          width: 40,
                                          height: 40,
                                          backgroundColor: "#88823B",
                                          color: "#fff",
                                          borderRadius: "50%",
                                          "&:hover": {
                                              backgroundColor: "#6f6a2f",
                                          },
                                      }}
                                  >
                <DeleteIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      ))}

      {/* Including Key Results */}
{/* Combined Including Key Results and Action Buttons in single row */}
<Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
  {/* Including Key Results Checkbox */}
  <Grid item xs={12} md={6}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        name="includingKeyResults"
        checked={okrData.includingKeyResults || false}
        onChange={handleChangeSearch3}
        sx={{
          color: '#88823B',
          '&.Mui-checked': {
            color: '#88823B',
            marginTop:"-5px",
          },
                              '& .MuiSvgIcon-root': {
                      fontSize: isMobile ? 24 : 30
                    },
        }}
      />
      <Typography variant="body1"  sx={{ fontWeight: 600, color: '#0E0E0E', mb: 1 ,fontFamily:"Montserrat",fontSize:"24px"}}>              {t('OKRManagement.IncludingKeyResults')}
</Typography>
    </Box>
  </Grid>

  {/* Action Buttons */}
  <Grid item xs={12} md={6}>
    <Box sx={{ display: 'flex', gap: 2 ,justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        onClick={() => downloadExcel()}
        sx={{
          backgroundColor: "#88823B",
          color: "#fff",
          borderRadius: "100px",
          textTransform: "none",
          fontWeight: 500,
          px: 3,
          py: 1,
          "&:hover": {
            backgroundColor: "#6f6a2f",
          },
        }}
      >
        {t('OKRManagement.Export') }
      </Button>
      <Button
        variant="contained"
        onClick={() => downloadTemplate()}
        sx={{
          backgroundColor: "#88823B",
          color: "#fff",
          borderRadius: "100px",
          textTransform: "none",
          fontWeight: 500,
          px: 3,
          py: 1,
          "&:hover": {
            backgroundColor: "#6f6a2f",
          },
        }}
      >
{t('OKRManagement.DownloadTemplate') }      </Button>
    </Box>
  </Grid>
</Grid>

      {/* Import OKR Library */}
      {canEdit() && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>

          </Grid>
          <Grid item xs={12} >
            <FileUploadCustom
              label={t('OKRManagement.ImportOkr')}
              id="okr-library-upload-input"
              onFileUpload={({ data, file, url, totalRecords }) => {
                const mappedData = mapOKRImportData(data);
                importObjectives(mappedData);
                handleFileUpload({ file, url, totalRecords });
              }}
              sx={{ 
                minHeight: 180,
                mb: 2,
                '& .MuiDropzoneArea-root': {
                  border: '1px dashed #88823B',
                  borderRadius: '8px',
                  backgroundColor: '#FAFAFA',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                  }
                },
                '& .MuiDropzoneArea-text': {
                  color: '#88823B',
                  fontFamily: 'Work Sans',
                  fontSize: '16px'
                },
                '& .MuiDropzoneArea-icon': {
                  color: '#88823B'
                }
              }}
              acceptedFiles={['.xlsx', '.csv']}
            />
          </Grid>
        </Grid>
      )}

    {showProgress && (
      <Box sx={{ mt: 3 }}>
        <UploadProgress
          filename={fileName}
          message={`${loaded} records successfully uploading out of ${total}`}
          status="inprogress"
          progressWidth={progress}
          cancelUpload={cancelUpload}
          loaded={loaded}
          total={total}
          sx={{
            '& .progressBar': {
              backgroundColor: '#88823B'
            },
            '& .cancelButton': {
              color: '#88823B',
              fontFamily: 'Work Sans'
            }
          }}
        />
      </Box>
    )}

    {uploads.length > 0 && (
      <Box sx={{ mt: 3 }}>
        {uploads.map((upload, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <UploadProgress
              deleteUpload={canDelete() ? deleteUploadData : undefined}
              index={index}
              {...upload}
              sx={{
                '& .progressBar': {
                  backgroundColor: upload.status === 'success' ? '#4CAF50' : '#F44336'
                }
              }}
            />
            <Divider sx={{ 
              my: 2,
              borderColor: '#E0E0E0'
            }} />
          </Box>
        ))}
      </Box>
    )}

      {/* Form Actions */}
      {canEdit() && (
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 5 }}>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => handleCancel()}
              sx={{
                borderColor: "#88823B",
                color: "#88823B",
                borderRadius: "100px",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                "&:hover": {
                  borderColor: "#6f6a2f",
                  backgroundColor: "#f9f9f9",
                },
              }}
            >
                {t('OKRManagement.Cancel')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => handleSubmit2()}
              sx={{
                backgroundColor: "#88823B",
                color: "#fff",
                borderRadius: "100px",
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "#6f6a2f",
                },
              }}
            >
                {t('OKRManagement.Save')}
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}