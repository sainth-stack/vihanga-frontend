import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useGetAuditHistory, { useGetPrediction } from '../hooks/useGetAuditHistory';
import { LoadingIndicator } from 'utilities';

import SliderLarge from 'components/SliderLarge';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: false,
    title: {
      display: true,
      text: 'KR Prediction',
    },
  },
};
export default function PredictionChart({ krId, okrdetails }) {
  let requestBody = {
    createdAt: window.moment(okrdetails.createdAt).format("YYYY-MM-DDTHH:mm:ss"),
    updatedAt: window.moment(okrdetails.updatedAt).format("YYYY-MM-DDTHH:mm:ss"),
    progress: parseFloat(okrdetails.percent),
    targetDate: window.moment(okrdetails.targetDate).format("YYYY-MM-DDTHH:mm:ss")
  }
  const { data, isLoading, isError, error } = useGetAuditHistory(krId);
  const { data: predictionResponse, isLoading: predictLoading, error: predictError } = useGetPrediction(requestBody);
  const [formattedData, setFormattedData] = useState({
    labels: [],
    datasets: []
  });
  const [probability, setProbability] = useState(0);
  const fromatData = () => {
    const labels = data.length > 0 ? data.map(item => window.moment(item.updatedAt).format("DD/MM")) : [];
    const targets = data.length > 0 ? data.map(item => item.dataDocument.target) : [];
    const actuals = data.length > 0 ? data.map(item => item.dataDocument.actual) : [];
    const formatted = {
      labels,
      datasets: [
        {
          id: 1,
          label: 'Target',
          data: targets,
          backgroundColor: 'transparent',
          borderColor: "transparent",
        },
        {
          id: 2,
          label: 'Actual',
          data: actuals,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          borderColor: "rgb(53, 162, 235)"
        },
      ],
    };
    setFormattedData(() => formatted);
  }
  useEffect(() => {
    if (!isLoading) {
      fromatData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data])
  useEffect(() => {
    if (!predictLoading) {
      setProbability(() => predictionResponse.data.probability);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictLoading, predictionResponse])
  return (
    <div>
      {isError && <p className='text-danger'>{error.toString()}</p>}
      {isLoading && <LoadingIndicator />}
      {!isLoading && <div>
        <Line options={options} data={formattedData} />
        <p className='text-center mt-3'>There is a <b>{probability && parseInt(probability.split("%")[0]) > 0 ? parseFloat(probability.split("%")[0]) + "%" : 0 + "%"}</b> chance you will complete this by <b>{window.moment(okrdetails.targetDate).format("DD/MM/YYYY")}</b>.</p>
        {!predictLoading && <SliderLarge progressStatus={probability && parseInt(probability.split("%")[0]) > 0 ? parseFloat(probability.split("%")[0]) : 0} onChange={() => { }} disabled />}
      </div>}
    </div>
  )
}
