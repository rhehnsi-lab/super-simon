import { Timer } from "./taimer.js";

let sequence = [];
let userInput = [];
let countChances = 3;
let level = 1;
let isPlaying = false;
let timer = 15;

document.addEventListener("keydown", (event) => {
    const key = parseInt(event.key);
    if (key >= 1 && key <= 9) handleClick(key);
});

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
        showMessage(cellId);
        console.log("good");
        userInput = [];
        level++;
        updateLevel();
        randomCell();
        playSequence(() => Timer(timer, handleTimeout));
    }
}

function lightCell(id) {
    const light = document.querySelector(`[data-id="${id}"]`);
    light.classList.add("active");
    setTimeout(() => {
        light.classList.remove("active");
    }, 500);
}

function updateChances() {
    if (countChances <= 0) {
        showMessage("Game Over");
        startGame();
    }
    const ch = document.getElementById("ch");
    ch.innerText = countChances;
}

function updateLevel() {
    const levelElement = document.getElementById("level");
    levelElement.innerText = level;
}

function showMessage(text) {
    const msg = document.querySelector(".message");
    msg.innerText = text;
}

export function startGame() {
    sequence = [];
    userInput = [];
    level = 1;
    updateLevel();
    updateChances();
    randomCell();
    playSequence(() => Timer(timer, handleTimeout));
}

function stopp() {
    const playing = document.getElementById("playing");
    playing.addEventListener("click", () => {
        if (!isPlaying) {
            isPlaying = true;
        } else {
            isPlaying = false;
        }
    });
}

stopp();
