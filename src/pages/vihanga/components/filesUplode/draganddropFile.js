import React, { useState } from "react";
import {
  Box,
  Button,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import img1 from '../../../../assets/images/UploadIcon.png';
import * as XLSX from "xlsx";
import axios from "axios";
import './index.css'
import { useTranslation } from "react-i18next";
const FileUploadCustom = ({ label, sx = {}, onFileUpload, link = '', id, enableUpload = false }) => {
  console.log(id,'sdfdsuj')

   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px
  const {t} = useTranslation()
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".pdf",
      ".csv",
      ".xls",
      ".xlsx",
    ];
    const fileName = selectedFile.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    if (
      !allowedExtensions.includes(fileExtension) ||
      selectedFile.size > 50 * 1024 * 1024
    ) {
      alert(
        "Invalid file. Please select a JPG, JPEG, PNG, PDF, CSV, or Excel file under 50MB."
      );
      return;
    }

    setFile(selectedFile);

    // If upload is enabled, upload to Cloudinary first
    if (enableUpload) {
      handleUpload(selectedFile);
    } else {
      // Original behavior - process file locally
      processFileLocally(selectedFile);
    }
  };

  const handleUpload = (selectedFile) => {
    setUploading(true);
    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "ma7nge92");
    
    axios
      .post("https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload", formData, {
        onUploadProgress: (progressEvent) => {
          // You can add progress tracking here if needed
          console.log('Upload progress:', Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%');
        },
      })
      .then((response) => {
        const url = response.data.secure_url;
        // Process the file with the uploaded URL
        processFileWithUrl(selectedFile, url);
      })
      .catch((error) => {
        console.error("Upload error:", error);
        alert("Uploading error on cloudinary");
        setUploading(false);
      });
  };

  const processFileWithUrl = (selectedFile, url) => {
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf("."));
    
    if (
      fileExtension === ".csv" ||
      fileExtension === ".xls" ||
      fileExtension === ".xlsx"
    ) {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(selectedFile);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          setUploading(false);
          resolve({ data, file: selectedFile, url });
        };

        fileReader.onerror = (error) => {
          setUploading(false);
          reject(error);
        };
      });

      promise.then(({ data, file, url }) => {
        onFileUpload({ data, file, url, totalRecords: data.length });
      });
    } else {
      setUploading(false);
      onFileUpload({ file: selectedFile, data: null, url });
    }
  };

  const processFileLocally = (selectedFile) => {
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf("."));
    
    if (
      fileExtension === ".csv" ||
      fileExtension === ".xls" ||
      fileExtension === ".xlsx"
    ) {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(selectedFile);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: "buffer" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          resolve({ data, file: selectedFile });
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      promise.then(({ data, file }) => {
        onFileUpload({ data, file });
      });
    } else {
      onFileUpload({ file: selectedFile, data: null });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  };

  const handleBrowseClick = (event) => {
    if (event) {
      event.stopPropagation();
    }
    const fileInput = document.getElementById(id);
    console.log(fileInput,'fileInput')
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleBoxClick = () => {
    const fileInput = document.getElementById(id);
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <Box>
      <label
        style={{
          color: "#707070",
          fontFamily: "Work Sans",
          fontWeight: "400",
          fontSize: "14px",
        }}
      >
        {label}
      </label>
      <Box
      className="upload-box" 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBoxClick}
        sx={{
          border: isMobile ? "1.5px dashed #99965E" : "1px dashed #99965E",
          borderRadius: "10px",
          padding: isMobile ? "13px" : "20px",
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          width: "100%",
          height: isMobile ? "180px" : "170px",
          margin: "auto",
          backgroundColor: "#FFFFFF",
          opacity: uploading ? 0.7 : 1,
          ...sx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? "5px" : "22px",
          }}
        >
          <img
            src={img1}
            alt="uploadIcon"
            style={{ width: "69px", height: "60px", color: "#99965E" }}
          />
          <Box sx={{ fontFamily: "Work Sans", fontWeight: "500" }}>
            <Typography
              variant="body1"
              mt={1}
              sx={{ fontSize: isMobile ? "13px" : "20px", color: "#060606" }}
            >
              {uploading ?t("FileUploadFile.uploading"): t("FileUploadFile.chooseAFile")}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: isMobile ? "10px" : "16px", color: "#707070" }}
            >
              {t("FileUploadFile.fileTypes")}
            </Typography>
          </Box>
        </Box>
        <br />
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.csv,.xls,.xlsx"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id={id}
          disabled={uploading}
        />
        <Button
          variant="outlined"
          onClick={handleBrowseClick}
          disabled={uploading}
          sx={{
            borderColor: "#99965E",
            color: "#99965E",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "500",
            fontFamily: "Work Sans",
            width: "168px",
            height: "47px",
            backgroundColor: "white",
            textTransform: "capitalize",
            "&:hover": {
              border: "1px solid #99965E",
              backgroundColor: "#f5f5f5",
            },
            "&:disabled": {
              borderColor: "#ccc",
              color: "#ccc",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          {uploading ? t("FileUploadFile.uploading") :t("FileUploadFile.browseFile")}
        </Button>
      </Box>
      {file && (
        <Typography
          variant="body2"
          mt={2}
          sx={{
            fontSize: "20px",
            fontWeight: "400",
            fontFamily: "Work Sans",
            textAlign: "start",
          }}
        >
          {t("FileUploadFile.selectedFile")} {file.name}
        </Typography>
      )}
      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            fontFamily: "Work Sans",
            fontSize: "16px",
            marginTop: "5px",
            "&:hover": {
              color: "primary.dark",
            },
          }}
        >
          {t("FileUploadFile.clickhere")}
        </Link>
      )}
    </Box>
  );
};

export default FileUploadCustom;
