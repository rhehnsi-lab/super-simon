// ui.js — קובץ יחיד ומתוקן, ללא ניווט שגוי
let gameState = null;

export function setGameState(state) {
    gameState = state;
}

export function updateStage() {
    const stageElement = document.getElementById("level");
    const stageDisplay = document.getElementById("level-display");
    if (!gameState) return;
    if (stageElement) stageElement.innerText = gameState.stage;
    if (stageDisplay) stageDisplay.innerText = gameState.stage;
}

export function updateScore() {
    const scoreElement = document.getElementById("score");
    const scoreDisplay = document.getElementById("score-display");
    const recordScore = document.querySelector(".record-score");
    if (!gameState) return;
    if (scoreElement) scoreElement.innerText = gameState.score;
    if (scoreDisplay) scoreDisplay.innerText = gameState.score;
    if (recordScore) recordScore.innerText = gameState.score;
}

export function updateChances() {
    const ch = document.getElementById("ch");
    if (gameState && ch) {
        ch.innerText = gameState.countChances;
    }
    // הניווט לעמוד שיאים מטופל בלוגיקה — לא כאן
}

export function playClickEffect(elementId, isPlayer = true) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const effectClass = isPlayer ? "player-active" : "pc-active";
    element.classList.add(effectClass);
    setTimeout(() => {
        element.classList.remove(effectClass);
    }, 200);
}

export function showMessage(text) {
    const msg = document.querySelector(".message");
    if (msg) msg.innerText = text;
}