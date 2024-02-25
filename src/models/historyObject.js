class HistoryObject {
    constructor(unixTimestamp, duration, type) {
        this.typeName = 'HistoryObject';
        this.unixTimestamp = unixTimestamp;
        this.duration = duration;
        this.type = type;
    }
}

module.exports = HistoryObject;