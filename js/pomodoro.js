// Pomodoro Timer
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let isBreak = false;
let isMuted = false;

// DOM elements
const timeDisplay = document.getElementById('timeDisplay');
const timerLabel = document.getElementById('timerLabel');
const timerCircle = document.getElementById('timerCircle');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const focusDuration = document.getElementById('focusDuration');
const breakDuration = document.getElementById('breakDuration');
const alertSound = new Audio("../alert.mp3")
const muteBtn = document.getElementById('muteBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    setupEventListeners();
});

function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    muteBtn.addEventListener('click', muteBtnToggle)
    
    focusDuration.addEventListener('change', () => {
        if (!isRunning) {
            timeLeft = focusDuration.value * 60;
            updateDisplay();
        }
    });
    
    breakDuration.addEventListener('change', () => {
        if (!isRunning && isBreak) {
            timeLeft = breakDuration.value * 60;
            updateDisplay();
        }
    });
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                completeSession();
            }
        }, 1000);
    }
}

function pauseTimer() {
    isRunning = false;
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
    clearInterval(timerInterval);
}

function resetTimer() {
    pauseTimer();
    isBreak = false;
    timeLeft = focusDuration.value * 60;
    timerLabel.textContent = 'Focus Time';
    timerCircle.style.borderColor = '#10b981';
    timerCircle.style.background = 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.2))';
    updateDisplay();
}

function completeSession() {
    pauseTimer();
    
    if (!isBreak) {
        // Focus session completed, start break
        if(!isMuted){
            alertSound.play();
            console.log("Sound played")
        }
        alert('Great job! Time for a break.');
        isBreak = true;
        timeLeft = breakDuration.value * 60;
        timerLabel.textContent = 'Break Time';
        timerCircle.style.borderColor = '#22d3ee';
        timerCircle.style.background = 'linear-gradient(to bottom right, rgba(34, 211, 238, 0.2), rgba(6, 182, 212, 0.2))';
    } else {
        // Break completed
        if(!isMuted){
            alertSound.play();
            console.log("Sound played")
        }
        alert('Break over! Ready to focus again?');
        isBreak = false;
        timeLeft = focusDuration.value * 60;
        timerLabel.textContent = 'Focus Time';
        timerCircle.style.borderColor = '#10b981';
        timerCircle.style.background = 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(29, 245, 166, 0.2))';
    }
    
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function muteBtnToggle(){
    if(!isMuted) {
        isMuted = true
        console.log("Audio mutted")
        muteBtn.textContent = "🔈"
    }else if (isMuted){
        isMuted = false
        console.log("Audio is not muted")
        muteBtn.textContent = "🔊"
    }
}