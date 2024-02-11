// const { ipcRenderer } = require('electron');

const setButton = document.getElementById('button1')
const time = document.getElementById('time')

setButton.addEventListener('click', () => {
  console.log("test.js")
  window.api.buttonClick()
})

function updateClock(data){
  time.innerHTML = data
}

window.api.receive('updateClock', (data) => {
  console.log('updateClock: ' + data)
  updateClock(data)
})