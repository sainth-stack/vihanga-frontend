import React from "react";
import "./styles.scss";
import page8 from '../../../assets/svg/page8.svg'
import Heading from "./Heading";
import PageNumber from "./PageNumber";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function Conscientiousness({ report, selfReport, pageNumber }) {

  const options2 = {
    plugins: {
      //legend: {
      //  position: 'bottom',
      //},
      legend: false,
      title: {
        display: false,
      },
    },
    responsive: true
  };

  let labels = ["Self Present & Prev Feedback", "Manager Present & Prev Feedback"];
  return (
    <div className="container">
      <div className="bg-white mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div>
          <h1 className="head-1 mt-5">{selfReport.category}</h1>
          <div className="mt-5 text-center d-flex justify-content-center align-items-center">
            <div className="col-md-3">
              <img src={page8} width="70%" alt="chart" />
            </div>
            <div className="col-md-9">
              <Bar style={{ padding: 10, marginTop: "20px" }} options={options2} data={
                {
                  labels,
                  datasets: [
                    {
                      id: 1,
                      label: "Present",
                      data: [selfReport?.selfScore,selfReport?.managerScore],
                      backgroundColor: 'blue',
                    },
                    {
                      id: 2,
                      label: "Previous",
                      data: [selfReport?.prevEmpComp, selfReport?.prevManagerComp],
                      backgroundColor: 'black',
                    },
                  ],
                }
              } />
            </div>
          </div>
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}