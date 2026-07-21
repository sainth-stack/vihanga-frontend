import React from "react";
import "./styles.scss";
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import GoalsTable from "../GoalsTable";
import { t } from "i18next";
export default function Overview({ report, pageNumber }) {
  console.log(report?.goals)
  return (
    <div className="container">
    <div className="bg-white vh-100 mt-3 mb-3">
      <Heading fullname={report.fullname} />
      <div>
        <h1 className="head-1 mt-5">{t("ReviewsReport.Overview of Participant & Responses")}</h1>
        <div className="mt-3">
          <p style={{ width: '95%' }}>
            {t("ReviewsReport.The numbers below represent the number of completed surveys submitted by each respondent group prior to the due date. These figures only represent completed, submitted assessments.")}
          </p>
        </div>
        <div>
          <table style={{ borderRadius: '50px' }}>
            <thead>
              <tr className='thead text-center'>
                <th scope="col" className="p-2 bg-green border-left-radius-10"></th>
                <th scope="col" className="p-2 text-white bg-green">{t("ReviewsReport.Report")}<br />N</th>
                <th scope="col" className="p-2 text-white bg-green border-right-radius-10">{t("ReviewsReport.Response Rate")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className='row1 p-2'>
                <th scope="row" className="p-2">{t("ReviewsReport.Self")}</th>
                <td className="p-2 text-center">{report.report.selfCompleted}</td>
                <td className="p-2 text-center">100%</td>
              </tr>
              <tr className='row2'>
                <th scope="row" className="p-2">{t("ReviewsReport.Manager")}</th>
                <td className="text-center">{report.report.managerCompleted}</td>
                <td className="text-center">100%</td>
              </tr>
              <tr>
                <th scope="row" className="p-2 row2 border-left-bottom-radius-10">{t("ReviewsReport.Total")}</th>
                <td className="p-2 text-center row2">{report.report.totalCompleted}</td>
                <td className="p-2 text-center row2 border-right-bottom-radius-10">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <h1 className="head-1 mt-5 mb-3">{t("ReviewsReport.OKR's Rating and Overall Rating")}</h1>
    </div>
    <PageNumber pageNumber={pageNumber} />
  </div>
  );
}