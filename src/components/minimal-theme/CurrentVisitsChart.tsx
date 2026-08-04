import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CurrentVisitsChart: React.FC = () => {
  const chartData = {
    labels: ['America (27.7%)', 'Asia (34.7%)', 'Europe (9.2%)', 'Africa (28.4%)'],
    datasets: [
      {
        data: [27.7, 34.7, 9.2, 28.4],
        backgroundColor: ['#007bff', '#ff9800', '#00bcd4', '#f44336'],
        borderWidth: 4,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { boxWidth: 10, usePointStyle: true, font: { size: 12, weight: 700 } },
      },
    },
    cutout: '65%',
  };

  return (
    <div className="minimal-card-container space-y-4">
      <div>
        <h3 className="text-lg font-extrabold text-slate-800">Current Visits</h3>
      </div>

      <div className="h-80 w-full flex items-center justify-center">
        <Doughnut data={chartData} options={options as any} />
      </div>
    </div>
  );
};
