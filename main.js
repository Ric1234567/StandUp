try {
    require('electron-reloader')(module)
} catch (_) { }

const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const TrayWindow = require('electron-tray-window')
// const { Tray } = require('electron')
const Stopwatch = require('./stopwatch.js')

let stopwatch

function createWindow() {
    const win = new BrowserWindow({
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#74b1be',
            // height: 60
        },
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
    win.setBackgroundColor('#e0e0e0')

    TrayWindow.setOptions({
        trayIconPath: "images/sitting.png",
        // windowUrl: `file://${__dirname}/index.html`
        window: win
    });

    stopwatch = new Stopwatch()
    stopwatch.start()

    win.webContents.openDevTools()
    console.log("Stopwatch: " + stopwatch.getTime())
}

app.whenReady().then(() => {
    ipcMain.on("button-clicked", handleButtonClick)
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

function handleButtonClick(event){
    console.log("button clicked")
    console.log("Stopwatch: " + stopwatch.getTime())
}