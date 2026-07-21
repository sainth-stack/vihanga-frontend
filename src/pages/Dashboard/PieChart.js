import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ performanceData }) {
  const data = {
    labels: ["Employee Submission", "Manager Review", "Calibration", "Manager Sign off", "Employee Sign off", "Completed"],
    datasets: [
      {
        label: 'Performance Review Status',
        data: performanceData,
        backgroundColor: [
          'tomato',
          'Purple',
          'Yellow',
          'Blue',
          'Green',
          '#2A7A7B'
        ],
        borderColor: [
          'tomato',
          'Purple',
          'Yellow',
          'Blue',
          'Green',
          '#2A7A7B'
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom"
      },
    }
  }
  return <Doughnut data={data} options={options} />;
}