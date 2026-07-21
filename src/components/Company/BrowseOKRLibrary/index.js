import React from "react";
import "./styles.scss";
import upload from "assets/svg/upload.svg";
import arrowUp from "assets/svg/arrow-up.svg";
import { FileUploader } from "react-drag-drop-files";
import * as XLSX from "xlsx";
import axios from "axios";
import useWindowSize from "components/UseWindowSize";

import { removeDuplicates } from "utilities";
import { Toast } from "service/toast";
const fileTypes = ["XLSX", "CSV"];

export default function BrowseOKRLibrary({ text = "", setData }) {
  const isMobile = useWindowSize();
  const handleUpload = (fileData, mobile = false) => {
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
        let objectives = data
          .filter((item) => item.type.toLowerCase() === "obj")
          .map((item) => ({ ...item, keyResults: [] }));
        data
          .filter((item) => item.type.toLowerCase() === "kr")
          .forEach((item) => {
            let findId = objectives.findIndex(
              (objective) => objective.objectiveID === item.objectiveID
            );
            if (objectives[findId] && objectives[findId].keyResults) {
              objectives[findId].keyResults = removeDuplicates(
                [...objectives[findId].keyResults, item],
                "name"
              );
            } else {
              reject("Please check the fields and data.");
              Toast({ message: "Please check the fields and data.", time: 4000, type: "warning" })
            }
          });
        resolve({ data: objectives, file, url, totalRecords: data.length });
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then(({ data, file, url, totalRecords }) => {
      setData({ data, file, url, totalRecords });
    });
  };
  return (
    <div className="browse-border text-center pt-2 w-100 mt-3">
      {isMobile ? (
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
        <FileUploader id="okr-file-upload" handleChange={handleUpload} name="file" types={fileTypes}>
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
