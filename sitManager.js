const Stopwatch = require("./stopwatch");

class SitManager {
    constructor() {
        this.sitTimer = new Stopwatch()
        this.sitTimer.start()

        this.standTimer = new Stopwatch()
        this.isSitting = true;
    }

    toggle() {
        if(this.isSitting){
            this.standTimer.start()
            this.sitTimer.stop()
        } 
        else {
            this.sitTimer.start()
            this.standTimer.stop()
        }

        this.isSitting = !this.isSitting
    }
}

module.exports = SitManager;