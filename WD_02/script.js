let startTime;
let updatedTime;
let difference;
let timerInterval;
let running = false;
let lapCounter = 1;
let previousLapTime = 0;

const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');
const lapButton = document.getElementById('lap');

const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const lapsList = document.getElementById('laps-list');
const circle = document.querySelector('.circle');

function startStopwatch() {
    startTime = new Date().getTime() - (difference || 0);
    timerInterval = setInterval(updateTime, 10);
    startStopButton.textContent = 'Stop';
    circle.style.animationPlayState = 'running';
}

function stopStopwatch() {
    clearInterval(timerInterval);
    startStopButton.textContent = 'Start';
    circle.style.animationPlayState = 'paused';
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    hoursDisplay.textContent = pad(hours);
    minutesDisplay.textContent = pad(minutes);
    secondsDisplay.textContent = pad(seconds);
    millisecondsDisplay.textContent = pad(milliseconds);
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function formatTime(time) {
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((time % 1000) / 10);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

startStopButton.addEventListener('click', () => {
    if (running) {
        stopStopwatch();
    } else {
        startStopwatch();
    }
    running = !running;
});

resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    running = false;
    startStopButton.textContent = 'Start';
    circle.style.animationPlayState = 'paused';
    difference = 0;
    previousLapTime = 0;
    hoursDisplay.textContent = '00';
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    millisecondsDisplay.textContent = '00';
    lapsList.innerHTML = '';
    lapCounter = 1;
});

lapButton.addEventListener('click', () => {
    if (running) {
        const totalTime = difference;
        const lapTime = totalTime - previousLapTime;
        const lapItem = document.createElement('tr');

        lapItem.innerHTML = `
            <td>${lapCounter}</td>
            <td>${formatTime(totalTime)}</td>
            <td>${formatTime(lapTime)}</td>
        `;

        lapsList.appendChild(lapItem);
        previousLapTime = totalTime;
        lapCounter++;
    }
});
