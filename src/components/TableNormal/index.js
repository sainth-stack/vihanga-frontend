import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
// import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import './style.scss';


export default function TableNormal({ paginationFactory, data, columns, title, selectRow, updatepage, hideColumns,keyField="id" }) {
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total mb-0" style={{ marginTop: "-28px", color: "white", width: "30%" }}>
      {from} - {to} of {size}
    </span>
  );
const pageListRenderer = ({ pages, onPageChange, currentPage }) => {
  const visiblePages = pages.filter(p => typeof p.page !== "string");

  return (
    <div className="custom-pagination">
      <button
        className="nav-btn"
        onClick={() => {
          const prev = currentPage > 1 ? currentPage - 1 : 1;
          onPageChange(prev);
        }}
      >
        &lt; Back
      </button>

      {visiblePages.map((p, index) => (
        <button
          key={index}
          className={`page-btn ${p.page === currentPage ? "active" : ""}`}
          onClick={() => onPageChange(p.page)}
        >
          {p.page}
        </button>
      ))}

      <button
        className="nav-btn"
        onClick={() => {
          const next = currentPage < pages[pages.length - 1].page
            ? currentPage + 1
            : pages[pages.length - 1].page;
          onPageChange(next);
        }}
      >
        Next &gt;
      </button>
    </div>
  );
};

  const options = {
    pageListRenderer,
    paginationSize: 10,
    pageStartIndex: 0,
    alwaysShowAllBtns: true,
    withFirstAndLast: false,
    prePageText: '<',
    nextPageText: '>',
    paginationPosition: "bottom",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
     hideSizePerPage: true
    // A numeric array is also available. the purpose of above example is custom the text
  };
  return (
    <div className="pt-3 pb-3">
      <div  sx={{
        border: "1px solid #85803c",
        borderRadius: "1rem",
      }}>
        <BootstrapTable
          keyField={keyField}
          data={data || []}
          columns={columns || []}
          classes="table border-golden"
          bordered={false}
          rowStyle={{
            fontWeight: 400
          }}
          bootstrap4
          pagination={paginationFactory(options)}
          selectRow={selectRow}
          noDataIndication="No data"
        />
      </div>
    </div>
  );
}
