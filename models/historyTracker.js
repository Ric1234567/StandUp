const HistoryObject = require("./historyObject");
const HistoryWriter = require("./historyWriter");

class HistoryTracker {
    constructor(interval, sitManager) {
        this.sitManger = sitManager;
        this.interval = interval;
        this.history = [];
        this.historyWriter = new HistoryWriter("history.xml");
    }

    init() {
        if (this.trackingInterval === undefined) {
            this.trackingInterval = setInterval(() => {
                this.track();
            }, this.interval);
        }

        this.history = this.historyWriter.readHistory();
    }

    track() {
        let type = "None"
        if (this.sitManger.isSitting) {
            type = "Sitting";
        }
        else {
            type = "Standing";
        }

        let historyObject = new HistoryObject(Date.now(), this.interval, type);
        this.history.push(historyObject);

        this.historyWriter.writeHistory(historyObject);
    }

    getHistory() {
        return this.history;
    }
}

module.exports = HistoryTracker;