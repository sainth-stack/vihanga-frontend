import React from "react";
import "./styles.scss";
import feedback from "assets/svg/feedback.svg";
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import { t } from "i18next";

export default function FeedbackContent({ report, pageNumber }) {
  return (
    <div className="container">
    <div className="vh-100 mt-5 mb-5">
      <Heading fullname={report.fullname} />
      <div>
        <h1 className="head-1 mt-5">{t("ReviewsReport.Feedback Report Contents")}</h1>
      </div>
      <div className="container mt-3">
        <div className="row">
          <table className="table table-hovered">
            <tbody>
              <tr>
                <td>03</td>
                <td>{t("ReviewsReport.Overview of Participant & Responses")}</td>
              </tr>
              <tr>
                <td>04</td>
                <td>{t("ReviewsReport.OKR's Rating and Overall Rating")}</td>
              </tr>
              <tr>
                <td>05</td>
                <td>{t("ReviewsReport.Competency Overview and Gaps")}</td>
              </tr>
              <tr>
                <td>06</td>
                <td>{t("ReviewsReport.Key Takeaways")}</td>
              </tr>
              <tr>
                <td>07</td>
                <td>{t("ReviewsReport.Highest Rated Competencies and Areas To Improve")}</td>
              </tr>
              <tr>
                <td>08</td>
                <td>{t("ReviewsReport.Feedback Summary")}</td>
              </tr>
              <tr>
                <td>09</td>
                <td>{t("ReviewsReport.The Way Forward")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex justify-content-end mr-5 mt-5 pt-5">
        <img className="" src={feedback} alt="Feedback" />
      </div>
    </div>
    <PageNumber pageNumber={pageNumber} />
  </div>

  );
}
