import React from "react";
import "./styles.scss";
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import TableView4 from "./TableView4";
import page13vector from "assets/svg/page13vector.svg"
import smileEmoji from "assets/svg/smileEmoji.svg"
import neutralEmoji from "assets/svg/neutralEmoji.svg"
import { t } from "i18next";
export default function FeedbackSummary({ report, pageNumber }) {
  console.log(report)
  const overallRating = Number(report.report.overallRating);
  return (
    <div className="container">
      <div className="bg-white h-100 mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div>
          <h1 className="head-1 mt-5">{t("ReviewsReport.Feedback Summary")}</h1>
          <h5 className="subHeading-13 mt-3">{t("ReviewsReport.Job-related Performance Feedback")}</h5>
          <div className="mt-3">
            <p className="description-13">
              {t("ReviewsReport.We asked your Managers and Peers to describe some experiences about your individual performance in the projects you have worked on. This is the feedback they had for you in regards to your job-related performance for the last quarter.")}
            </p>
          </div>
          <div>
            <p className="subHeading-13 m-0 p-0 mt-3" style={{ fontWeight: 600 }}>{t("ReviewsReport.What Is Your Key Accomplishments In The Last Quarter?")}</p>
            <p className="description-13 p-0 m-0">{report?.overalComments?.cm1 || "No Review"}</p>
          </div>
          <div>
            <p className="subHeading-13 m-0 p-0 mt-3" style={{ fontWeight: 600 }}>{t("ReviewsReport.What Is Your Plan For The Next Quarter? *")}</p>
            <p className="description-13 p-0 m-0">{report?.overalComments?.cm2 || "No Review"}</p>
          </div>
          <div>
            <p className="subHeading-13 m-0 p-0 mt-3" style={{ fontWeight: 600 }}>{t("ReviewsReport.Overall Manager Comments")}</p>
            <p className="description-13 p-0 m-0">{report?.overalComments?.cm3 || "No Review"}</p>
          </div>
          <div className="mt-3">
            <h5 className="subHeading-13 mt-3">{t("ReviewsReport.Managers")}</h5>
          </div>
          <div className="pt-2">
            {t("ReviewsReport.Based on the feedback from your Managers, we performed an AI-driven Sentiment Analysis on their responses to give us an overall indication of their perception of your job-related performance for the last quarter. The analysis results show that your Manager’s sentiment for your job-related performance was")} <span style={{ fontWeight: 'bold' }}>{overallRating > 2 ? t("ReviewsReport.GOOD") : t("ReviewsReport.NEUTRAL")}</span>
          </div>
          <TableView4 rating={overallRating > 2 ? "Good" : "Neutral"} emoji={overallRating > 2 ? smileEmoji : neutralEmoji} />
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}