import React from 'react';
import "./styles.scss"
import excelfile from "assets/svg/excelfile.svg";
import closefile from "assets/svg/closefile.svg";
import attachment from "assets/svg/attachment.svg";
import downloadIcon from "assets/svg/download.svg";


import {deleteUpload}  from "action/UploadAct"
import { useDispatch } from 'react-redux';

export default function UploadProgress({upload, filename: title = "", status = "inprogress", fileSize: size = "0kb", progressWidth = 0, cancelUpload, loadedData: loaded = 0, totalData: total = 0,  _id: id,deleteUploadData, fileUrl: link = "", index,refresh }) {

  const  dispatch  = useDispatch();
 
  console.log(upload)
  
  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(link);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Employee_Template.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab
      window.open(link, '_blank');
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-4 ml-3 flex-wrap" key={index}>
      <div className='row'>
        <img src={excelfile} alt="excel file" />
        <div className='ml-2'>
          <p className="title-text m-0">{title.length > 20 ? title.substring(0, 20) + "...." + title.split(".")[1].substring(0, 4) : title}</p>
          {status === "failed" ? (
            <small className="message-text failed">This file is not uploaded</small>
          ) : (
            <small className={`message-text ${loaded === total ? "success" : "failed"}`}>
              {loaded} records successfully uploaded out of {total}
            </small>
          )}        </div>
      </div>
      <div className='d-flex align-items-center'>
        {/* case1 */}
        {status === "inprogress" && <div className='progress-container'>
          <div className='progress-bar2' style={{ width: progressWidth > 0 ? progressWidth + "%" : 0 }} />
        </div>}
        {/* case2 */}
        {(status === "success" || status === "failed") && <span className='attachment'>{size}  <a href={link} onClick={handleDownload} target="_blank" rel="noopener noreferrer" ><img src={attachment} alt="attachment" /></a></span>}
        {/* case3 */}
        {/*{status === "failed" && <button className='retry'> <img src={retry} alt="attachment" /> Try Again</button>}*/}
        {id !== null && <img src={closefile} alt="cancel" className='ml-2 cursor-pointer' onClick={() =>deleteUploadData(id)} />}
        
        {progressWidth > 0 && progressWidth < 100 && <img src={closefile} alt="cancel" className='ml-2 cursor-pointer' onClick={cancelUpload} />}
      </div>
    </div>
  )
}
