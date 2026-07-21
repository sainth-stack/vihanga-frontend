import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getObjectivesAndOKRTab } from "action/UserAct";
import { useDispatch } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
  },
};

export default function PieChart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ["On Track","Off Track", "At Risk"],
    datasets: [
      {
        label: "OKR Progress",
        data: [0, 0, 0],
        backgroundColor: [ "#E0582D","#E5B436", "#8A9B50"],
        borderColor: [ "#E0582D","#E5B436", "#8A9B50"],
        borderWidth: 1,
      },
    ],
  });

  const dispatch = useDispatch();

  const fetchObjectives = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    try {
      setLoading(true);
      const response = await dispatch(
        getObjectivesAndOKRTab(user.role, userData.ownerId)
      );

      if (response.data && response.data.length > 0) {
        const okrData = response.data[0];

        setChartData({
          labels: ["Off Track", "At Risk", "On Track"],
          datasets: [
            {
              label: "OKR Progress",
              data: [
                okrData.datasets?.[0]?.data?.[0] || 0,
                okrData.datasets?.[0]?.data?.[1] || 0,
                okrData.datasets?.[0]?.data?.[2] || 0,
              ],
              backgroundColor: ["#E5B436", "#8A9B50", "#E0582D"],
              borderColor: ["#E5B436", "#8A9B50", "#E0582D"],
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } else {
        setLoading(false);
        setError("No Data Found!");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Unexpected error");
    }
  };

  useEffect(() => {
    fetchObjectives();
  }, []);

  return (
    <div className="mb-5 pb-5 h-auto d-flex justify-content-center">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Doughnut
          data={chartData}
          options={chartOptions}
          style={{ width: "250px" }}
        />
      )}
    </div>
  );
}
