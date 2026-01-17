class Stopwatch {
    constructor(display, lapsList) {
        this.display = display;
        this.lapsList = lapsList;

        this.startTime = 0;
        this.elapsedTime = 0;
        this.lastLapTime = 0;
        this.running = false;
        this.rafId = null;
        this.lapCount = 0;
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.startTime = performance.now() - this.elapsedTime;
        this.update();
    }

    pause() {
        this.running = false;
        cancelAnimationFrame(this.rafId);
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.lastLapTime = 0;
        this.lapCount = 0;
        this.lapsList.innerHTML = "";
        this.render(0);
    }

    lap() {
        if (!this.running) return;

        this.lapCount++;
        const lapTime = this.elapsedTime - this.lastLapTime;
        this.lastLapTime = this.elapsedTime;

        const li = document.createElement("li");
        li.textContent = `Lap ${this.lapCount} — ${this.formatTime(lapTime)}`;
        this.lapsList.prepend(li);
    }

    update() {
        if (!this.running) return;

        this.elapsedTime = performance.now() - this.startTime;
        this.render(this.elapsedTime);

        this.rafId = requestAnimationFrame(() => this.update());
    }

    render(time) {
        this.display.textContent = this.formatTime(time);
    }

    formatTime(ms) {
        const milliseconds = Math.floor(ms % 1000).toString().padStart(3, "0");
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / 60000);

        return `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}.${milliseconds}`;
    }
}

/* DOM */
const display = document.getElementById("display");
const laps = document.getElementById("laps");
const startPauseBtn = document.getElementById("startPause");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");

const stopwatch = new Stopwatch(display, laps);

/* Controls */
startPauseBtn.addEventListener("click", () => {
    if (!stopwatch.running) {
        stopwatch.start();
        startPauseBtn.textContent = "Pause";
        lapBtn.disabled = false;
    } else {
        stopwatch.pause();
        startPauseBtn.textContent = "Start";
    }
});

lapBtn.addEventListener("click", () => stopwatch.lap());

resetBtn.addEventListener("click", () => {
    stopwatch.reset();
    startPauseBtn.textContent = "Start";
    lapBtn.disabled = true;
});
