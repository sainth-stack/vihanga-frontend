import React, { useState } from "react";
import "./styles.scss";
import upload from "assets/svg/upload.svg";
import arrowUp from "assets/svg/arrow-up.svg";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from "xlsx";
import axios from "axios";
import useWindowSize from "components/UseWindowSize";
import { LoadingIndicator } from "utilities";
const fileTypes = ["XLSX", "CSV"];

export default function BrowseFiles({ text = "", setData }) {
  const isMobile = useWindowSize();
  const [uploading, setUploading] = useState(false);
  const handleUpload = (fileData, mobile = false) => {
    setUploading(true);
    let file = mobile ? fileData.target.files[0] : fileData;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ma7nge92");
    axios
      .post("https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload", formData, {
        onUploadProgress: (progressEvent) => {
          //console.log(Math.round(
          //  (progressEvent.uploaded / progressEvent.total) * 100
          //) + "%")
        },
      })
      .then((response) => {
        handleChange(response.data.secure_url, file);
      })
      .catch((error) => {
        alert("Uploading error on cloudinary");
        setUploading(false);
      });
  };
  const handleChange = (url, file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);
        setUploading(false);
        resolve({ data, file, url, totalRecords: data.length });
      };

      fileReader.onerror = (error) => {
        setUploading(false);
        reject(error);
      };
    });

    promise.then(({ data, file, url, totalRecords }) => {
      setData({ data, file, url, totalRecords });
    });
  };
  return (
    <div className="browse-border text-center pt-2 w-100 mt-3">
      {uploading ? <div>Uploading <LoadingIndicator /></div> :
        isMobile ? (
          <>
            <input
              type="file"
              placeholder='choosefile'
              onChange={(e) => handleUpload(e, "mobile")}
              accept=".xlsx,.csv"
              name="file"
              id="file"
              className="inputfile"
            />
            <div>
              <span style={{ paddingRight: "90px" }}>choose File</span>

              <label htmlFor="file" style={{ borderLeft: "2px solid #2A8981" }}>
                <span className="pl-3">Browse...</span>
              </label>
            </div>
          </>
        ) : (
          <FileUploader id="file-upload" handleChange={handleUpload} name="file" types={fileTypes}>
            <div className="p-5 mt-4 w-100">
              <img src={upload} alt="upload icon" />
              <p className="drag-text">Drag &amp; Drop file to upload or</p>
              <button className="browse-button">
                <img src={arrowUp} alt="arrow up" /> Browse file
              </button>
            </div>
          </FileUploader>
        )}
    </div>
  );
}
