try {
    require('electron-reloader')(module)
} catch (_) { }

const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const TrayWindow = require('electron-tray-window')
// const { Tray } = require('electron')
const Stopwatch = require('./stopwatch.js')
const SitManager = require('./sitManager.js')

let win

let sitManager = new SitManager()

function createWindow() {
    win = new BrowserWindow({
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#74b1be',
            // height: 60
        },
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })
    win.loadFile('index.html')
    win.setBackgroundColor('#e0e0e0')

    TrayWindow.setOptions({
        trayIconPath: "images/sitting.png",
        // windowUrl: `file://${__dirname}/index.html`
        window: win
    });

    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        console.log("activate");
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on("button-clicked", handleButtonClick)
function handleButtonClick(event) {
    console.log("button clicked in main.js/backend")
}

ipcMain.on('toggleSitAndStand', (event)=>{
    sitManager.toggle()

    win.webContents.send('updateToggleButton', sitManager.isSitting)
})

function sendUpdateToFrontend() {
    let data = {
        sitTimer: sitManager.sitTimer.getTimeFormated(),
        standTimer: sitManager.standTimer.getTimeFormated()
    }
    win.webContents.send('updateClock', data)
}

var interval = setInterval(() => {
    sendUpdateToFrontend();
}, 1000);