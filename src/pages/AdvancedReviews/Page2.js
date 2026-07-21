import React from "react";
import "./styles.scss";
import feedback from "assets/svg/feedback.svg";
import Heading from "./Heading";
import PageNumber from "./PageNumber";

export default function FeedbackContent({ report, pageNumber }) {
  return (
    <div className="container">
      <div className="vh-100 mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div>
          <h1 className="head-1 mt-5">Feedback Report Contents</h1>
        </div>
        <div className="container mt-3">
          <div className="row ">
            <table className="table table-hovered">
              <tr>
                <td>03</td>
                <td>Overview of Participant & Responses</td>
              </tr>
              <tr>
                <td>04</td>
                <td>Competency Overview and Gaps</td>
              </tr>
              <tr>
                <td>05</td>
                <td>Key Takeaways</td>
              </tr>

              <tr>
                <td>06</td>
                <td>Highest Rated Competencies and Areas To Improve</td>
              </tr>
              <tr>
                <td>07</td>
                <td>Feedback Summary</td>
              </tr>
              <tr>
                <td>08</td>
                <td>The Way Forward</td>
              </tr>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-end mr-5 mt-5 pt-5">
          <img className="" src={feedback} alt={feedback} />
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div >
  );
}
