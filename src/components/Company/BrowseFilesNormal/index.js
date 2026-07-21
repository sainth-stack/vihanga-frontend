import React, { useState } from "react";
import "./styles.scss";
import upload from "assets/svg/upload.svg";
import arrowUp from "assets/svg/arrow-up.svg";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import { Toast } from "service/toast";
import { NotificationContainer } from "react-notifications";
import { LoadingIndicator } from "utilities";
import useWindowSize from "components/UseWindowSize";
import { useTranslation } from "react-i18next";
const fileTypes = ["XLSX", "CSV", "PNG", "JPG", "JPEG", "PDF"];

export default function BrowseFilesNormal({ text = "", setData }) {
  const {t} = useTranslation()
  const isMobile = useWindowSize();
  const [uploading, setUploading] = useState(false);
  const handleUpload = (fileData, mobile = false) => {
    let file = mobile ? fileData.target.files[0] : fileData;
    setUploading(true);
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ma7nge92");
    axios
      .post("https://api.cloudinary.com/v1_1/dbqm9svvp/raw/upload", formData, {
        onUploadProgress: (progressEvent) => {
          let percent = Math.round(
            (progressEvent.uploaded / progressEvent.total) * 100
          );
          if (
            percent === 25 ||
            percent === 50 ||
            percent === 75 ||
            percent === 100
          ) {
            Toast({
              message: "Uploaded " + percent + "%",
              type: "success",
              time: 500,
            });
          }
        },
      })
      .then((response) => {
        Toast({
          message: "Uploaded Successfully",
          type: "success",
          time: 1000,
        });
        setData({ url: response.data.secure_url });
        setUploading(false);
      })
      .catch((error) => {
        Toast({ message: "Uploaded Failed", type: "error", time: 1000 });
        setUploading(false);
      });
  };
  return (
    <div className="browse-border text-center pt-2 w-100 mt-3">
      {uploading ? (
        <div>
          Uploading <LoadingIndicator />
        </div>
      ) : !isMobile ? (
        <FileUploader id="file-upload" handleChange={handleUpload} name="file" types={fileTypes}>
          <div className="p-2 mt-2 w-100">
            <img src={upload} alt="upload icon" />
            <p className="drag-text">
              {t("OKR Details.Drag & Drop file to upload or")}
            </p>
            <button className="browse-button">
              <img src={arrowUp} alt="arrow up" />{" "}
              {t("OKR Details.Browse file")}
            </button>
          </div>
        </FileUploader>
      ) : (
        <>
          <input
            type="file"
            placeholder="choosefile"
            onChange={(e) => handleUpload(e, "mobile")}
            accept=".xls,.xlsx,.png,.jpeg,.pdf,.csv"
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
      )}
      <NotificationContainer />
    </div>
  );
}
