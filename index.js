const setButton = document.getElementById('button1')
setButton.addEventListener('click', () => {
  console.log("test.js")
  window.api.buttonClick()
})