
import React, { useState } from 'react'
import KeyResultsActionsComponent from '../KeyResultsTable/KeyResultsActionsComponent';
import AttachmentComponent from '../KeyResultsTable/AttachmentComponent'
import ProgressStatus from '../ProgressStatus';
import "./style.css";

export default function KeyResultMobileItem({ privileges, handleEdit, setEditModal, handleDelete, refreshData, row }) {
  const [expandObjective, setExpandObjective] = useState(false);
  return (
    <div className="br-left-green shadow rounded-15 bg-white">
      <div className='m-3 p-1 d-flex justify-content-between align-items-center'>
        <div className='row'>
          <i className={`mr-2 text-gray fa fa-caret-${expandObjective ? 'down' : 'right'}`} onClick={() => setExpandObjective(!expandObjective)} />
        </div>
        <div className='row'>
          <KeyResultsActionsComponent privileges={privileges} row={row} handleDeleteKeyResults={handleDelete} refreshData={() => refreshData()} />
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
          <h4 className='col-4 font-weight-bold'>FREQUENCY</h4>
          <h4 className='col-8 font-weight-bold'>{row.frequency}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>UOM</h4>
          <h4 className='col-8 font-weight-bold'>{row.uom}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>POLARITY</h4>
          <h4 className='col-8 font-weight-bold'>{row.polarity}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>MSC</h4>
          <h4 className='col-8 font-weight-bold'>{row.msc}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>TARGET DATE</h4>
          <h4 className='col-8 font-weight-bold'>{row.targetDate}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>ACTUAL DATE</h4>
          <h4 className='col-8'>{window.moment(row.actualDate).format("D MMM YYYY")}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>TARGET</h4>
          <h4 className='col-8'>{window.moment(row.target).format("D MMM YYYY")}</h4>
        </div>
        <hr className='green-line' />
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>ACTUAL</h4>
          <h4 className='col-8'>{window.moment(row.actual).format("D MMM YYYY")}</h4>
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
      </div> : <div className='p-1 objectives'>
        <div className='row'>
          <h4 className='col-4 font-weight-bold'>KEY RESULT</h4>
          <h4 className='col-8 font-weight-bold'>{row.keyResultName}</h4>
        </div>
        <div className='text-12'>
          <ProgressStatus percent={row.progress} updatedAt={row.updatedAt} onEdit={() => {
            if (row.objectiveStatus === "Unlock" || row.objectiveStatus === "Reject" || row.objectiveStatus === "Create" || row.objectiveStatus === "Update") {
              handleEdit(row);
              setEditModal(true);
            }
          }} />
        </div>
      </div>}

    </div>
  )
}
