import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
// import ToolkitProvider from "react-bootstrap-table2-toolkit";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "./style.scss";

import collapse from "assets/svg/collapse.svg";
import expand from "assets/svg/expand.svg";
import TableChild from "components/TableChild";
import useWindowSize from "components/UseWindowSize";
import { downloadTasksExcel } from "pages/Previleges/OKRManagement/utils";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";

const MyExportCSV = (props) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const handleExport = (format) => {
    if (!props.data || props.data.length === 0) {
      alert("No data to export");
      return;
    }
    switch (format) {
      case "csv":
        exportToCSV(props.data);
        break;
      case "excel":
        exportToExcel(props.data);
        break;
      case "pdf":
        exportToPDF(props.data);
        break;
      default:
        break;
    }
    setShowMenu(false);
  };
  return (
    <div className="justify-content-end" style={{ position: "relative", display: "inline-block" }}>
      <button
        className="btn btn-success"
        id="exportcsv"
        onClick={() => setShowMenu((prev) => !prev)}
        type="button"
      >
        Export ▼
      </button>
      {showMenu && (
        <div style={{ position: "absolute", top: "100%", right: 0, background: "white", border: "1px solid #ccc", zIndex: 1000 }}>
          <button className="dropdown-item" onClick={() => handleExport("csv")}>Export as CSV</button>
          <button className="dropdown-item" onClick={() => handleExport("excel")}>Export as Excel</button>
          <button className="dropdown-item" onClick={() => handleExport("pdf")}>Export as PDF</button>
        </div>
      )}
    </div>
  );
};

const expandRow = ({
  data,
  data2,
  printing,
  columnsChild,
  columnsChildTasks,
  selectRow,
  paginationFactory,
  searchKey,
  checkboxOptions,
  readonly,
}) => {
  return {
    expanded: data
      .filter((item) => item.children && item.children.length > 0)
      .map((item) => item.id),

    expandColumnRenderer: ({ expanded, rowKey, expandable }) => (
      <img src={expanded ? expand : collapse} alt="collapse" />
    ),
    renderer: (row, rowIndex) => {
      return (
        <div className="ml-3 ">
          <TableChild
            readonly={readonly}
            //data={filterData(data)}
            data={row.children?.length > 0 ? row.children : []}
            columns={
              columnsChild
                ? columnsChild.filter((item) => {
                    let filteredNames = checkboxOptions
                      .filter((checkbox) => checkbox.value)
                      .map((check) => check.name);
                    filteredNames.push("action");
                    filteredNames.push("feed");
                    return filteredNames.includes(item.dataField);
                  })
                : []
            }
            paginationFactory={paginationFactory}
            searchKey={searchKey}
            selectRow={selectRow}
            hideHeader={true}
            childData={{
              data: row.children && row.children.length > 0 ? row.children : [],
              columnsChild: columnsChildTasks ? columnsChildTasks : [],
              searchKey,
              checkboxOptions,
              printing,
            }}
          />
        </div>
      );
    },
  };
};
export default function Table({
  paginationFactory,
  data,
  columns,
  title,
  selectRow,
  childData,
  data2,
  readonly,
  printing,
}) {
  // const printing = useDetectPrint();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const isMobile = useWindowSize();

  const selectRow2 = {
    mode: "checkbox",
    clickToSelect: true,
    //selected: true,
    onSelect: (row) => {
      if (!readonly) {
        let totalData = [...selectedUsers];
        let filterData = totalData.findIndex((item) => item._id === row._id);
        if (filterData < 0) {
          totalData.push(row);
          setSelectedUsers(totalData);
        } else {
          setSelectedUsers(totalData);
        }
      }
    },
    onSelectAll: (isSelected) => {
      if (!readonly) {
        if (isSelected) {
          setSelectedUsers(data);
        } else {
          setSelectedUsers([]);
        }
      }
    },
  };
  const customTotal = (from, to, size) => (
    <span
      className={
        isMobile
          ? "react-bootstrap-table-pagination-total mb-0 pagei"
          : " react-bootstrap-table-pagination-total mb-0 "
      }
      style={{ marginTop: "-28px", color: "white", width: "28%" }}
    >
      {from} - {to} of {size}
    </span>
  );
  const pageListRenderer = ({ pages, onPageChange }) => {
    if (pages.length > 0) {
      const pageWithoutIndication = pages.filter(
        (p) => typeof p.page !== "string"
      );
      return (
        <div className="d-flex align-items-center h-100">
          <button
            className={
              isMobile
                ? "arrow-btn text-capitalize arrowleft"
                : "arrow-btn text-capitalize"
            }
            style={{ marginRight: "30px" }}
            onClick={() => onPageChange(pages[0].page)}
          >
            <span className="gtlt">{pages[0].page} </span>
          </button>
          {pageWithoutIndication.map((p, index) => (
            <button
              key={index}
              className="btn btn-success d-none text-capitalize "
              onClick={() => onPageChange(p.page)}
            >
              {p.page}
            </button>
          ))}
          <button
            className={
              isMobile
                ? "arrow-btn text-capitalize arrowright"
                : "arrow-btn text-capitalize"
            }
            onClick={() => onPageChange(pages[pages.length - 1].page)}
          >
            <span className="gtlt">{pages[pages.length - 1].page}</span>
          </button>
        </div>
      );
    }
  };
  const options = {
    pageListRenderer,
    paginationSize: printing ? data.length : 10,
    pageStartIndex: 0,
    alwaysShowAllBtns: true,
    withFirstAndLast: true,
    prePageText: "<",
    nextPageText: ">",
    paginationPosition: "bottom",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "25",
        value: 25,
      },
      {
        text: "50",
        value: 50,
      },
      {
        text: "100",
        value: 100,
      },
      {
        text: "All",
        value: data.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };
  return (
    <div className="pt-3 pb-3 printonly">
      {/* <ToolkitProvider
        keyField="id"
        columns={columns}
        data={data}
        exportCSV={{
          fileName:
            title +
            "-" +
            window.moment(new Date()).format("ddd") +
            "-" +
            window.moment(new Date()).format("mmm") +
            "-" +
            window.moment(new Date()).format("YYYY") +
            "-" +
            window.moment(new Date()).format("DD-MM-YYYY-hhMMss A") +
            ".csv",
        }}
      > */}
        {(props) => (
          <div>
            {data.length > 0 && <MyExportCSV {...props.csvProps} data={data} />}
            <BootstrapTable
              {...props.baseProps}
              wrapperClasses="table-responsive"
              classes={"border-green"}
              rowStyle={{
                fontWeight: 500,
                borderTop: "2px solid rgba(42, 137, 129, 0.31)",
                //pointerEvents: readonly ? 'none' : 'all'
              }}
              bordered={false}
              bootstrap4
              //pagination={paginationFactory({ sizePerPage: 5 })}
              pagination={paginationFactory(options)}
              selectRow={selectRow}
              expandRow={expandRow({
                ...childData,
                data,
                printing,
                paginationFactory,
                selectRow: selectRow2,
                data2,
                readonly,
              })}
            />
          </div>
        )}
      {/* </ToolkitProvider> */}
    </div>
  );
}
