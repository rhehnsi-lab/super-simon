import { Timer } from "./taimer.js";

const maxStagePoints = 7;
const baseTimer = 15;
const baseChances = 3;
const minTimer = 5;
const minChances = 1;

let sequence = [];
let userInput = [];
let countChances = baseChances;
let stage = 1;
let stagePoints = 0;
let score = 0;
let isPlaying = false;
let timer = baseTimer;

function updateStage() {
    const stageElement = document.getElementById("level");
    const stageDisplay = document.getElementById("level-display");
    if (stageElement) stageElement.innerText = stage;
    if (stageDisplay) stageDisplay.innerText = stage;
}

function updateScore() {
    const scoreElement = document.getElementById("score");
    const scoreDisplay = document.getElementById("score-display");
    if (scoreElement) scoreElement.innerText = score;
    if (scoreDisplay) scoreDisplay.innerText = score;
}

function updateChances() {
    const ch = document.getElementById("ch");
    if (ch) ch.innerText = countChances;
    if (countChances <= 0) {
        showMessage("Game Over");
        startGame();
    }
}

function randomCell() {
    const randomIndex = Math.floor(Math.random() * 9) + 1;
    sequence.push(randomIndex);
    console.log(`the cell random ${randomIndex}`);
}

function playSequence(onSequenceEnd) {
    isPlaying = true;
    sequence.forEach((id, index) => {
        setTimeout(() => {
            lightCell(id);
        }, index * 700);
    });
    setTimeout(() => {
        isPlaying = false;
        if (typeof onSequenceEnd === "function") onSequenceEnd();
    }, sequence.length * 800);
}

function handleStageUpgrade() {
    stage++;
    stagePoints = 0;
    timer = Math.max(minTimer, timer - 2);
    countChances = Math.max(minChances, countChances - 1);
    showMessage("Stage upgraded!");
    updateStage();
    updateChances();
}

function handleTimeout() {
    const error = "Time's up";
    console.log(error);
    showMessage(error);
    sequence = [];
    userInput = [];
    countChances--;
    updateChances();
    if (countChances > 0) {
        startGame();
    }
}

export function handleClick(cellId) {
    const error = "error click";

    if (isPlaying) return;

    userInput.push(cellId);
    const index = userInput.length - 1;
    if (sequence[index] !== userInput[index]) {
        console.log(error);
        showMessage(error);
        sequence = [];
        userInput = [];
        countChances--;
        updateChances();
        startGame();
        return;
    }

    if (userInput.length === sequence.length) {
        showMessage("Correct!");
        score++;
        stagePoints++;
        updateScore();

        if (stagePoints >= maxStagePoints) {
            handleStageUpgrade();
        }

        userInput = [];
        randomCell();
        playSequence(() => Timer(timer, handleTimeout));
    }
}

function lightCell(id) {
    const light = document.querySelector(`[data-id="${id}"]`);
    if (!light) return;
    light.classList.add("active");
    setTimeout(() => {
        light.classList.remove("active");
    }, 500);
}

function showMessage(text) {
    const msg = document.querySelector(".message");
    if (msg) msg.innerText = text;
}

export function startGame() {
    sequence = [];
    userInput = [];
    countChances = baseChances;
    stage = 1;
    stagePoints = 0;
    score = 0;
    timer = baseTimer;
    isPlaying = false;
    updateStage();
    updateScore();
    updateChances();
    randomCell();
    playSequence(() => Timer(timer, handleTimeout));
}

function stopp() {
    const playing = document.getElementById("playing");
    if (!playing) return;
    playing.addEventListener("click", () => {
        if (!isPlaying) {
            isPlaying = true;
        } else {
            isPlaying = false;
        }
    });
}

stopp();
