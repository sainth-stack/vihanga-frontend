/* eslint-disable no-unused-vars */
import React from "react";
import UploadProgress from "components/Company/UploadProgress";
import FileUploadCustom from '../../../pages/vihanga/components/filesUplode/draganddropFile'
import { Checkbox, Box, Typography, Button } from '@mui/material'
import { useTranslation } from "react-i18next";
import { canEdit, canDelete } from "utilities/privilegeHelper";
export default function OKRLibraryTab({
  roleData,
  handleChangeSearchBoolean,
  objectives,
  downloadExcel,
  downloadTemplate,
  handleCancel,
  setObjectives,
  handleSubmit,
  isMobile,
  handleFileUpload,
  showProgress,
  fileName,
  progress,
  loaded,
  total,
  uploads,
  cancelUpload,
  deleteUploadData,
}) {
    const { t } = useTranslation();
  
  return (
    <div>
      <div className="d-flex">
      </div>

      {(objectives || []).map((item, index1) => {
        return (
          <div key={index1}>
            {(item.keyResults || []).map((itemm, index2) => {
              return (
                <div className="ml-3" key={index2}>
                </div>
              );
            })}
          </div>
        );
      })}
     
          <Box sx={{display:"flex",justifyContent:"space-between",}} >
            <Box sx={{ display: 'flex',  marginTop: isMobile ? "20px" : "50px", }}>
              <label>
                <Checkbox
                  id="exportOKRLibrary"
                  name="exportOKRLibrary"
                  checked={roleData.exportOKRLibrary || false}
                  onChange={handleChangeSearchBoolean}
                  disabled={!canEdit()}
                  sx={{
                    color: '#837F39',
                    marginTop: "-5px",
                    '&.Mui-checked': {
                      color: '#837F39',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: isMobile ? 24 : 30
                    },
                    
                  }}
                />
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    color: "#0E0E0E",
                    fontSize: isMobile ? "18px" : "24px",
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
              {t('OKRManagement.IncludeOkr')}
                </Typography>
              </label>
            </Box>
          
          <Box sx={{
            display: 'flex',
            flexDirection: "row",
            gap: "30px",
            marginTop: isMobile ? "20px" : "50px",
            ml: isMobile ? "10px" : 0
          }}>
            <Button
              variant="contained"
              onClick={() => downloadExcel()}
              sx={{
                backgroundColor: "#88823B",
                color: "#fff",
                borderRadius: "100px",
                fontFamily: "Work Sans",
                textTransform: "none",
                fontWeight: 500,
                height: "38px",
                width: "120px",
                "&:hover": {
                  backgroundColor: "#6f6a2f",
                },
              }}
            >
                          {t('OKRManagement.Export')}

            </Button>
            <Button
              variant="contained"
              onClick={() => downloadTemplate()}
              sx={{
                backgroundColor: "#88823B",
                color: "#fff",
                borderRadius: "100px",
                fontFamily: "Work Sans",
                textTransform: "none",
                fontWeight: 500,
                height: "38px",
                width: "180px",
                "&:hover": {
                  backgroundColor: "#6f6a2f",
                },
              }}
            >
            {t('OKRManagement.DownloadTemplate')}
            </Button>
          </Box>
          </Box>
     
      <div className={isMobile ? "" : "d-flex"}>

        {canEdit() && (
          <Box sx={{
            width: '100%',
            marginTop: '30px',
            padding: '20px',
            // border: '1px dashed #E0E0E0',
            borderRadius: '8px',
            // backgroundColor: '#FAFAFA'
          }}>
            <FileUploadCustom
              label={t('OKRManagement.ImportOkrLibrary')}
              id="okr-library-upload-input"
              onFileUpload={({ data, file, url, totalRecords }) => {
                setObjectives(data);
                handleFileUpload({ file, url, totalRecords });
              }}
              sx={{
                minHeight: 180,
                '& .MuiDropzoneArea-root': {
                  border: 'none',
                  backgroundColor: 'transparent'
                },
                '& .MuiDropzoneArea-text': {
                  color: '#88823B',
                  fontFamily: 'Work Sans',
                  fontSize: '16px'
                }
              }}
            />
          </Box>
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
                    color: '#88823B'
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
                  <Box sx={{
                    height: '1px',
                    backgroundColor: '#E0E0E0',
                    margin: '10px 0'
                  }} />
                </Box>
              ))}
            </Box>
          )}
      </div>
      {canEdit() && (
        <Box sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          marginTop: 5,  // equivalent to mt-5
          padding: 2     // adds some spacing if needed
        }}>
          <Button
            variant="outlined"
            onClick={() => handleCancel()}
            sx={{
              borderColor: "#88823B",
              color: "#88823B",
              borderRadius: "100px",
              fontFamily: "Work Sans",
              textTransform: "none",
              fontWeight: 500,
              height: "38px",
              minWidth: "120px",
              "&:hover": {
                borderColor: "#6f6a2f",
                backgroundColor: "#f9f9f9",
              },
            }}
          >
            {t('OKRManagement.Cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#88823B",
              color: "#fff",
              borderRadius: "100px",
              fontFamily: "Work Sans",
              textTransform: "none",
              fontWeight: 500,
              height: "38px",
              minWidth: "120px",
              "&:hover": {
                backgroundColor: "#6f6a2f",
              },
            }}
          >
            {t('OKRManagement.Save')}
          </Button>
        </Box>
      )}
    </div>
  );
}
