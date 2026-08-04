/* Minimal Kit UI Chart Initializers */
window.initMinimalCharts = function() {
  // Chart 1: Website Visits (Mixed Bar + Dual Line Spline Chart)
  const ctxVisits = document.getElementById('minimalVisitsChart');
  if (ctxVisits) {
    if (window.minimalVisitsInstance) window.minimalVisitsInstance.destroy();
    window.minimalVisitsInstance = new Chart(ctxVisits, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
          {
            type: 'line',
            label: 'Team A',
            data: [43, 54, 40, 66, 21, 42, 33, 56, 35, 43],
            borderColor: '#ff9800',
            borderWidth: 3,
            tension: 0.4,
            fill: false,
            pointRadius: 0
          },
          {
            type: 'line',
            label: 'Team B',
            data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36],
            borderColor: '#00bcd4',
            borderWidth: 3,
            tension: 0.4,
            fill: false,
            pointRadius: 0
          },
          {
            type: 'bar',
            label: 'Team C',
            data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22],
            backgroundColor: '#007bff',
            borderRadius: 6,
            barThickness: 12
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: { boxWidth: 10, usePointStyle: true, font: { size: 12, weight: 'bold' } }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#637381', font: { size: 11 } }
          },
          y: {
            grid: { color: '#f4f6f8' },
            ticks: { color: '#637381', font: { size: 11 } }
          }
        }
      }
    });
  }

  // Chart 2: Current Visits (4-Slice Pie/Donut Chart)
  const ctxPie = document.getElementById('minimalPieChart');
  if (ctxPie) {
    if (window.minimalPieInstance) window.minimalPieInstance.destroy();
    window.minimalPieInstance = new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: ['America (27.7%)', 'Asia (34.7%)', 'Europe (9.2%)', 'Africa (28.4%)'],
        datasets: [{
          data: [27.7, 34.7, 9.2, 28.4],
          backgroundColor: ['#007bff', '#ff9800', '#00bcd4', '#f44336'],
          borderWidth: 4,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, usePointStyle: true, font: { size: 12, weight: 'bold' } }
          }
        },
        cutout: '65%'
      }
    });
  }
};
