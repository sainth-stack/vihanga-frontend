import React, { useState } from "react";
import TitleHeader from "components/TitleHeader";
import useWindowSize from "components/UseWindowSize";
import { downloadOpenEndedQuestions } from "./utils";
import Button from "components/Company/Button";
import BrowseFiles from "components/Company/BrowseFiles";
import { useDispatch } from "react-redux";
import {
  createOpenEndedQuestion,
  deleteOpenEndedQuestions,
  getAllOpenEndedQuestions,
} from "action/OpenEndedQuestionsAct";
import { LoadingIndicator } from "utilities";
import TableNormal from "components/TableNormal";
import { selectRow } from "pages/Goals/ObjectivesTable/defaultData";
import { useEffect } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import {
  createCloseEndedQuestion,
  deleteCloseEndedQuestions,
  getAllCloseEndedQuestions,
} from "action/CloseEndedQuestionsAct";
import { t } from "i18next";

const QuestionnaireManagement = () => {
  const isMobile = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [data, setData] = useState([]);
  const [searchKey] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showOpenEndedQuestions, setShowOpenEndedQuestions] = useState(true);
  const dispatch = useDispatch();
  const handleSubmit = (data) => {
    setLoading(true);
    let finalData = data.map((item) => {
      delete item.createdAt;
      delete item.updatedAt;
      return {
        ...item,
      };
    });
    let body = { data: finalData };
    let response = dispatch(createOpenEndedQuestion(body));
    response.then(({ success, message, data }) => {
      if (success) {
        getQuestionsData();
        setLoading(false);
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  };
  const handleSubmitCloseEndedQuestions = (data) => {
    setLoading(true);
    let finalData = data.map((item) => {
      delete item.createdAt;
      delete item.updatedAt;
      let Defination = item.Definition;
      delete item.Definition;
      return {
        ...item,
        Defination,
      };
    });
    let body = { data: finalData };
    let response = dispatch(createCloseEndedQuestion(body));
    response.then(({ success, message, data }) => {
      if (success) {
        getQuestionsData();
        setLoading(false);
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  };
  const getQuestionsData = () => {
    setLoading(true);
    let response = dispatch(
      showOpenEndedQuestions
        ? getAllOpenEndedQuestions()
        : getAllCloseEndedQuestions()
    );
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
    let response = dispatch(
      showOpenEndedQuestions
        ? deleteOpenEndedQuestions(id)
        : deleteCloseEndedQuestions(id)
    );
    response.then(({ success, message }) => {
      if (success) {
        getQuestionsData();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };
  const columns = [
    {
      dataField: "CompetencyName",
      text: "Competency",
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
        return <span>{row.CompetencyName}</span>;
      },
    },
    {
      dataField: "Question",
      text: "Question",
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
        return <span>{row.Question}</span>;
      },
    },
    {
      dataField: "SubCategory",
      text: "Sub Category",
      sort: true,
      style: { width: "10%" },
      hidden: showOpenEndedQuestions ? true : false,
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
        return <span>{row.SubCategory}</span>;
      },
    },
    {
      dataField: "Options",
      text: "Options",
      sort: true,
      style: { width: "10%" },
      hidden: showOpenEndedQuestions ? true : false,
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
        return <span>{row.Options}</span>;
      },
    },
    {
      dataField: "Ranking",
      text: "Ranking",
      sort: true,
      style: { width: "10%" },
      hidden: showOpenEndedQuestions ? true : false,
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
        return <span>{row.Ranking}</span>;
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
      dataField: "action",
      text: "ACTION",
      style: { width: "10%" },
      formatter: (cellContent, row) => {
        return (
          <span>
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

  useEffect(() => {
    getQuestionsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOpenEndedQuestions]);
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
            Questionnaire Management
          </p>

          <div>
            <Button
              text="Open Ended Questions"
              className={`${
                showOpenEndedQuestions
                  ? "text-green font-weight-bold"
                  : "text-black"
              } border`}
              handleClick={() => setShowOpenEndedQuestions(true)}
            />
            <Button
              text="Close Ended Questions"
              className={`${
                !showOpenEndedQuestions
                  ? "text-green font-weight-bold"
                  : "text-black"
              } border`}
              handleClick={() => setShowOpenEndedQuestions(false)}
            />
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <div className="col-8 d-flex">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                showOpenEndedQuestions
                  ? "https://res.cloudinary.com/dbqm9svvp/raw/upload/v1689053868/talentspotifypics/OpenEndedQuestions_Template_srejmo.xlsx"
                  : "https://res.cloudinary.com/dbqm9svvp/raw/upload/v1689058925/talentspotifypics/CloseEndedQuestions_Template_ep1o6b.xlsx"
              }
            >
              <Button
                text="Download Template"
                className="mt-0 bg-green border-grey text-white"
              />
            </a>
            <Button
              text="Download Questions"
              handleClick={() =>
                downloadOpenEndedQuestions(
                  data,
                  showOpenEndedQuestions
                    ? "OpenEndedQuestions"
                    : "CloseEndedQuestions"
                )
              }
              className="mt-0 bg-green border-grey text-white"
            />
          </div>
          <div>
            {selectedUsers.length > 0 && (
              <Button
                text={t("objectives.Create")}
                className="bg-green border text-white"
                handleClick={() => alert("Functionality Not Implemented!")}
              />
            )}
            <Button
              text={t("objectives.Upload")}
              className="bg-green border text-white"
              handleClick={() => setShowForm(!showForm)}
            />
          </div>
        </div>
        <div></div>
        {showForm && (
          <div className="mt-3">
            {loading ? (
              <LoadingIndicator />
            ) : (
              <BrowseFiles
                className="col-12"
                setData={({ data, url }) => {
                  showOpenEndedQuestions
                    ? handleSubmit(data)
                    : handleSubmitCloseEndedQuestions(data);
                }}
              />
            )}
          </div>
        )}
        <TableNormal
          data={data}
          columns={columns}
          paginationFactory={paginationFactory}
          searchKey={searchKey}
          selectRow={selectRow(selectedUsers, setSelectedUsers, data)}
          keyField={"_id"}
        />
      </div>
    </>
  );
};

export default QuestionnaireManagement;
