
import React, { useState } from 'react'
import AttachmentComponent from '../ObjectivesTable/AttachmentComponent'
import userIcon from "assets/svg/userprofile.png";
import "./style.css";
import TasksActionsComponent from '../ObjectivesTable/TasksActionsComponent';

export default function TaskMobileItem({ privileges, row, selectedUsers = [], setSelectedUsers, handleViewTask, setViewModalTask, handleEditTask, setEditModalTask, handleDeleteTasks }) {
  const [expandObjective, setExpandObjective] = useState(false);
  return (
    <div className="ml-2 bg-white">
      <div className='m-3 p-1 d-flex justify-content-between align-items-center'>
        <div className='row'>
          <i className={`mr-2 text-gray fa fa-caret-${expandObjective ? 'down' : 'right'}`} onClick={() => setExpandObjective(!expandObjective)} />
          <input type="checkbox" checked={selectedUsers.filter(item => item._id === row._id).length > 0} onChange={() => setSelectedUsers(row)} />
        </div>
        <div className='row'>
          <TasksActionsComponent privileges={privileges} row={row} handleViewTask={handleViewTask} setViewModalTask={setViewModalTask} handleEditTask={handleEditTask} setEditModalTask={setEditModalTask} handleDeleteTasks={handleDeleteTasks} />
          <AttachmentComponent row={row} />
        </div>
      </div>
      {expandObjective ? <div className='p-1 objectives'>
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>TASK</h4>
          <h4 className='col-8 font-weight-bold'>{row.title}</h4>
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
            {row.status === "notstarted" ? "Not Started" : (row.status === "inprogress" ? "In Progress" : "Completed")}
          </h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>ACTION</h4>
          <h4 className='col-8'>
            <TasksActionsComponent privileges={privileges} row={row} handleViewTask={handleViewTask} setViewModalTask={setViewModalTask} handleEditTask={handleEditTask} setEditModalTask={setEditModalTask} handleDeleteTasks={handleDeleteTasks} />
          </h4>
        </div>
      </div> : <div className='p-1 objectives'>
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>TASK</h4>
          <h4 className='col-8 font-weight-bold'>{row.title}</h4>
        </div>
        <div className='text-12'>
          {row.status === "notstarted" ? "Not Started" : (row.status === "inprogress" ? "In Progress" : "Completed")}
        </div>
      </div>}
    </div>
  )
}
