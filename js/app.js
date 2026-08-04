/* Core Application State & Theme Controller */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const materialContainer = document.getElementById('materialThemeContainer');
  const minimalContainer = document.getElementById('minimalThemeContainer');
  const btnMaterial = document.getElementById('btnSwitchMaterial');
  const btnMinimal = document.getElementById('btnSwitchMinimal');

  // Switch Theme Function
  function switchTheme(themeName) {
    if (themeName === 'material') {
      body.className = 'theme-material';
      materialContainer.style.display = 'flex';
      minimalContainer.style.display = 'none';
      btnMaterial.classList.add('active');
      btnMinimal.classList.remove('active');
      setTimeout(() => {
        if (window.initMaterialCharts) window.initMaterialCharts();
      }, 100);
    } else {
      body.className = 'theme-minimal';
      materialContainer.style.display = 'none';
      minimalContainer.style.display = 'flex';
      btnMinimal.classList.add('active');
      btnMaterial.classList.remove('active');
      setTimeout(() => {
        if (window.initMinimalCharts) window.initMinimalCharts();
      }, 100);
    }
  }

  // Event Listeners for Theme Switcher Bar
  btnMaterial.addEventListener('click', () => switchTheme('material'));
  btnMinimal.addEventListener('click', () => switchTheme('minimal'));

  // Initialize with Material Dashboard by default
  switchTheme('material');
});
