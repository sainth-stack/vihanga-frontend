import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { LoadingIndicator } from "utilities";
ChartJS.register(ArcElement, Tooltip, Legend);
export default function PieChartRewards({ redeemed, remaining }) {
  const [loading] = useState(false);

  const [datas] = useState({
    labels: ["Redeemed Points", "Remaining Points"],
    datasets: [
      {
        label: "OKR Progress",
        data: [redeemed, remaining],
        backgroundColor: ["tomato", "green"],
        borderColor: ["tomato", "green"],
        borderWidth: 1,
      },
    ],
  });
  return loading ? <LoadingIndicator /> : <Doughnut data={datas} options={options} />;
}

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};
