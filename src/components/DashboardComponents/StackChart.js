import React, { useState } from 'react'
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
import { useSelector } from 'react-redux';
import { t } from 'i18next';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  const { offsetLeft: positionX } = chart.canvas;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
};
export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      position: 'nearest',
      external: externalTooltipHandler
    }
  },
};
const labels = ['OCR1', 'OCR2', 'OCR3', 'OCR4', 'OCR5', 'OCR6', 'OCR7'];
export const data = {
  labels,
  datasets: [
    {
      id: 1,
      label: 'Dataset 2',
      data: [20, 80, 7, 98, 20, 30, 40],
      backgroundColor: '#3FC429',
    },
    {
      id: 2,
      label: 'Dataset 3',
      data: [10, 40, 14, 58, 15, 25, 20],
      backgroundColor: 'orange',
    },

  ],
};
export default function StackChart(props) {
  let threshold = useSelector((store) => store.user.threshold);
  // getData(props.data)
  // const [labels1,setLabels1] = useState([])
  const data = props.data;
  let user =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  let labels1 = [];
  let dat1 = [];
  let dat2 = [];
  let dat3 = []
  if (['Remaining', 'Achieved'].includes(props.labels[0])) {
    for (let i = 1; i <= data.length; i++) {
      labels1.push("OKR" + i)
    }
  } else if (['Estimated', 'Actual'].includes(props.labels[0])) {
    labels1.push("Tasks")
  }
  let achieved = [];
  let remaining = [];
  achieved = data.map((obj, index) => {
    return obj.completed
  })
  remaining = data.map((obj, index) => {
    return obj.remaining
  })
  const options1 = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
        position: 'nearest',
        external: externalTooltipHandler
      }
    },
  }
  const options2 = {
    plugins: {
      title: {
        display: true,
        text: t("Dashboard.totWeight"),
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  const data1 = {
    labels: labels1,
    datasets: [
      {
        id: 1,
        label: props.labels[1],
        data: achieved,
        backgroundColor: '#3FC429',
      },
      {
        id: 2,
        label: props.labels[0],
        data: remaining,
        backgroundColor: 'orange',
      },

    ],
  };
  if (['Objectives Status', 'Employees'].includes(props.labels[0])) {
    const finalemp = props.employees.filter((item) => {
      if (user._id === item.employmentInformation.lineManager) {
        return true
      }
    })
    const finaData = finalemp.map((item, index) => {
      const totObj = props.objectives.filter((item1) => item._id === item1.employeeReferenceId)
      if (totObj.length > 0) {
        labels1.push(item.personalInformation.firstName + " " + item.personalInformation.lastName)
        let offTrack = totObj.reduce((prev, current) => {
          return prev + (current.progressStatus > 0 ? Number(current.weight * Number(current.progressStatus / 100)) : 0);
        }, 0);
        if (offTrack >= Number(threshold[0].lowValueRange[0].min) && offTrack <= Number(threshold[0].lowValueRange[0].max)) {
          dat1.push(Number(offTrack).toFixed(2));
          dat2.push(0);
          dat3.push(0);
        } else if (offTrack >= Number(threshold[0].midValueRange[0].min) && offTrack <= Number(threshold[0].midValueRange[0].max)) {
          dat2.push(Number(offTrack).toFixed(2));
          dat1.push(0);
          dat3.push(0);
        } else if (offTrack >= Number(threshold[0].highValueRange[0].min) && offTrack <= Number(threshold[0].highValueRange[0].max)) {
          dat3.push(Number(offTrack).toFixed(2));
          dat1.push(0);
          dat2.push(0);
        }
      }

    })
  }
  const data2 = {
    labels: labels1,
    datasets: [
      {
        label: t("Dashboard.offTrack"),
        data: dat1,
        backgroundColor: 'red',
      },
      {
        label: t("Dashboard.atRisk"),
        data: dat2,
        backgroundColor: 'orange',
      },
      {
        label: t("Dashboard.onTrack"),
        data: dat3,
        backgroundColor: 'green',
      },
    ]
  }
  return (
    <>
      <Bar height={'calc(100vh - 480px)'} style={{ padding: 10, marginTop: "20px" }} options={['Objectives Status', 'Employees'].includes(props.labels[0]) ? options2 : options1} data={['Objectives Status', 'Employees'].includes(props.labels[0]) ? data2 : data1} />
    </>
  );
}