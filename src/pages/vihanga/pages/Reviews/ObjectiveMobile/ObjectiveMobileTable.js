import React from 'react'
import { useState } from 'react'
import ObjectiveMobileItem from './ObjectiveMobileItem'

export default function ObjectiveMobileTable({ data = [], columns = [], privileges, companyInfo, handleEdit, setEditModal, handleDelete, setOrderModalShow4, setMultipleObjectives, setSelectedObjective, refreshData, selectedUsers, setSelectedUsers }) {
  const [pageSize, setPageSize] = useState(10);
  const [startPage, setStartPage] = useState(0);
  return (
    <div className='mb-5'>
      {data.length > 0 && data.slice(startPage, pageSize).map((row, index) => (
        <React.Fragment key={row._id}>
          <ObjectiveMobileItem privileges={privileges} row={row} companyInfo={companyInfo} handleEdit={handleEdit} setEditModal={setEditModal} handleDelete={handleDelete} setOrderModalShow4={setOrderModalShow4} setMultipleObjectives={setMultipleObjectives} setSelectedObjective={setSelectedObjective} refreshData={() => refreshData()}
            selectedUsers={selectedUsers}
            setSelectedUsers={(row) => setSelectedUsers(row)}
          />
        </React.Fragment>
      ))}
      <div className='d-flex justify-content-around align-items-center text-12 bg-pagination'>
        <div className='row'>
          <p>Rows per page: </p>
          <div className="dropdown actionDropdown">
            <button
              className="dropdown-hide d-toggle text-white bg-teal"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {pageSize} <i className='text-white fa fa-caret-down' />
            </button>
            <div
              className="dropdown-menu text-left "
              aria-labelledby="dropdownMenuButton"
            >
              <button className='btn btn-default' onClick={() => setPageSize(10)}>10</button>
              <button className='btn btn-default' onClick={() => setPageSize(20)}>20</button>
              <button className='btn btn-default' onClick={() => setPageSize(50)}>50</button>
              <button className='btn btn-default' onClick={() => setPageSize(100)}>100</button>
            </div>
          </div>
        </div>
        <div>
          <p>{pageSize < data.length ? pageSize : data.length} of {data.length}</p>
        </div>
        <div className='row mtminus-10'>
          <i className='btn text-white fa fa-angle-left mr-2' onClick={() => startPage > 0 && setStartPage(startPage - pageSize)} />
          <i className='btn text-white fa fa-angle-right ml-2' onClick={() => pageSize < data.length && setStartPage(startPage + pageSize)} />
        </div>
      </div>
    </div>
  )
}
