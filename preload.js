const { 
  contextBridge,
  ipcRenderer
} = require("electron")

window.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded")

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld(
  "api", {
    buttonClick: (event) => ipcRenderer.send("button-clicked", event),
    receive: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
)