import React from "react";
import "./styles.scss";
import self from '../../../assets/svg/self.svg'
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { t } from "i18next";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
export default function CompetencyOverview({ report, pageNumber }) {
  let scores = report.report.scoreSelf.map(item => item.averageScore);
  let lowestScore = report.report.scoreSelf.map(item => item.averageScore).sort((a, b) => a < b ? 1 : -1)
  let highestScore = report.report.scoreSelf.map(item => item.averageScore).sort((a, b) => a > b ? 1 : -1)
  const data = {
    labels: [...report.report.scoreSelf.map(item => item.category)],
    //labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
    datasets: [
      {
        label: 'Average Score',
        data: [...scores],
        //data: [2, 9, 3, 5, 2, 3],
        backgroundColor: 'white',
        borderColor: '#0097e3',
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="container">
    <div className="bg-white mt-5 mb-5">
      <Heading fullname={report.fullname} />
      <div>
        <h1 className="head-1 mt-5">{t("ReviewsReport.Competency Overview & Gaps")}</h1>
        <h2 className="subHeading mt-2">{t("ReviewsReport.Overall Competency Overview")}</h2>
        <div className="mt-4">
          <p style={{ width: '95%' }}>
            {t("ReviewsReport.The Overall Competency Overview breaks down your assessment results and allows for an easy understanding and comparison of your competencies. The N signifies the scores across which the responses for each competency are graded.")}
          </p>
        </div>
        <div>
          <div className="text-center d-flex justify-content-center align-items-center">
            <div className="col-md-4">
              <Radar style={{ padding: 10, marginTop: "20px" }} data={data} />
            </div>
          </div>
          <div className="text-center">
            <img src={self} alt="self" />
          </div>
        </div>
        <div className="mt-4">
          <p style={{ width: '95%' }}>
            {t("ReviewsReport.Graph Summary: Lowest score is")} {lowestScore[0]} {t("ReviewsReport.and Highest score is")} {highestScore[0]}
          </p>
        </div>
      </div>
    </div>
    <PageNumber pageNumber={pageNumber} />
  </div>
  );
}