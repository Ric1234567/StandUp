google.charts.load('current', { 'packages': ['corechart'] });
//google.charts.setOnLoadCallback(drawChart);

const time = document.getElementById('time')
const toggleSitAndStandButton = document.getElementById('toggleSitAndStand')
const stopTrackingButton = document.getElementById('stopTracking')
const startTrackingButton = document.getElementById('startTracking')
const sitTimer = document.getElementById('sitTimer')
const standTimer = document.getElementById('standTimer')
const hideButton = document.getElementById('hideButton')

const chartElement = document.getElementById('chart')

let chartData;

stopTrackingButton.addEventListener('click', () => {
  window.api.send("stopTracking-clicked")
})

startTrackingButton.addEventListener('click', () => {
  window.api.send("startTracking-clicked")
})

window.api.receive('updateClock', (data) => {
  // console.log('updateClock: ')
  // console.log(data)
  sitTimer.innerHTML = data.sitTimer
  standTimer.innerHTML = data.standTimer
})

window.api.receive('updateChart', (data) => {
  //console.log(data)
  chartData = google.visualization.arrayToDataTable(data)
  drawChart()
})

window.api.receive('updateToggleButton', (sitManager) => {
  if (sitManager.isSitting === 'sitting') {
    toggleSitAndStandButton.style.display = 'inline';
    toggleSitAndStandButton.innerHTML = "Stand Up"
    stopTrackingButton.style.display = 'inline';
    startTrackingButton.style.display = 'inline';
  }
  else if (sitManager.isSitting === 'standing') {
    toggleSitAndStandButton.style.display = 'inline';
    toggleSitAndStandButton.innerHTML = "Sit Down"
    stopTrackingButton.style.display = 'inline';
    startTrackingButton.style.display = 'inline';
  }
  else {
    toggleSitAndStandButton.style.display = 'none';
    stopTrackingButton.style.display = 'none';
    startTrackingButton.style.display = 'inline';
  }
})

toggleSitAndStandButton.addEventListener('click', () => {
  //console.log('toggleSitAndStand')
  window.api.send('toggleSitAndStand')
})

hideButton.addEventListener('click', () => {
  window.api.send('hideMainWindow-clicked')
})

function drawChart() {
  // Set Options
  const options = {
    title: 'Sitting / Standind Time',
    backgroundColor: 'lightgray'//'none'
  };

  // Draw
  const chart = new google.visualization.PieChart(chartElement);
  chart.draw(chartData, options);
}