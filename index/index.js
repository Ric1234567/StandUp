google.charts.load('current', { 'packages': ['corechart'] });
//google.charts.setOnLoadCallback(drawChart);

const time = document.getElementById('time')
const toggleSitAndStandButton = document.getElementById('toggleSitAndStand')
const stopTrackingButton = document.getElementById('stopTracking')
const startTrackingButton = document.getElementById('startTracking')
const sitTimer = document.getElementById('sitTimer')
const standTimer = document.getElementById('standTimer')

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
  //console.log(sitManager);

  if (sitManager.isSitting) {
    toggleSitAndStandButton.innerHTML = "Stand Up"
  }
  else {
    toggleSitAndStandButton.innerHTML = "Sit Down"
  }
})

toggleSitAndStandButton.addEventListener('click', () => {
  //console.log('toggleSitAndStand')
  window.api.send('toggleSitAndStand')
})

function drawChart() {

  // Set Options
  const options = {
    title: 'Sit / Stand Time',
    backgroundColor: 'lightgray'//'none'
  };

  // Draw
  const chart = new google.visualization.PieChart(chartElement);
  chart.draw(chartData, options);
}