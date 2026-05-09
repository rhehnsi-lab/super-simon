// logicGame.js — גרסה נקייה ומתוקנת
import { updateStage, updateScore, updateChances, showMessage, setGameState, playClickEffect } from "./ui.js";
import { saveScore } from "./record.js";
import { Timer, stopTimer } from "./taimer.js";
import { playNote, notes } from "./sound.js";

// ─── קבועים ───────────────────────────────────────────────
const MAX_STAGE_POINTS = 5;
const BASE_CHANCES = 3;
const SPEED_BY_STAGE = [800, 700, 600, 500, 400]; // אינדקס 0 = שלב 1
let SEQ_SPEED = 800;          // ← let כדי שניתן לשנות בזמן ריצה
const CELL_LIT_MS = 400;
const MIN_TURN_TIME = 8;
const MAX_TURN_TIME = 20;

// ─── מצב המשחק ────────────────────────────────────────────
const state = {
    sequence: [],
    userInput: [],
    countChances: BASE_CHANCES,
    stage: 1,
    stagePoints: 0,
    score: 0,
    isShowingSeq: false,
    isPaused: false,
    isGameOver: false,
    roundToken: 0,
    pendingIds: []
};

setGameState(state);

// ─── עזר: ניהול setTimeout-ים ────────────────────────────
function later(fn, ms) {
    const id = setTimeout(fn, ms);
    state.pendingIds.push(id);
    return id;
}

function cancelAll() {
    state.pendingIds.forEach(clearTimeout);
    state.pendingIds = [];
}

// ─── עזר: לוח ────────────────────────────────────────────
function clearBoard() {
    document.querySelectorAll(".cell")
        .forEach(c => c.classList.remove("active", "player-active", "pc-active"));
}

function lightCell(id) {
    const cell = document.getElementById(`cell-${id}`);
    if (!cell) return;
    cell.classList.add("active");
    playNote(notes[id - 1]);
    setTimeout(() => cell.classList.remove("active"), CELL_LIT_MS);
}

// ─── חישוב זמן תור ───────────────────────────────────────
function turnTime() {
    return Math.min(MAX_TURN_TIME, Math.max(MIN_TURN_TIME, 6 + state.sequence.length * 2));
}

// ─── הצגת רצף (תור מחשב) ─────────────────────────────────
function showSequence() {
    const token = state.roundToken;

    stopTimer();
    cancelAll();
    clearBoard();

    state.isShowingSeq = true;
    state.userInput = [];

    showMessage("צפה ברצף... 👀");

    state.sequence.forEach((id, i) => {
        later(() => {
            if (token !== state.roundToken || state.isGameOver) return;
            lightCell(id);
        }, 500 + i * SEQ_SPEED);   // ← SEQ_SPEED תקין
    });

    // אחרי כל הרצף — עבור לתור שחקן
    const afterSeq = 500 + state.sequence.length * SEQ_SPEED + 400;  // ← תקין
    later(() => {
        if (token !== state.roundToken || state.isGameOver) return;
        beginPlayerTurn(token);
    }, afterSeq);
}

// ─── תחילת תור שחקן ──────────────────────────────────────
function beginPlayerTurn(token) {
    if (state.isGameOver || state.isPaused || token !== state.roundToken) return;

    state.isShowingSeq = false;
    state.userInput = [];

    const t = turnTime();
    showMessage(`תורך! יש לך ${t} שניות ⏱️`);

    Timer(t, () => {
        if (token !== state.roundToken || state.isShowingSeq) return;
        onTimeout();
    });
}

// ─── פג הזמן ─────────────────────────────────────────────
function onTimeout() {
    if (state.isGameOver || state.isPaused || state.isShowingSeq) return;
    loseChance("נגמר הזמן! ⏰ ירד ניסיון");
}

// ─── ניסיון נכשל ─────────────────────────────────────────
function loseChance(msg) {
    stopTimer();
    cancelAll();
    clearBoard();

    state.isShowingSeq = false;
    state.userInput = [];
    state.countChances -= 1;

    updateChances();
    showMessage(msg);

    if (state.countChances <= 0) {
        endGame();
        return;
    }

    later(() => freshRound(), 1800);
}

// ─── סיום משחק ───────────────────────────────────────────
function endGame() {
    if (state.isGameOver) return;
    state.isGameOver = true;

    stopTimer();
    cancelAll();
    clearBoard();

    saveScore(localStorage.getItem("currentPlayerName") || "אנונימי", state.score, state.stage);
    showMessage("Game Over 💀");

    setTimeout(() => { window.location.href = "record.html"; }, 1600);
}

// ─── סיבוב חדש (אחרי הפסד) ───────────────────────────────
function freshRound() {
    if (state.isGameOver || state.countChances <= 0) return;
    state.roundToken += 1;
    state.sequence = [randomCell()];
    state.userInput = [];
    showSequence();
}

// ─── סיבוב הצלחה (מוסיף תא) ─────────────────────────────
function nextRound() {
    if (state.isGameOver || state.countChances <= 0) return;
    state.roundToken += 1;
    state.sequence.push(randomCell());
    state.userInput = [];
    showSequence();
}

function randomCell() {
    return Math.floor(Math.random() * 9) + 1;
}

// ─── לחיצת שחקן ──────────────────────────────────────────
export function handleClick(cellId) {
    if (state.isGameOver || state.isPaused || state.isShowingSeq) return;

    const expected = state.sequence[state.userInput.length];

    playClickEffect(`cell-${cellId}`, true);
    playNote(notes[cellId - 1]);

    if (cellId !== expected) {
        loseChance("טעות! ❌ ירד ניסיון");
        return;
    }

    state.userInput.push(cellId);

    if (state.userInput.length < state.sequence.length) {
        stopTimer();
        const t = turnTime();
        const token = state.roundToken;
        Timer(t, () => {
            if (token !== state.roundToken || state.isShowingSeq) return;
            onTimeout();
        });
        return;
    }

    // הצליח להשלים את כל הרצף
    stopTimer();
    state.score += 1;
    state.stagePoints += 1;
    updateScore();
    showMessage("נכון! ✅");

    if (state.stagePoints >= MAX_STAGE_POINTS) {
        state.stage += 1;
        state.stagePoints = 0;
        SEQ_SPEED = Math.max(300, SEQ_SPEED - 100); // ← מואץ, לא פחות מ-300ms
        updateStage();
        showMessage("עלית שלב! 🎉");
    }

    later(() => nextRound(), 1200);
}

// ─── התחלת משחק ──────────────────────────────────────────
export function startGame() {
    stopTimer();
    cancelAll();
    clearBoard();

    const savedLevel = parseInt(localStorage.getItem("startLevel")) || 1;
    SEQ_SPEED = SPEED_BY_STAGE[savedLevel - 1] ?? 800;  // ← אינדקס תקין

    Object.assign(state, {
        sequence: [],
        userInput: [],
        countChances: BASE_CHANCES,
        stage: savedLevel,
        stagePoints: 0,
        score: 0,
        isShowingSeq: false,
        isPaused: false,
        isGameOver: false,
        roundToken: 0,
        pendingIds: []
    });

    updateStage();
    updateScore();
    updateChances();

    const name = localStorage.getItem("currentPlayerName") || "אנונימי";
    showMessage(`בהצלחה, ${name}! 🎮`);

    later(() => freshRound(), 1000);
}

// ─── כפתור השהייה ────────────────────────────────────────
const pauseBtn = document.getElementById("playing");
if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
        if (state.isGameOver) return;

        state.isPaused = !state.isPaused;
        pauseBtn.textContent = state.isPaused ? "▶️" : "⏸️";

        if (state.isPaused) {
            stopTimer();
            cancelAll();
            showMessage("מושהה ⏸️");
        } else {
            showMessage("ממשיכים ▶️");
            showSequence();
        }
    });
}

// ─── קלט מקלדת ───────────────────────────────────────────
document.addEventListener("keydown", e => {
    const k = Number(e.key);
    if (k >= 1 && k <= 9) handleClick(k);
});