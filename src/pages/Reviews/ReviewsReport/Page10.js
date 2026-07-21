import React from "react";
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import "./styles.scss";
import TableView2 from "./TableView2";
import TableView3 from "./TableView3";
import { t } from "i18next";
export default function Competensis({ report, pageNumber }) {
  return (
    <div className="container">
      <div className="">
        <div className="mt-5 mb-5">
          <Heading fullname={report.fullname} />
          <h1 className="head-1 mt-5">
            {t("ReviewsReport.Highest Rated Competencies and Areas To Improve")}
          </h1>
        </div>
        <div>
          <p>
            {t("ReviewsReport.The Highest Rated Competencies and Areas to Improve overview summarizes your strengths from the review for the last quarter. This makes it very easy to identify commonalities and themes to summarize your strengths and areas of high-level effectiveness across the responses of your Managers, Peers and yourself.")}
          </p>
        </div>
        {report.report.scoreSelf.length > 0 && report.report.scoreSelf.filter(item => item.averageScore > 2).length > 0 && <div>
          <h6>{t("ReviewsReport.Highest Rated Competencies")}</h6>
        </div>}
        {report.report.scoreSelf.length > 0 && report.report.scoreSelf.filter(item => item.averageScore > 2).length > 0 && <TableView2 report={report} />}
        {report.report.scoreSelf.length > 0 && report.report.scoreSelf.filter(item => item.averageScore <= 2).length > 0 && <div>
          <h6>{t("ReviewsReport.Areas To Improve")}</h6>
        </div>}
        {report.report.scoreSelf.length > 0 && report.report.scoreSelf.filter(item => item.averageScore <= 2).length > 0 && <TableView3 report={report} />}
        <div>
          <p className="footer-desc mb-5">
            {t("ReviewsReport.The number of competencies listed are the top 10% of all average scores of each item from the assessment per respondent group. If the same items is rated in the top 10% of your Manager’s or Peer’s assessment of you, it is indicated with the green dot. Additionally, If the average of an item is below 2.00 the item will not be listed as a highest rated items.")}
          </p>
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}
