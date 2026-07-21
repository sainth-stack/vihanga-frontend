import React from "react";
import "./styles.scss";
import self from '../../assets/svg/selfpeers.svg'
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
  let scoresPeers = !!report.report.scorePeers ? report.report.scorePeers.map(item => item.averageScore) : [];
  const data = {
    labels: [...report.report.scoreSelf.map(item => item.category), "Competency 2", "Competency 3", "Competency 4", "Competency 5", "Competency 6",],
    datasets: [
      {
        label: 'Self Score',
        data: [...scores, 3, 4, 5, 6, 7],
        backgroundColor: 'white',
        borderColor: '#0097e3',
        borderWidth: 1,
      },
      {
        label: 'Peers Score',
        data: [...scoresPeers, 3, 4, 5, 6, 7],
        backgroundColor: 'white',
        borderColor: '#9E33EA',
        borderWidth: 1,
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
              The Competency Comparison Overview breaks down your assessment results based on your responses against your assessment results based on your Manager’s responses and allows for an easy gap analysis. The N signifies the scores across which the responses for each competency are graded. </p>
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
              Based on your assessment results, there is a significant gap in your self-assessment and your Manager’s assessment of yourself for the following competencies: <span style={{ fontWeight: 'bold' }}>Adaptability</span> and <span style={{ fontWeight: 'bold' }}>Cooperation</span>.

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