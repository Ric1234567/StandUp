const Stopwatch = require("./stopwatch");

class SitManager {
    constructor() {
        this.sitTimer = new Stopwatch()
        this.sitTimer.start()

        this.standTimer = new Stopwatch()
        this.isSitting = true;
    }

    toggle() {
        if (this.isSitting) {
            this.standTimer.start()
            this.sitTimer.stop()
        }
        else {
            this.sitTimer.start()
            this.standTimer.stop()
        }

        this.isSitting = !this.isSitting
    }

    stop() {
        this.standTimer.stop()
        this.sitTimer.stop()
    }

    start() {
        if (this.isSitting) {
            this.sitTimer.start()
        }
        else {
            this.standTimer.start()
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