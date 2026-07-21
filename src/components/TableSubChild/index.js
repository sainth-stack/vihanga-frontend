import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
// import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import './style.scss';

//import collapse from 'assets/svg/collapse.svg'
//import expand from 'assets/svg/expand.svg'
//import TableChild from "components/TableChild";

//const MyExportCSV = (props) => {
//  const handleClick = () => {
//    props.onExport();
//  };
//  return (
//    <div className="d-flex justify-content-end">
//      <button className="btn btn-success" onClick={handleClick}>Export</button>
//    </div>
//  );
//};
//const expandRow = ({ data, columnsChild, paginationFactory, searchKey, selectRow, checkboxOptions }) => {
//  return {
//    showExpandColumn: true,
//    expandColumnRenderer: ({ expanded, rowKey, expandable }) => (
//      <img src={expanded ? expand : collapse} alt="collapse" />
//    ),
//    renderer: (row, rowIndex) => (
//      <div>
//        <TableChild
//          //data={filterData(data)}
//          data={data}
//          columns={columnsChild.filter(item => {
//            let filteredNames = checkboxOptions.filter(checkbox => checkbox.value).map(check => check.name);
//            filteredNames.push("action")
//            filteredNames.push("feed")
//            return (
//              filteredNames.includes(item.dataField)
//            );
//          })}
//          paginationFactory={paginationFactory}
//          searchKey={searchKey}
//          selectRow={selectRow}
//        />
//      </div>
//    )
//  }
//};
export default function TableSubChild({ paginationFactory, data, columns, title, selectRow, childData }) {
  //const customTotal = (from, to, size) => (
  //  <span className="react-bootstrap-table-pagination-total mb-0" style={{ marginTop: "-28px", color: "white" }}>
  //    {from} - {to} of {size}
  //  </span>
  //);
  //const pageListRenderer = ({
  //  pages,
  //  onPageChange
  //}) => {
  //  if (pages.length > 0) {
  //    const pageWithoutIndication = pages.filter(p => typeof p.page !== 'string');
  //    return (
  //      <div className="d-flex">
  //        <button className="arrow-btn text-capitalize" style={{ marginRight: "30px" }} onClick={() => onPageChange(pages[0].page)}><span className="gtlt">{pages[0].page} </span></button>
  //        {
  //          pageWithoutIndication.map((p, index) => (
  //            <button key={index} className="btn btn-success d-none text-capitalize" onClick={() => onPageChange(p.page)}>{p.page}</button>
  //          ))
  //        }
  //        <button className="arrow-btn text-capitalize" onClick={() => onPageChange(pages[pages.length - 1].page)}><span className="gtlt">{pages[pages.length - 1].page}</span></button>
  //      </div>
  //    );
  //  }
  //};
  //const options = {
  //  pageListRenderer,
  //  paginationSize: 10,
  //  pageStartIndex: 0,
  //  alwaysShowAllBtns: true,
  //  withFirstAndLast: false,
  //  prePageText: '<',
  //  nextPageText: '>',
  //  paginationPosition: "bottom",
  //  showTotal: true,
  //  paginationTotalRenderer: customTotal,
  //  disablePageTitle: true,
  //  sizePerPageList: [{
  //    text: '10', value: 10
  //  }, {
  //    text: '25', value: 25
  //  }, {
  //    text: '50', value: 50
  //  }, {
  //    text: '100', value: 100
  //  }
  //    //, {
  //    //text: 'All', value: data.length
  //    //}
  //  ] // A numeric array is also available. the purpose of above example is custom the text
  //};
  return (
    <div>
      {/*
      <ToolkitProvider
        keyField="_id"
        columns={columns}
        data={data}
        search
        exportCSV={{
          fileName:
            "TableSubChild-" + window.moment(new Date()).format("YYYY") + "-" + window.moment(new Date()).format("DD-MM-YYYY-hhMMss A") + ".csv",
        }}
      >
        {props => (
          <div className="ml-2 pl-2">
            // Place your table and search bar here if needed
          </div>
        )}
      </ToolkitProvider>
      */}
      <BootstrapTable keyField="_id" columns={columns} data={data} />
    </div>
  );
}
