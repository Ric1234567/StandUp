try {
    require('electron-reloader')(module)
} catch (_) { }

const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const TrayWindow = require('electron-tray-window')
const { Tray, nativeImage, Menu } = require('electron')

const SitManager = require('./sitManager.js')
const Reminder = require('./reminder.js')
const { clearInterval } = require('node:timers')

let win

const sittingIconPath = './images/sitting.png'
const sittingImage = nativeImage.createFromPath(sittingIconPath)
const standingIconPath = './images/standing.png'
const standingImage = nativeImage.createFromPath(standingIconPath)
let tray

let sitManager = new SitManager()
let standUpReminder
let frontendUpdateInterval
let contextMenu

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

    win.on('closed', () => {
        //console.log('win.closed')
    })

    win.on('hide', () => {
        console.log('Window is now hidden');
        // clearInterval(frontendUpdateInterval) // todo interval logic
    });

    win.on('show', () => {
        console.log('Window is now visible');
        // startUpdateFrontendInterval()
    });

    createTrayIcon()
    TrayWindow.setOptions({
        tray: tray,
        // windowUrl: `file://${__dirname}/index.html`
        window: win
    });

    win.webContents.openDevTools()
}

function createTrayIcon() {
    tray = new Tray(sittingImage)
    contextMenu = buildTrayMenu('Stand Up')
        tray.on('right-click', () => {
            tray.popUpContextMenu(contextMenu);
        });
}

function buildTrayMenu(toggleName) {
    return Menu.buildFromTemplate([
        { id: 'toggle', label: toggleName, type: 'normal', click: toggleSitAndStand },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' }
    ]);
}

app.whenReady().then(() => {
    startUpdateFrontendInterval()

    createWindow()
    app.on('activate', () => {
        console.log("activate");
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
}).then(() => {
    const iconPath = standingIconPath
    standUpReminder = new Reminder(iconPath, 60000, 'StandUp Reminder', 'It is time to stand up!')
    standUpReminder.start()
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

ipcMain.on('toggleSitAndStand', (event) => toggleSitAndStand)
function toggleSitAndStand() {
    if (sitManager.isSitting) {
        tray.setImage(standingImage)
        tray.setContextMenu(contextMenu = buildTrayMenu('Sit down'))
    }
    else {
        tray.setImage(sittingImage)
        tray.setContextMenu(contextMenu = buildTrayMenu('Stand up'))
    }
    sitManager.toggle()

    win.webContents.send('updateToggleButton', sitManager.isSitting)
}

function startUpdateFrontendInterval() {
    frontendUpdateInterval = setInterval(() => {
        sendUpdateToFrontend();
    }, 100);
}

function sendUpdateToFrontend() {
    let data = {
        sitTimer: sitManager.sitTimer.getTimeFormated(),
        standTimer: sitManager.standTimer.getTimeFormated()
    }
    win.webContents.send('updateClock', data)
}

app.on('before-quit', () => {
    console.log('before-quit')
    clearInterval(frontendUpdateInterval)
})