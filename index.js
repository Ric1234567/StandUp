const setButton = document.getElementById('button1')
const time = document.getElementById('time')

setButton.addEventListener('click', () => {
  console.log("button clicked in frontend")
  window.api.send("button-clicked")
})

function updateClock(data){
  time.innerHTML = data
}

window.api.receive('updateClock', (data) => {
  //console.log('updateClock: ' + data)
  updateClock(data)
})