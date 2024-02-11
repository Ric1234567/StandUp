class Stopwatch {
    constructor() {
      this.startTime = 0;
      this.running = false;
    }
  
    start() {
      if (!this.running) {
        this.startTime = Date.now();
        this.running = true;
      }
    }
  
    stop() {
      if (this.running) {
        this.running = false;
        this.startTime = 0;
      }
    }
  
    reset() {
      this.startTime = 0;
      this.running = false;
    }
  
    getTime() {
      if (this.running) {
        return Date.now() - this.startTime;
      } else {
        return 0;
      }
    }
  
    formatTime(milliseconds) {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const millisecondsLeft = milliseconds % 1000;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millisecondsLeft.toString().padStart(3, '0')}`;
    }
  }

module.exports = Stopwatch;