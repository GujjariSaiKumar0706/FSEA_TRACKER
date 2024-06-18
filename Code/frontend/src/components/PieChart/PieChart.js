import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PieChart.js'


ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Dataset',
        data: data.values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Set to false to allow chart to scale freely within its container
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Move legend to the bottom to save space
      },
      title: {
        display: true,
        text: 'Pie Chart Example',
        fontSize: 16, // Adjust font size for the title
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;