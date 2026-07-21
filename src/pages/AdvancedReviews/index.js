import React, { useEffect, useState } from "react";
import "./styles.scss";
import search from "assets/svg/search.svg";
import TableNormal from "components/TableNormal";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useDispatch } from "react-redux";
import Page1 from "./page1";
import Page2 from "./Page2";
import Page3 from "./page3";
import Page4 from "./page4";
import Page4Two from "./Page4Two";
import Page4Three from "./Page4Three";
import Page5 from "./Page5";
import Page10 from "./Page10";
import Page11 from "./Page11";
import Page12 from "./Page12";
import Page13 from "./page13";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAdvancedLaunchForms } from "pages/Reviews/hooks/usegetReview";
import { deleteForm } from "action/AdvancedLaunchFormAct";
import { AuthRole, AuthTab, AuthUserId, LoadingIndicator } from "utilities";
import { t } from "i18next";

export default function AdvancedReviews() {
  const queryClient = useQueryClient();
  const [data2] = useState([]);
  const [, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [report] = useState(null);
  const dispatch = useDispatch();
  const { data: ReviewResponse, isLoading } = useGetAdvancedLaunchForms();

  const handleDelete = (id) => {
    let response = dispatch(deleteForm(id));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        queryClient.invalidateQueries("reviewsForm");
      } else {
        setLoading(false);
      }
    });
  };

  const columns = [
    {
      dataField: "name",
      text: "Employee",
      sort: true,
      formatter: (cellContent, row) => {
        const { templateId, name, type } = row;
        return (
          <div>
            {name} <span className="text-capitalize">({type})</span>
            <i
              className="fa fa-trash cursor-pointer ml-2"
              onClick={() => handleDelete(templateId)}
            />
          </div>
        );
      },
    },
    {
      dataField: "startDate",
      text: "Start date",
      sort: true,
      formatter: (cellContent, row) => {
        return <div>{row.reviewPeriodStartDate}</div>;
      },
    },
    {
      dataField: "endDate",
      text: "End date",
      sort: true,
      formatter: (cellContent, row) => {
        return <div>{row.reviewPeriodEndDate}</div>;
      },
    },

    {
      dataField: "formName",
      text: "Form Name",
      sort: true,
      formatter: (cellContent, row) => {
        return <div>{row.formName}</div>;
      },
    },
    {
      dataField: "templateName",
      text: "Template",
      sort: true,
      formatter: (cellContent, row) => {
        return <div>{row.templateName}</div>;
      },
    },
    {
      dataField: "status",
      text: t("Tasks.Status"),

      sort: true,
      formatter: (cellContent, row) => {
        const { _id, userId, role, templateId, canViewReport, toEmployeeName } =
          row;
        return (
          <div>
            {row.status === "Take Review" ? (
              <button
                className="btn btn-primary bg-green"
                onClick={() => {
                  localStorage.setItem(
                    "reviewData",
                    JSON.stringify({
                      id: userId,
                      role: role,
                      templateId: templateId,
                      name: toEmployeeName,
                      toEmployeeId: _id,
                    })
                  );
                  document.getElementById("chatbotApp").style.display = "none";
                  document.getElementById("chatbotApp").style.display = "block";
                  document.getElementById("chatbotApp").style.display ===
                  "block"
                    ? document
                        .getElementById("chatbotIcon")
                        .classList.add("rotateIcon")
                    : document
                        .getElementById("chatbotIcon")
                        .classList.remove("rotateIcon");
                }}
              >
                Take Review
              </button>
            ) : (
              <ViewReportComponent
                _id={_id}
                templateId={templateId}
                canViewReport={canViewReport}
                userId={userId}
              />
            )}
          </div>
        );
      },
    },
  ];

  const ViewReportComponent = ({ _id, templateId, canViewReport, userId }) => {
    const isManagerOrHR = ["Manager", "HR Admin"].includes(AuthRole);
    const isHRAdmin = isManagerOrHR && AuthTab === "myteam";
    const isEmployee = AuthUserId === userId && AuthTab === "me";
    return (
      <>
        {canViewReport && (isHRAdmin || isEmployee) ? (
          <a
            href={"/admin/advancedreviews/" + _id + "/" + templateId}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Report
          </a>
        ) : (
          <p>Reviewed</p>
        )}
      </>
    );
  };

  const getAllReview = () => {
    try {
      const { data = [] } = ReviewResponse;
      if (data && data.length > 0) {
        setReviews(data);
      }
    } catch (error) {
      setError(error.toString());
    }
  };

  useEffect(() => {
    getAllReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReviewResponse]);

  const filterData = (data) => {
    if (searchKeyword) {
      return data.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.formName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.templateName
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          item.type.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      });
    }
    return data;
  };

  return (
    <div className="bg-light-primary rounded-12 p-4 m-4">
      {isLoading ? (
        <div className="d-flex justify-content-center">
          {" "}
          <LoadingIndicator />
        </div>
      ) : (
        <div className="contain-review">
          <div className="d-flex mt-5">
            <div className="input-group-append searchInput-icon-adv ">
              <img
                src={search}
                alt="search-icon"
                width="20"
                height="20"
                className="searchIcon-reviews"
              />
            </div>
            <div className="d-flex ">
              <div>
                <input
                  type="text"
                  className="bg-gray outline-none searchInput-adv text-dark mt-0 fs14"
                  placeholder={"Search Review "}
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  autoComplete="off"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <TableNormal
              className="react-bootstrap-table table"
              title="objectives"
              keyField="_id"
              data={filterData(reviews)}
              columns={columns}
              paginationFactory={paginationFactory}
              data2={data2}
            />
          </div>
          {report && (
            <div className="c1 mt-2 printable">
              <Page1 report={report} pageNumber={1} />
              <Page2 report={report} pageNumber={2} />
              <Page3 report={report} pageNumber={3} />
              <Page4 report={report} pageNumber={4} />
              <Page4Two report={report} pageNumber={4} />
              <Page4Three report={report} pageNumber={4} />
              {report.report.scoreSelf.length > 0 &&
                report.report.scoreSelf.map((selfReport, index) => (
                  <Page5
                    report={report}
                    pageNumber={5}
                    selfReport={report.report.scoreSelf[index]}
                    managerReport={report.report.scoreManager[index]}
                    peersReport={report.report.scorePeers[index]}
                    groupReport={report.report.groupScore[index]}
                  />
                ))}
              <Page10 report={report} pageNumber={6} />
              <Page11 report={report} pageNumber={7} />
              <Page12 report={report} pageNumber={8} />
              <Page13 report={report} pageNumber={9} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
