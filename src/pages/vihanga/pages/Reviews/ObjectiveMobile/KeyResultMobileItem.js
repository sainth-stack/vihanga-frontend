
import React, { useState } from 'react'
import AttachmentComponent from '../ObjectivesTable/AttachmentComponent'
import userIcon from "assets/svg/userprofile.png";
import "./style.css";
import ProgressStatus from '../ProgressStatus';
import KeyResultsActionsComponent from '../ObjectivesTable/KeyResultsActionsComponent';
import TaskMobileItem from './TaskMobileItem';

export default function KeyResultMobileItem({ privileges, handleEdit, setEditModal, row, selectedUsers = [], setSelectedUsers, handleDeleteKeyResults, handleViewTask, setViewModalTask, handleEditTask, setEditModalTask, handleDeleteTasks }) {
  const [expandObjective, setExpandObjective] = useState(false);
  return (
    <div className="ml-2 bg-white">
      <div className='m-3 p-1 d-flex justify-content-between align-items-center'>
        <div className='row'>
          <i className={`mr-2 text-gray fa fa-caret-${expandObjective ? 'down' : 'right'}`} onClick={() => setExpandObjective(!expandObjective)} />
          <input type="checkbox" checked={selectedUsers.filter(item => item._id === row._id).length > 0} onChange={() => setSelectedUsers(row)} />
        </div>
        <div className='row'>
          <KeyResultsActionsComponent privileges={privileges} row={row} handleDeleteKeyResults={handleDeleteKeyResults} />
          <AttachmentComponent row={row} />
        </div>
      </div>
      {expandObjective ? <div className='p-1 objectives'>
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>KEY RESULT</h4>
          <h4 className='col-8 font-weight-bold'>{row.keyResultName}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>DUE DATE</h4>
          <h4 className='col-8'>{window.moment(row.dueDate).format("D MMM YYYY")}</h4>
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
            <ProgressStatus percent={row.percent} updatedAt={row.updatedAt} onEdit={() => {
              if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
                handleEdit(row);
                setEditModal(true);
              }
            }} />
          </h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>ACTION</h4>
          <h4 className='col-8'>
            <KeyResultsActionsComponent privileges={privileges} row={row} handleDeleteKeyResults={handleDeleteKeyResults} />
          </h4>
        </div>
      </div> : <div className='p-1 objectives'>
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>KEY RESULT</h4>
          <h4 className='col-8 font-weight-bold'>{row.keyResultName}</h4>
        </div>
        <div className='text-12'>
          <ProgressStatus percent={row.percent} updatedAt={row.updatedAt} onEdit={() => {
            if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
              handleEdit(row);
              setEditModal(true);
            }
          }} />
        </div>
      </div>}
      {expandObjective && row.children.length > 0 && row.children.map((rowChild, indexChild) => (
        <React.Fragment key={rowChild._id}>
          <TaskMobileItem
            privileges={privileges}
            row={rowChild}
            selectedUsers={selectedUsers}
            setSelectedUsers={(rowData) => setSelectedUsers(rowData)}
            handleViewTask={handleViewTask}
            setViewModalTask={setViewModalTask}
            handleEditTask={handleEditTask}
            setEditModalTask={setEditModalTask}
            handleDeleteTasks={handleDeleteTasks}
          />
        </React.Fragment>
      ))}
    </div>
  )
}
