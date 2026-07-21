import React, { useState } from "react";
import TitleHeader from "components/TitleHeader";
import useWindowSize from "components/UseWindowSize";
import { useDispatch } from "react-redux";
import { AuthUserId, LoadingIndicator } from "utilities";
import search from "../../../assets/svg/search.svg";
import TableNormal from "components/TableNormal";

import { useEffect } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import {
  deleteRewardPoints,
  getRewardPoints,
  updateRewardPoints,
} from "action/RewardPointsAct";
import "../styles.scss";
import Button from "components/Company/Button";
import trashIcon from "assets/svg/trashIcon.svg";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { t } from "i18next";
const QuestionnaireManagement = () => {
  const isMobile = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [data, setData] = useState([]);
  const [searchKey] = useState("");
  const [value, setValue] = useState(0);

  const dispatch = useDispatch();
  const handleSubmit = (id, data) => {
    setLoading(true);
    let response = dispatch(updateRewardPoints(id, data));
    response.then(({ success, message, data }) => {
      if (success) {
        getRewardPointsData();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };
  const getRewardPointsData = () => {
    setLoading(true);
    let response = dispatch(getRewardPoints(AuthUserId));
    response.then(({ success, message, data }) => {
      if (success) {
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteRewardPoints(id));
    response.then(({ success, message }) => {
      if (success) {
        getRewardPointsData();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };
  const columns = [
    {
      dataField: "employeeName",
      text: "Employee Name",
      sort: true,
      style: { width: "15%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <span>{row.employeeName}</span>;
      },
    },
    {
      dataField: "title",
      text: t("Tasks.Title"),

      sort: true,
      style: { width: "15%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <span>{row.title}</span>;
      },
    },
    {
      dataField: "type",
      text: "Type",
      sort: true,
      style: { width: "25%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <span>{row.type}</span>;
      },
    },
    {
      dataField: "rewardPoints",
      text: "Reward Points",
      sort: true,
      style: { width: "25%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <span>{row.rewardPoints}</span>;
      },
    },
    {
      dataField: "updatedAt",
      text: "Updated Date",
      sort: true,
      style: { width: "10%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <span>{window.moment(row.updatedAt).format("YYYY-MM-DD")}</span>;
      },
    },
    {
      dataField: "isApproved",
      text: "Approval Status",
      sort: true,
      style: { width: "25%" },
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <span>
            {row.isApproved !== "pending" ? (
              <span className="text-capitalize">{row.isApproved}</span>
            ) : (
              <div className="d-flex">
                <button
                  className="btn btn-sm btn-primary bg-green"
                  onClick={() =>
                    handleSubmit(row._id, { ...row, isApproved: "approved" })
                  }
                >
                  Approve
                </button>{" "}
                &nbsp;
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    handleSubmit(row._id, { ...row, isApproved: "rejected" })
                  }
                >
                  Reject
                </button>
              </div>
            )}
            &nbsp;
            <img
              src={trashIcon}
              alt="delete"
              className="cursor-pointer"
              onClick={() => handleDelete(row._id)}
            />
          </span>
        );
      },
    },
  ];
  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    //selected: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers];
      let filterData = totalData.findIndex((item) => item._id === row._id);
      if (filterData < 0) {
        totalData.push(row);
        setSelectedUsers(totalData);
      } else {
        totalData.splice(filterData, 1);
        setSelectedUsers(totalData);
      }
    },
    onSelectAll: (isSelected) => {
      if (isSelected) {
        setSelectedUsers(data);
      } else {
        setSelectedUsers([]);
      }
    },
  };
  useEffect(() => {
    getRewardPointsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <TitleHeader name="Admin Portal - Privileges " />
      <div
        className={
          isMobile
            ? "bg-light-primary rounded-12 "
            : "bg-light-primary rounded-12 mh-100 p-4 m-4"
        }
      >
        <div className="d-flex justify-content-between align-items-center">
          <p
            className={
              isMobile
                ? "title text-dark font-weight-bold text-center"
                : "title text-dark font-weight-bold"
            }
          >
            Reward Points Approval Management
          </p>
        </div>
        <div className="company-form">
          <div>
            <Tabs
              value={value}
              textColor="primary"
              indicatorColor="primary"
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <Tab label="Reward Points" />
            </Tabs>
          </div>
          {value === 0 && (
            <div>
              <div
                className={isMobile ? "col-md-12 circle" : "col-md-7 circle"}
              >
                <div
                  className={
                    isMobile ? "mt-3" : "d-flex justify-content-between mt-5"
                  }
                >
                  <div
                    className={
                      isMobile
                        ? "input-group col-12 circle p-0 nav-item border h43 bg-white"
                        : "input-group col-md-12 circle p-2 nav-item border h10 bg-white"
                    }
                  >
                    <input
                      style={{ borderRadius: "20px" }}
                      type="text"
                      className="outline-none border-0 col-md-11 text-dark fs14 pl-2"
                      placeholder="Search"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="searchText"
                      // value={searchText}
                      // onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="input-group-append searchInput-icon">
                      <img
                        src={search}
                        alt="search-icon"
                        className="searchIcon"
                        style={{
                          marginBottom: "10px",
                        }}
                      />
                    </div>
                  </div>
                  <div className={isMobile ? "text-center" : ""}>
                    <Button
                      text="Create"
                      className={
                        isMobile
                          ? "mt-2 bg-green border-grey text-white"
                          : "mt-0 bg-green border-grey text-white"
                      }
                    />
                  </div>
                  {selectedUsers.length > 0 && (
                    <Button
                      text={t("objectives.Delete")}
                      className="mt-0 bg-green border-grey text-white"
                    />
                  )}
                </div>
              </div>
              {loading ? (
                <LoadingIndicator />
              ) : (
                <TableNormal
                  data={data}
                  columns={columns}
                  paginationFactory={paginationFactory}
                  searchKey={searchKey}
                  selectRow={selectRow}
                  keyField="_id"
                />
              )}
            </div>
          )}
          {value === 1 && (
            <div
              style={{
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Comming Soon!
            </div>
          )}
          {value === 2 && (
            <div
              style={{
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Comming Soon!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionnaireManagement;
