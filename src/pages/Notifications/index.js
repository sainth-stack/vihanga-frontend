/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./styles.scss";
import paginationFactory from "react-bootstrap-table2-paginator";

import { useDispatch } from "react-redux";
import {
  AuthUserId,
  LoadingIndicator,
} from "utilities";
import TableNormal from "components/TableNormal";
import TitleHeader from "components/TitleHeader";

import { Link } from "react-router-dom";
import { getAllNotificationsByUserAll } from "action/NotificationAct";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      title: data[i].title,
      row: data[i].row,
      companyInfo: data[i].companyInfo,
      operation: data[i].operation,
      path: data[i].path,
      msc: data[i].msc,
      updatedAt: window.moment(data[i].updatedAt).format("YYYY/MM/DD"),
    });
  }
  return items;
};

export default function Notifications() {
  const dispatch = useDispatch();
  let legalEntityObj = {
    legalEntityName: "",
    status: "",
    country: "",
    _id: null,
  };
  const [legalEntitySearch,] = useState(legalEntityObj);
  const [searchKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const columns = [
    {
      dataField: "id",
      text: "S.No",
      csvExport: false,
      hidden: true,
    },
    {
      dataField: "_id",
      text: "_id",
      hidden: true,
    },
    {
      dataField: "title",
      text: "TITLE",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "path",
      text: "DETAILS",
      sort: true,
      csvExport: false,
      formatter: (cellContent, row) => {
        let state = row.path !== "/admin/objectives" ? {
          data: {
            ...row.row,
            objectiveId: row.row._id,
            ownerName: row.companyInfo,
            privileges
          },
        } : null;
        return (
          <Link to={{
            pathname: row.path,
            state
          }
          } title={row.title}>
            View Details
          </Link>
        );
      },
    },
  ];
  const fetchNotifications = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllNotificationsByUserAll(AuthUserId));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setData([]);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const fetchPrivileges = () => {
    try {
      setLoading(true);
      let privileges = getItemFromLocalStorage("privileges");
      setPrivileges(privileges);
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchPrivileges();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <TitleHeader name="Notifications" />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4 fs-14">
        {loading && privileges.length === 0 ? (
          <div className="text-center">
            <LoadingIndicator size={3} />
          </div>
        ) : (
          <TableNormal
            data={data.filter((item) => {
              return (
                item?.legalEntityName
                  ?.toLowerCase()
                  .indexOf(legalEntitySearch.legalEntityName.toLowerCase()) !==
                -1 &&
                item?.status?.indexOf(legalEntitySearch.status) !== -1 &&
                item?.country
                  ?.toLowerCase()
                  .indexOf(legalEntitySearch.country.toLowerCase()) !== -1
              );
            })}
            columns={columns}
            paginationFactory={paginationFactory}
            searchKey={searchKey}
            keyField="_id"
            title="Company"
          />
        )}
        <p className="m-0 fs14 text-center text-danger">
          {error.length > 0 ? error : ""}
        </p>
      </div>
    </div>
  );
}
