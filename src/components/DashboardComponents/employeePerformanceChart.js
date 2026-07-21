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

export default function StackChartEmployee(props) {

    const data1 = []
    const data2 = []
    const data3 = []
    const data4= []
    const data5 = []


    const finData = props?.data?.reviews?.map((item) => {
        if (item.overallRating > 0.5 && item.overallRating<=1.5){
            data1.push(item)
        } else  if (item.overallRating > 1.5 && item.overallRating<=2.5){
            data2.push(item)
        } else  if (item.overallRating > 2.5 && item.overallRating<=3.5){
            data3.push(item)
        } else  if (item.overallRating > 3.5 && item.overallRating<=4.5){
            data4.push(item)
        } else  if (item.overallRating > 4.5){
            data5.push(item)
        }
    })

    const options2 = {
        plugins: {
            legend: {
                display: false
            },
        },
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Rating'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'No.of Employees'
                }
            }
        },
    };


    const datadd = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
            {
                label: '1',
                data: [data1.length, data2.length, data3.length, data4.length, data5.length],
                backgroundColor: [
                    'rgb(139, 151, 255)',
                    'rgb(133, 216, 221)',
                    'rgb(255, 182, 141)',
                    'rgb(116, 194, 251)',
                    'rgb(255, 133, 214)',
                    'rgb(255, 141, 148)',
                    'rgb(139, 151, 255)'
                ],
                borderColor: [
                    'rgb(139, 151, 255)',
                    'rgb(133, 216, 221)',
                    'rgb(255, 182, 141)',
                    'rgb(116, 194, 251)',
                    'rgb(255, 133, 214)',
                    'rgb(255, 141, 148)',
                    'rgb(139, 151, 255)',
                ],
                barPercentage: 0.5,
            }
        ]
    }
    return (
        <>
            <Bar height={'calc(100vh - 480px)'} style={{ padding: 10, marginTop: "20px" }} options={options2} data={datadd} />
        </>
    );
}