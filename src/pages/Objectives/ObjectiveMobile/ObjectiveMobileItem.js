
import React, { useState } from 'react'
import AttachmentComponent from '../ObjectivesTable/AttachmentComponent'
import ManagerCascadedComponent from '../ObjectivesTable/ManagerCascadedComponent';
import ObjectivesActionsComponent from '../ObjectivesTable/ObjectivesActionsComponent'
import userIcon from "assets/svg/userprofile.png";
import "./style.css";
import ProgressStatus from '../ProgressStatus';
import ApproveRejectComponent from '../ObjectivesTable/ApproveRejectComponent';
import KeyResultMobileItem from './KeyResultMobileItem';

export default function ObjectiveMobileItem({ privileges, companyInfo, handleEdit, setEditModal, handleDelete, setOrderModalShow4, setMultipleObjectives, setSelectedObjective, refreshData, row, totalWeight, selectedUsers = [], setSelectedUsers, handleDeleteKeyResults, handleViewTask, setViewModalTask, handleEditTask, setEditModalTask, handleDeleteTasks }) {
  const [expandObjective, setExpandObjective] = useState(false);
  return (
    <div className="br-left-green shadow rounded-15 bg-white">
      <div className='m-3 p-1 d-flex justify-content-between align-items-center'>
        <div className='row'>
          <i className={`mr-2 text-gray fa fa-caret-${expandObjective ? 'down' : 'right'}`} onClick={() => setExpandObjective(!expandObjective)} />
          <input type="checkbox" checked={Array.isArray(selectedUsers) && selectedUsers.filter(item => item._id === row._id).length > 0} onChange={() => setSelectedUsers(row)} />
        </div>
        <div className='row'>
          <ObjectivesActionsComponent privileges={privileges} row={row} companyInfo={companyInfo} handleEdit={handleEdit} setEditModal={setEditModal} handleDelete={handleDelete} setOrderModalShow4={setOrderModalShow4} setMultipleObjectives={setMultipleObjectives} setSelectedObjective={setSelectedObjective} refreshData={() => refreshData()} />
          <AttachmentComponent row={row} />
        </div>
      </div>
      {expandObjective ? <div className='p-1 objectives'>
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>OBJECTIVE</h4>
          <h4 className='col-8 font-weight-bold'>{row.objective}
            <br />
            <small>OKR Name</small>
            {row.cascaded && <ManagerCascadedComponent />}
          </h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>DUE DATE</h4>
          <h4 className='col-8'>{window.moment(row.dueDate).format("D MMM YYYY")}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>WEIGHT</h4>
          <h4 className='col-8'>
            {row.weight}
          </h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>OWNER</h4>
          <h4 className='col-8'>
            <img src={userIcon} alt="user pic" className="userPic" />{" "}
            {row.owner}
          </h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>PROGRESS &amp; STATUS</h4>
          <h4 className='col-8'>
            <ProgressStatus percent={row.progressStatus} updatedAt={row.updatedAt} onEdit={() => {
              if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
                handleEdit(row);
                setEditModal(true);
              }
            }} />
          </h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>APPROVE / REJECT</h4>
          <h4 className='col-8'>
            <ApproveRejectComponent privileges={privileges} refreshData={() => refreshData()} row={row} companyInfo={companyInfo} totalWeight={totalWeight} />
          </h4>
        </div>
      </div> : <div className='p-1 objectives'>
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>OBJECTIVE</h4>
          <h4 className='col-8 font-weight-bold'>{row.objective}
            <br />
            <small>OKR Name</small>
            {row.cascaded && <ManagerCascadedComponent />}
          </h4>
        </div>
        <div className='text-12'>
          <ProgressStatus percent={row.progressStatus} updatedAt={row.updatedAt} onEdit={() => {
            if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
              handleEdit(row);
              setEditModal(true);
            }
          }} />
        </div>
      </div>}
      {expandObjective && row.children.length > 0 && row.children.map((rowChild, indexChild) => (
        <React.Fragment key={rowChild._id}>
          <KeyResultMobileItem privileges={privileges} row={rowChild} companyInfo={companyInfo} handleEdit={handleEdit} setEditModal={setEditModal} handleDelete={handleDelete} setOrderModalShow4={setOrderModalShow4} setMultipleObjectives={setMultipleObjectives} setSelectedObjective={setSelectedObjective} refreshData={() => refreshData()}
            selectedUsers={selectedUsers}
            setSelectedUsers={(rowData) => setSelectedUsers(rowData)}
            handleDeleteKeyResults={handleDeleteKeyResults}
            handleViewTask={handleViewTask}
            setViewModalTask={setViewModalTask}
            handleEditTask={handleEditTask}
            setEditModalTask={setEditModalTask}
            handleDeleteTasks={handleDeleteTasks} />
        </React.Fragment>
      ))}
    </div>
  )
}
