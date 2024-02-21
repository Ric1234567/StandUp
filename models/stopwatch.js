class Stopwatch {
  constructor() {
    this.startTime = 0;
    this.running = false;
    this.stopTime = 0;
    this.elapsed = 0;
  }

  start() {
    if (!this.running) {
      this.startTime = Date.now();
      this.stopTime = 0;
      this.running = true;
    }
  }

  stop() {
    if (this.running) {
      this.stopTime = Date.now();
      this.elapsed += this.stopTime - this.startTime;
      this.running = false;
    }
  }

  reset() {
    this.startTime = 0;
    this.stopTime = 0;
    this.running = false;
  }

  getTime() {
    if (this.running) {
      return this.elapsed + Date.now() - this.startTime;
    } else {
      return this.elapsed;
    }
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millisecondsLeft = milliseconds % 1000;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millisecondsLeft.toString().padStart(3, '0')}`;
  }

  getTimeFormated() {
    return this.formatTimeHoursAndSeconds(this.getTime())
  }

  formatTimeHoursAndSeconds(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

module.exports = Stopwatch;