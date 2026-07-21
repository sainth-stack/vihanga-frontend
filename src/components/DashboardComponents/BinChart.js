import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Bin View',
    },
  },
};


export function BinChart({ ratingLabels = [], values = [], empPercentages = [] }) {

  const labels = ratingLabels.length > 0 ? ratingLabels : ['1. Ineffective', '2. Somewhat Achieved', '3. Achieved', '4. OverPerformed', '5. Outstanding'];

  const [data, setData] = useState({
    labels,
    datasets: [
      {
        label: '% of employees rating',
        data: empPercentages.length > 0 ? empPercentages : [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Guidelines Percentage %',
        data: values.length > 0 ? values : [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });
  return <Bar options={options} data={data} />;
}
