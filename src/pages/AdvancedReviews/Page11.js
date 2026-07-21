import React from "react";
import "./styles.scss";
import page13vector from "../../assets/svg/page13vector.svg";
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import TableView4 from "./TableView4";
import smileEmoji from '../../assets/svg/smileEmoji.svg'
import neutralEmoji from '../../assets/svg/neutralEmoji.svg'
export default function FeedbackSummary({ report, pageNumber }) {
  const overallRating = Number(report.report.overallRating);
  return (
    <div className="container">
      <div className="bg-white h-100 mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div>
          <h1 className="head-1 mt-5">Feedback Summary</h1>
          <h5 className="subHeading-13 mt-3">Job-related Performance Feedback</h5>
          <div className="mt-3">
            <p className="description-13">We asked your Managers and Peers to describe some experiences about your individual performance in the projects you have worked on. This is the feedback they had for you in regards to your job-related performance for the last quarter.</p>
          </div>
          <div className="mt-3">
            <h5 className="subHeading-13 mt-3">Managers</h5>
          </div>
          <div className="pt-2">
            Based on the feedback from your Managers, we performed an AI-driven Sentiment Analysis on their responses to give us an overall indication of their perception of your job-related performance for the last quarter.<br />
            The analysis results show that your Manager’s sentiment for your job-related performance was <span style={{ fontWeight: 'bold' }}>{overallRating > 2 ? "GOOD" : "NEUTRAL"}</span>
          </div>
          <TableView4 rating={overallRating > 2 ? "Good" : "Neutral"} emoji={overallRating > 2 ? smileEmoji : neutralEmoji} />
          <div className="mt-3">
            <h5 className="subHeading-13 mt-3">Peers</h5>
            <div className="pt-1">
              This is what your peers had to say about your job-related performance for the last quarter...
            </div>
          </div>
          <div className="mt-5 text-center">
            <img src={page13vector} width="70%" alt="logo" />
          </div>
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}