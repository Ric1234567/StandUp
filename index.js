const setButton = document.getElementById('button1')
const time = document.getElementById('time')
const toggleSitAndStandButton = document.getElementById('toggleSitAndStand')
const sitTimer =document.getElementById('sitTimer')
const standTimer =document.getElementById('standTimer')

setButton.addEventListener('click', () => {
  console.log("button clicked in frontend")
  window.api.send("button-clicked")
})

window.api.receive('updateClock', (data) => {
  // console.log('updateClock: ')
  // console.log(data)
  sitTimer.innerHTML = data.sitTimer
  standTimer.innerHTML = data.standTimer
})

window.api.receive('updateToggleButton', (data) => {
  if(data){
    toggleSitAndStandButton.innerHTML = "Stand Up"
  }
  else {
    toggleSitAndStandButton.innerHTML = "Sit Down"
  }
})

toggleSitAndStandButton.addEventListener('click', () => {
  // console.log('toggleSitAndStand')
  window.api.send('toggleSitAndStand')
})