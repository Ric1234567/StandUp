const { Notification } = require('electron')
const path = require('path');

class Reminder {
    constructor(iconPath, remindTime, title, body) {
        this.iconPath = iconPath
        this.remindTime = remindTime
        this.title = title
        this.body = body
        this.timeout = this.timeout.bind(this)
    }

    start() {
        this.interval = setTimeout(this.timeout, this.remindTime)
    }

    timeout() {
        // For notifications on Windows, your Electron app needs to have a Start Menu shortcut with an AppUserModelID and a corresponding ToastActivatorCLSID
        // https://www.electronjs.org/docs/latest/tutorial/notifications
        new Notification({
            title: this.title,
            body: this.body,
            icon: this.iconPath ? path.resolve(__dirname, this.iconPath) : undefined
        }).show()
        this.start()
    }
}

module.exports = Reminder;