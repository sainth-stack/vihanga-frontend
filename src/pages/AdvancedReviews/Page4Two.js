import React from "react";
import "./styles.scss";
import self from '../../assets/svg/selfmanager.svg'
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
  let scoresManager = report.report.scoreManager.map(item => item.averageScore);
  const gapCategories = report.report.averageScores.filter(item => item.isGap);
  const data = {
    labels: [...report.report.scoreSelf.map(item => item.category)],
    datasets: [
      {
        label: 'Self Score',
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
      {
        label: 'Manager Score',
        data: [...scoresManager],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: '#C03D80',
        borderWidth: 1,
        pointBackgroundColor: '#C03D80',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#C03D80'
      }
    ]
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
              The Competency Comparison Overview breaks down your assessment results based on your responses against your assessment results based on your Manager’s responses and allows for an easy gap analysis. The N signifies the scores across which the responses for each competency are graded.  </p>
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
              Based on your assessment results, there is a significant gap in your self-assessment and your Manager’s assessment of yourself for the following competencies:
              {gapCategories.length > 0 && gapCategories.map((item, index) => (
                <span style={{ fontWeight: 'bold' }} key={index}> {item.category} {index !== gapCategories.length - 1 ? "," : ""} </span>
              ))}.

              <br /><br />
              Assessing these significant gaps will promote a constructive dialogue around self-awareness and perception of your Manager, which will give you clarity and help take a positive action for your performance.

            </p>
          </div>
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}