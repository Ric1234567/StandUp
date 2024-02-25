const Stopwatch = require("./stopwatch");

class SitManager {
    constructor() {
        this.sitTimer = new Stopwatch()
        this.sitTimer.start()

        this.standTimer = new Stopwatch()
        this.isSitting = 'sitting';
    }

    toggle() {
        if (this.isSitting === 'sitting') {
            this.standTimer.start()
            this.sitTimer.stop()
            this.isSitting = 'standing'
        }
        else if(this.isSitting === 'standing') {
            this.sitTimer.start()
            this.standTimer.stop()
            this.isSitting = 'sitting'
        }
    }

    stop() {
        this.standTimer.stop()
        this.sitTimer.stop()
        this.isSitting = 'none'
    }

    start() {
        if (this.isSitting === 'sitting') {
            this.sitTimer.start()
            this.isSitting = 'sitting'
        }
        else if (this.isSitting === 'standing') {
            this.standTimer.start()
            this.isSitting = 'standing'
        }
        else { // status none default
            this.sitTimer.start()
            this.isSitting = 'sitting'
        }
    }

    getSitPercent() {
        let sitTime = this.sitTimer.getTime()
        let standTime = this.standTimer.getTime()

        const total = sitTime + standTime
        return sitTime / total;
    }

    getStandPercent() {
        let sitTime = this.sitTimer.getTime()
        let standTime = this.standTimer.getTime()

        const total = sitTime + standTime
        return standTime / total;
    }
}

module.exports = SitManager;