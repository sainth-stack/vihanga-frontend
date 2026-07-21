import React from "react";
import "./styles.scss";
import self from '../../assets/svg/self.svg'
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
    datasets: [
      {
        label: 'Average Score',
        data: [...scores],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: '#0097e3',
        borderWidth: 1,
        pointBackgroundColor: '#0097e3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0097e3'
      },
    ],
  };
  return (
    <div className="container">
      <div className="bg-white h-100 mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div>
          <h1 className="head-1 mt-5">Competency Overview & Gaps</h1>
          <h2 className="subHeading mt-2">Overall Competency Overview</h2>
          <div className="mt-4">
            <p style={{ width: '95%' }}>
              The Overall Competency Overview breaks down your assessment results and allows for an easy understanding and comparison of your competencies. The N signifies the scores across which the responses for each competency are graded.  </p>
          </div>
          <div >

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
              Graph Summary: Lowest score is {lowestScore[0]} and Highest score is {highestScore[0]}
            </p>
          </div>
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}