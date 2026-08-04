/* Material Dashboard 2 Chart Initializers */
window.initMaterialCharts = function() {
  // Chart 1: Website Views Bar Chart
  const ctxViews = document.getElementById('materialViewsChart');
  if (ctxViews) {
    if (window.materialViewsInstance) window.materialViewsInstance.destroy();
    window.materialViewsInstance = new Chart(ctxViews, {
      type: 'bar',
      data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [{
          label: 'Views',
          data: [50, 20, 10, 22, 50, 10, 40],
          backgroundColor: '#ffffff',
          borderRadius: 6,
          barThickness: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#ffffff', font: { size: 11, weight: 'bold' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.2)' },
            ticks: { color: '#ffffff', font: { size: 11 } }
          }
        }
      }
    });
  }

  // Chart 2: Daily Sales Line Chart
  const ctxSales = document.getElementById('materialSalesChart');
  if (ctxSales) {
    if (window.materialSalesInstance) window.materialSalesInstance.destroy();
    window.materialSalesInstance = new Chart(ctxSales, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Sales',
          data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
          borderColor: '#ffffff',
          borderWidth: 3,
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#ffffff', font: { size: 11, weight: 'bold' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.2)' },
            ticks: { color: '#ffffff', font: { size: 11 } }
          }
        }
      }
    });
  }

  // Chart 3: Completed Tasks Dark Line Chart
  const ctxTasks = document.getElementById('materialTasksChart');
  if (ctxTasks) {
    if (window.materialTasksInstance) window.materialTasksInstance.destroy();
    window.materialTasksInstance = new Chart(ctxTasks, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Tasks',
          data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
          borderColor: '#ffffff',
          borderWidth: 3,
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#ffffff', font: { size: 11, weight: 'bold' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.2)' },
            ticks: { color: '#ffffff', font: { size: 11 } }
          }
        }
      }
    });
  }
};
