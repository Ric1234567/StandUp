try {
    require('electron-reloader')(module)
} catch (_) { }

const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const TrayWindow = require('electron-tray-window')
const { Tray, nativeImage, Menu } = require('electron')

const SitManager = require('./models/sitManager.js')
const HistoryTracker = require('./models/historyTracker.js')
const Reminder = require('./models/reminder.js')
const { clearInterval } = require('node:timers')

let win

const sittingIconPath = './src/images/sitting.png'
const sittingImage = nativeImage.createFromPath(sittingIconPath)
const standingIconPath = './src/images/standing.png'
const standingImage = nativeImage.createFromPath(standingIconPath)
let tray

let sitManager = new SitManager()
let historyTracker = new HistoryTracker(3000, sitManager);// todo to 1 min
let standUpReminder
let frontendUpdateInterval
let contextMenu


app.whenReady().then(() => {
    historyTracker.init();

    createWindow();
    app.on('activate', () => {
        console.log("activate");
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
}).then(() => {
    const iconPath = standingIconPath
    standUpReminder = new Reminder(iconPath, 60000 * 60, 'StandUp Reminder', 'It is time to stand up!')
    standUpReminder.start()
})

function createWindow() {
    console.log('createWindow')

    win = new BrowserWindow({
        frame: false,
        titleBarStyle: 'hidden',
        title: 'StandUp!',
        titleBarOverlay: false,
        width: 500,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })
    win.loadFile('src/index/index.html')
    win.setBackgroundColor('#e0e0e0')

    win.on('closed', () => {
        //console.log('win.closed')
    })

    win.on('hide', () => {
        //console.log('Window is now hidden');
        stopUpdateFrontendInterval()
    });

    win.on('show', () => {
        console.log('Window is now visible');
        startUpdateFrontendInterval()

        singleUpdateFrontend()
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
    tray.setToolTip("Click to toggle sit/stand.\nRight click for more options.")
    contextMenu = buildTrayMenu('Stand Up')
    tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu);
    });
    tray.on('click', (event) => {
        // console.log(event);
        console.log("Tray icon clicked");

    })
}

function buildTrayMenu(toggleName) {
    return Menu.buildFromTemplate([
        { id: 'toggle', label: toggleName, type: 'normal', click: toggleSitAndStand },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' }
    ]);
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.on("button-clicked", handleButtonClick)
function handleButtonClick(event) {
    console.log("button clicked in main.js/backend")
}

ipcMain.on('toggleSitAndStand', (event) => toggleSitAndStand())
function toggleSitAndStand() {
    //console.log("toggleSitAndStand main.js")
    if (sitManager.isSitting === 'sitting') {
        tray.setImage(standingImage)
        tray.setContextMenu(contextMenu = buildTrayMenu('Sit down'))
        sitManager.toggle()
    
        win.webContents.send('updateToggleButton', sitManager)
    }
    else if (sitManager.isSitting === 'standing' || sitManager.isSitting === 'none') {
        tray.setImage(sittingImage)
        tray.setContextMenu(contextMenu = buildTrayMenu('Stand up'))
        sitManager.toggle()
    
        win.webContents.send('updateToggleButton', sitManager)
    }
}

ipcMain.on('stopTracking-clicked', (event) => stopTracking())
function stopTracking() {
    console.log('stopTracking');
    sitManager.stop()
    win.webContents.send('updateToggleButton', sitManager)
}

ipcMain.on('startTracking-clicked', (event) => startTracking())
function startTracking() {
    if (sitManager.isSitting === 'none') {
        console.log('here')
        tray.setImage(sittingImage)
        tray.setContextMenu(contextMenu = buildTrayMenu('Stand up'))
    }
    sitManager.start()

    win.webContents.send('updateToggleButton', sitManager)
}

ipcMain.on('hideMainWindow-clicked', (event) => hideMainWindow())
function hideMainWindow() {
    console.log('hideMainWindow-clicked')
    win.hide();
}

function startUpdateFrontendInterval() {
    if (frontendUpdateInterval === undefined) {
        frontendUpdateInterval = setInterval(() => {
            intervalUpdateFrontend();
        }, 100);
    }
}

function stopUpdateFrontendInterval() {
    if (frontendUpdateInterval !== undefined) {
        clearInterval(frontendUpdateInterval)
        frontendUpdateInterval = undefined
    }
}

function intervalUpdateFrontend() {
    let data = {
        sitTimer: sitManager.sitTimer.getTimeFormated(),
        standTimer: sitManager.standTimer.getTimeFormated()
    }
    win.webContents.send('updateClock', data)
}

function singleUpdateFrontend() {
    win.webContents.send('updateChart', [
        ['Type', '%'],
        ['Sitting Time', sitManager.getSitPercent()],
        ['Standing Time', sitManager.getStandPercent()]
    ])
}

app.on('before-quit', () => {
    console.log('before-quit')
    clearInterval(frontendUpdateInterval)
})
