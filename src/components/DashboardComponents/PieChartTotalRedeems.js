import React, { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { LoadingIndicator } from "utilities";
ChartJS.register(ArcElement, Tooltip, Legend);
export default function PieChartTotalRedeems({ redeemHistory }) {
  const [loading] = useState(false);

  const [datas] = useState({
    labels: redeemHistory.map(redeem => redeem.rewardType),
    datasets: [
      {
        label: "OKR Progress",
        data: redeemHistory.map(redeem => redeem.total),
        backgroundColor: ["green", "blue", "red", "brown", "orange", "black", "navy", "yellow"],
        borderColor: ["green", "blue", "red", "brown", "orange", "black", "navy", "yellow"],
        borderWidth: 1,
      },
    ],
  });
  return loading ? <LoadingIndicator /> : <Doughnut data={datas} options={options} width={350} height={350} />;
}

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};
