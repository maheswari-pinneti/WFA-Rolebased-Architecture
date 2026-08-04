import React from 'react';
import { Clock } from 'lucide-react';
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
import { Bar, Line } from 'react-chartjs-2';

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

export interface ChartCardMaterialProps {
  title: string;
  subtitle: string;
  footerText: string;
  type: 'bar' | 'line';
  headerColor?: 'blue' | 'green' | 'dark';
}

export const ChartCardMaterial: React.FC<ChartCardMaterialProps> = ({
  title,
  subtitle,
  footerText,
  type,
  headerColor = 'blue',
}) => {
  const headerClasses = {
    blue: 'header-blue',
    green: 'header-green',
    dark: 'header-dark',
  };

  const chartData = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [
      {
        label: title,
        data: type === 'bar' ? [50, 20, 10, 22, 50, 10, 40] : [50, 40, 300, 220, 500, 250, 400],
        borderColor: '#ffffff',
        backgroundColor: type === 'bar' ? '#ffffff' : 'transparent',
        borderWidth: type === 'line' ? 3 : 0,
        borderRadius: type === 'bar' ? 6 : 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#ffffff', font: { size: 10, weight: 700 } },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.2)' },
        ticks: { color: '#ffffff', font: { size: 10 } },
      },
    },
  };

  return (
    <div className="material-chart-card">
      <div className={`material-chart-header ${headerClasses[headerColor]}`}>
        <div className="h-full w-full">
          {type === 'bar' ? (
            <Bar data={chartData} options={options as any} />
          ) : (
            <Line data={chartData} options={options as any} />
          )}
        </div>
      </div>

      <div className="pt-4 px-1 space-y-1">
        <h4 className="text-base font-extrabold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
      </div>

      <div className="border-t border-slate-100 mt-4 pt-2.5 text-xs text-slate-400 flex items-center gap-1.5">
        <Clock size={13} />
        <span>{footerText}</span>
      </div>
    </div>
  );
};
