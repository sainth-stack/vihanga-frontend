export const chartConfigs = {
    totalWeight: {
      chartData: {
        datasets: [
          {
            data: [100, 0],  // 100% filled
            backgroundColor: ["#847F3B", "#E0E0E0"], // Main color and light grey
            hoverBackgroundColor: ["#847F3B", "#E0E0E0"],
            borderWidth: 0,
          },
        ],
      },
      percentage: 90,
      centerLabel: "Total Weight ",
    },
    totalWeightAchievement: {
        chartData: {
          labels: ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"],
          datasets: [
            {
              data: [50, 30, 10, 20],
              backgroundColor: ["#DB5C32", "#FCD964", "#519D74", "#BEA781"],
              hoverBackgroundColor: ["#DD5A22", "#F4CA3E", "#55844F", "#C2AA81"],
              borderWidth: 0,
            },
          ],
        },
        percentage: 90, // Total Weight Achievement in %
        centerLabel: "Total Weight Achievement",
      },
  };
  