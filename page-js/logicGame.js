// logicGame.js
import { updateStage, updateScore, updateChances, showMessage } from "./ui.js";
import { saveScore } from "./record.js";
import { Timer } from "./taimer.js";
import { playNote, notes } from "./sound.js";

// --- הגדרות קבועות (חוקי המשחק) ---
const maxStagePoints = 7;
const baseTimer = 15;
const baseChances = 3;
const minTimer = 5;
const minChances = 1;

// --- אובייקט מצב המשחק ---
const gameStart = {
    sequence: [],
    userInput: [],
    countChances: baseChances,
    stage: 1,
    stagePoints: 0,
    score: 0,
    timer: baseTimer,
    isPlaying: false
};

// --- פונקציות עדכון ממשק (UI) ---
// --- לוגיקת הרצף ---
function randomCell() {
    const randomIndex = Math.floor(Math.random() * 9) + 1;
    gameStart.sequence.push(randomIndex);
}

function playSequence(onSequenceEnd) {
    gameStart.isPlaying = true;
    gameStart.sequence.forEach((id, index) => {
        setTimeout(() => {
            lightCell(id);
        }, index * 1000);
    });

    setTimeout(() => {
        gameStart.isPlaying = false;
        if (typeof onSequenceEnd === "function") onSequenceEnd();
    }, gameStart.sequence.length * 1000);
}

// --- טיפול באירועים ---
function handleStageUpgrade() {
    gameStart.stage++;
    gameStart.stagePoints = 0;
    gameStart.timer = Math.max(minTimer, gameStart.timer - 5);
    gameStart.countChances = Math.max(minChances, gameStart.countChances - 1);
    showMessage("Stage upgraded!");
    updateStage();
    updateChances();
}

function handleTimeout() {
    showMessage("Time's up");
    gameStart.sequence = [];
    gameStart.userInput = [];
    gameStart.countChances--;
    updateChances();
    if (gameStart.countChances > 0) {
        setTimeout(startRound, 1000);
    }
}

export function handleClick(cellId) {
    if (gameStart.isPlaying) return;

    playNote(notes[cellId - 1]);
    gameStart.userInput.push(cellId);
    const index = gameStart.userInput.length - 1;

    const isCorrect = gameStart.userInput.every((id, i) => id === gameStart.sequence[i]);
    if (!isCorrect) {
        showMessage("Wrong!");
        gameStart.sequence = [];
        gameStart.userInput = [];
        gameStart.countChances--;
        updateChances();
        if (gameStart.countChances > 0) {
            setTimeout(startRound, 1000);
        }
        return;
    }

    if (gameStart.userInput.length === gameStart.sequence.length) {
        showMessage("Correct!");
        gameStart.score++;
        gameStart.stagePoints++;
        updateScore();

        if (gameStart.stagePoints >= maxStagePoints) {
            handleStageUpgrade();
        }

        gameStart.userInput = [];
        randomCell();
        playSequence(() => Timer(gameStart.timer, handleTimeout));
    }
}

function lightCell(id) {
    const light = document.querySelector(`[data-id="${id}"]`);
    if (!light) return;

    playNote(notes[id - 1]);
    light.classList.add("active");
    setTimeout(() => {
        light.classList.remove("active");
    }, 500);
}

function gameOver() {
    const playerDisplay = document.getElementById("player-display");
    const name = playerDisplay ? playerDisplay.innerText : "אנונימי";
    saveScore(name, gameStart.score, gameStart.stage);
    showMessage("Game Over");
    window.location.href = `record.html?name=${name}&score=${gameStart.score}&stage=${gameStart.stage}`;
}

function startRound() {
    randomCell();
    playSequence(() => Timer(gameStart.timer, handleTimeout));
}

export function startGame() {
    Object.assign(gameStart, {
        sequence: [],
        userInput: [],
        countChances: baseChances,
        stage: 1,
        stagePoints: 0,
        score: 0,
        timer: baseTimer,
        isPlaying: false
    });

    updateStage();
    updateScore();
    updateChances();
    showMessage("Get Ready...");

    setTimeout(() => {
        randomCell();
        playSequence(() => Timer(gameStart.timer, handleTimeout));
    }, 1000);
}

// --- מאזינים ---
document.addEventListener("keydown", (e) => {
    const key = Number(e.key);
    if (key >= 1 && key <= 9) {
        const cell = document.querySelector(`[data-id="${key}"]`);
        if (cell) {
            cell.classList.add("pressed");
            setTimeout(() => { cell.classList.remove("pressed"); }, 150);
            handleClick(key);
        }
    }
});

function stopp() {
    const playing = document.getElementById("playing");
    if (!playing) return;
    playing.addEventListener("click", () => {
        gameStart.isPlaying = !gameStart.isPlaying;
    });
}

stopp();