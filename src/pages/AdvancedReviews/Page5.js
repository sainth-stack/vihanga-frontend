import React from "react";
import "./styles.scss";
import page8 from '../../assets/svg/page8.svg'
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
export default function Conscientiousness({ report, selfReport, managerReport, peersReport, groupReport, pageNumber }) {
  let averageScore = [...selfReport.definitions].sort((a, b) => a.averageScore < b.averageScore ? 1 : -1)[0].averageScore;
  let averageScoreLow = [...selfReport.definitions].sort((a, b) => a.averageScore < b.averageScore ? -1 : 1)[0].averageScore;

  const options2 = {
    plugins: {
      legend: false,
      title: {
        display: false,
      },
    },
    responsive: true
  };

  let labels = ["Self & Group Average", "Manager & Group Average", "Peers & Group Average"];
  const data1 = {
    labels: labels,
    datasets: [
      {
        id: 1,
        label: "Self/Manager/Peers",
        data: [selfReport.averageScore, managerReport.averageScore, Object.keys(peersReport).length > 0 ? peersReport.averageScore : 0],
        backgroundColor: 'blue',
      },
      {
        id: 2,
        label: "Group Average",
        data: [groupReport.averageScore, groupReport.averageScore, groupReport.averageScore],
        backgroundColor: '#000',
      },
    ],
  };
  return (
    <div className="container">
      <div className="bg-white h-100 mt-5 mb-5">
        <Heading fullname={report.fullname} />
        <div>
          <h1 className="head-1 mt-5">{selfReport.category}</h1>
          <div className="mt-5 text-center d-flex justify-content-center align-items-center">
            <div className="col-md-3">
              <img src={page8} width="70%" alt="chart" />
            </div>
            <div className="col-md-9">
              <Bar style={{ padding: 10, marginTop: "20px" }} options={options2} data={data1} />
            </div>
          </div>

          <div className="mt-5 text-center">
            <table class="">
              <thead>
                <tr className='thead text-center'>
                  <th scope="col" style={{ width: '40%', textAlign: 'start' }} className="p-2 bg-green text-white border-left-radius-10">Individual Elements Breakdown</th>
                  <th scope="col" className="p-2 text-white bg-green">Self</th>
                  <th scope="col" className="p-2 text-white bg-green">Manager</th>
                  <th scope="col" className="p-2 text-white bg-green">Peers</th>
                  <th scope="col" className="p-2 text-white bg-green border-right-radius-10">Average</th>

                </tr>
              </thead>
              <tbody>
                {selfReport.definitions.length > 0 && selfReport.definitions.map((definition, index) => (
                  <tr className='row1'>
                    <th scope="row" style={{ textAlign: 'start' }} className={`p-2 ${index === selfReport.definitions.length - 1 ? 'border-left-bottom-radius-10' : ''}`}>{definition.defination}</th>
                    <td className="p-2 text-center">{definition.averageScore}</td>
                    <td className="p-2 text-center">{managerReport.definitions[index].averageScore}</td>
                    <td className="p-2 text-center">{Object.keys(peersReport).length > 0 ? peersReport.definitions[index].averageScore : 0}</td>

                    <td className="p-3 text-center d-flex justify-content-center align-items-center">
                      <div className={`${groupReport.definitions[index].averageScore < 2 ? 'red-circle' : 'green-circle'}`}>{groupReport.definitions[index].averageScore}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pt-4 pb-4">
            <h5>Key Takeaways </h5>
            Based on the overall average of your results of the <span style={{ fontWeight: 'bold' }}>{selfReport.category}</span> competency breakdown, your capability to <span style={{ fontWeight: 'bold' }}>{selfReport.definitions.sort((a, b) => a.averageScore < b.averageScore ? 1 : -1)[0].defination}</span>  has been <span className="font-weight-bold">{averageScore <= 1 ? "Highly Unsatisfactory" : (averageScore > 1 && averageScore <= 2 ? "Unsatisfactory" : (averageScore > 2 && averageScore <= 3 ? "Satisfactory" : "Highly Satisfactory"))}</span> for the effectiveness of your team and for TalentSpotify. <br /><br />
            Your capability to <span className="font-weight-bold"> {selfReport.definitions.sort((a, b) => a.averageScore < b.averageScore ? -1 : 1)[0].defination}</span> has been <span className="font-weight-bold">{averageScoreLow <= 1 ? "Highly Unsatisfactory" : (averageScoreLow > 1 && averageScoreLow <= 2 ? "Unsatisfactory" : (averageScoreLow > 2 && averageScoreLow <= 3 ? "Satisfactory" : "Highly Satisfactory"))}</span> for the effectiveness of your team and for TalentSpotify.
          </div>
        </div>
      </div>
      <PageNumber pageNumber={pageNumber} />
    </div>
  );
}