import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const WebsiteVisitsChart: React.FC = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        type: 'line' as const,
        label: 'Team A',
        data: [43, 54, 40, 66, 21, 42, 33, 56, 35, 43],
        borderColor: '#ff9800',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
      {
        type: 'line' as const,
        label: 'Team B',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36],
        borderColor: '#00bcd4',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointRadius: 0,
      },
      {
        type: 'bar' as const,
        label: 'Team C',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22],
        backgroundColor: '#007bff',
        borderRadius: 6,
        barThickness: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: { boxWidth: 10, usePointStyle: true, font: { size: 12, weight: 700 } },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#637381', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f4f6f8' },
        ticks: { color: '#637381', font: { size: 11 } },
      },
    },
  };

  return (
    <div className="minimal-card-container space-y-4">
      <div>
        <h3 className="text-lg font-extrabold text-slate-800">Website Visits</h3>
        <p className="text-xs text-slate-400 font-medium">(+43%) than last year</p>
      </div>

      <div className="h-80 w-full">
        <Chart type="bar" data={chartData} options={options as any} />
      </div>
    </div>
  );
};
