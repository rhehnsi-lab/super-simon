/**
 * @fileoverview לוגיקת ליבה של המשחק — ניהול רצפים, תורות, ניקוד, שלבים וקלט משתמש.
 * @module logicGame
 */

import { updateStage, updateScore, updateChances, showMessage, setGameState, playClickEffect } from "./ui.js";
import { saveScore } from "./scoreStorage.js";
import { Timer, stopTimer } from "./taimer.js";
import { playNote, notes } from "./sound.js";

// ─── קבועים ───────────────────────────────────────────────

/** @constant {number} MAX_STAGE_POINTS - מספר הצלחות הדרושות למעבר שלב */
const MAX_STAGE_POINTS = 5;

/** @constant {number} BASE_CHANCES - מספר הניסיונות ההתחלתיים */
const BASE_CHANCES = 3;

/**
 * מהירות הצגת הרצף (מילישניות) לכל שלב.
 * @constant {number[]}
 */
const SPEED_BY_STAGE = [800, 700, 600, 500, 400];

/** @type {number} SEQ_SPEED - מהירות הרצף הנוכחית */
let SEQ_SPEED = 800;

/** @constant {number} CELL_LIT_MS - משך ההדלקה של תא (מילישניות) */
const CELL_LIT_MS = 400;

/** @constant {number} MIN_TURN_TIME - זמן מינימלי לתור שחקן (שניות) */
const MIN_TURN_TIME = 8;

/** @constant {number} MAX_TURN_TIME - זמן מקסימלי לתור שחקן (שניות) */
const MAX_TURN_TIME = 20;

// ─── ערכי ברירת מחדל לאיפוס המשחק ───────────────────────

/**
 * אובייקט ברירת מחדל לאיפוס מצב המשחק.
 *
 * 🆕 הוספה: הפרדת ערכי ברירת המחדל לאובייקט קבוע נפרד.
 * לפני כן: הערכים היו פזורים בתוך startGame עם Object.assign.
 * כעת: defaultState מוגדר פעם אחת, ומשמש גם ל-state וגם ל-startGame
 * בעזרת spread operator — מבטיח עקביות ומונע שגיאות הקלדה.
 *
 * @constant {GameState}
 */
const defaultState = {
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

// ─── מצב המשחק ────────────────────────────────────────────

/**
 * @typedef  {Object} GameState
 * @property {number[]} sequence
 * @property {number[]} userInput
 * @property {number}   countChances
 * @property {number}   stage
 * @property {number}   stagePoints
 * @property {number}   score
 * @property {boolean}  isShowingSeq
 * @property {boolean}  isPaused
 * @property {boolean}  isGameOver
 * @property {number}   roundToken
 * @property {number[]} pendingIds
 */

/**
 * 🆕 שינוי: אתחול state עם spread operator במקום ערכים ידניים.
 * לפני כן: הערכים היו כתובים פעמיים — פעם כאן ופעם ב-startGame.
 * כעת: spread מעתיק את כל שדות defaultState ל-state, ללא כפילות.
 *
 * @type {GameState}
 */
const state = { ...defaultState };

setGameState(state);

// ─── עזר: ניהול setTimeout-ים ────────────────────────────

/**
 * מבצע setTimeout ומאחסן את המזהה שלו ב-state.
 *
 * 🆕 שינוי: שימוש ב-rest parameters לקבלת פרמטרים נוספים עתידיים.
 * הפרמטר ...args מאפשר להעביר ארגומנטים נוספים ל-fn בעתיד,
 * בלי לשנות את חתימת הפונקציה.
 * לפני כן: הפונקציה קיבלה בדיוק fn ו-ms בלבד.
 *
 * @param {function} fn - הפונקציה להפעלה.
 * @param {number} ms   - עיכוב במילישניות.
 * @param {...*} args   - ארגומנטים אופציונליים שיועברו ל-fn.
 * @returns {number} מזהה ה-setTimeout.
 */
function later(fn, ms, ...args) {
    const id = setTimeout(() => fn(...args), ms);
    state.pendingIds.push(id);
    return id;
}

/**
 * מבטל את כל ה-setTimeout-ים הממתינים.
 * @returns {void}
 */
function cancelAll() {
    state.pendingIds.forEach(clearTimeout);
    state.pendingIds = [];
}

// ─── עזר: לוח ────────────────────────────────────────────

/**
 * מסיר מכל תאי הלוח את קלאסי ההדלקה הפעילה.
 * @returns {void}
 */
function clearBoard() {
    document.querySelectorAll(".cell")
        .forEach(c => c.classList.remove("active", "player-active", "pc-active"));
}

/**
 * מדליק תא למשך CELL_LIT_MS ומנגן את הצליל המתאים.
 * @param {number} id - מספר התא (1–9).
 * @returns {void}
 */
function lightCell(id) {
    const cell = document.getElementById(`cell-${id}`);
    if (!cell) return;
    cell.classList.add("active");
    playNote(notes[id - 1]);
    setTimeout(() => cell.classList.remove("active"), CELL_LIT_MS);
}

// ─── בדיקת תקינות הרצף ───────────────────────────────────

/**
 * בודק שכל מספרי הרצף הם בטווח תקין של תאים (1–9).
 *
 * 🆕 פונקציה חדשה: שימוש ב-every (HOF).
 * every בודקת שכל פריטי המערך עומדים בתנאי — אם אחד לא עומד, מחזירה false.
 * לפני כן: לא הייתה בדיקה על תקינות ערכי הרצף כלל.
 * כעת: הפונקציה נקראת לפני showSequence כדי לוודא שהרצף תקין.
 *
 * @param {number[]} seq - הרצף לבדיקה.
 * @returns {boolean} האם כל ערכי הרצף תקינים.
 *
 * @example
 * isValidSequence([1, 3, 7]); // true
 * isValidSequence([1, 10, 3]); // false — 10 מחוץ לטווח
 */
function isValidSequence(seq) {
    return seq.every(id => id >= 1 && id <= 9);
}

// ─── חישוב זמן תור ───────────────────────────────────────

/**
 * מחשב את זמן התור לשחקן על בסיס אורך הרצף הנוכחי.
 * @returns {number} זמן התור בשניות.
 */
function turnTime() {
    return Math.min(MAX_TURN_TIME, Math.max(MIN_TURN_TIME, 6 + state.sequence.length * 2));
}

// ─── הצגת רצף (תור מחשב) ─────────────────────────────────

/**
 * מציג את הרצף הנוכחי ועובר לתור השחקן בסיום.
 *
 * 🆕 שינוי: הוספת בדיקת isValidSequence לפני ההצגה.
 * לפני כן: הרצף הוצג בלי שום וידוא שהערכים תקינים.
 * כעת: אם הרצף לא תקין (תא מחוץ לטווח), נזרקת הודעת שגיאה ועצירה.
 *
 * @returns {void}
 */
function showSequence() {
    if (!isValidSequence(state.sequence)) {
        console.error("רצף לא תקין:", state.sequence);
        return;
    }

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
        }, 500 + i * SEQ_SPEED);
    });

    const afterSeq = 500 + state.sequence.length * SEQ_SPEED + 400;
    later(() => {
        if (token !== state.roundToken || state.isGameOver) return;
        beginPlayerTurn(token);
    }, afterSeq);
}

// ─── תחילת תור שחקן ──────────────────────────────────────

/**
 * מתחיל את תור השחקן: מאפס קלט, מציג הודעה ומפעיל טיימר.
 * @param {number} token - token הסיבוב הנוכחי.
 * @returns {void}
 */
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

/**
 * מופעל כאשר הטיימר פג.
 * @returns {void}
 */
function onTimeout() {
    if (state.isGameOver || state.isPaused || state.isShowingSeq) return;
    loseChance("נגמר הזמן! ⏰ ירד ניסיון");
}

// ─── ניסיון נכשל ─────────────────────────────────────────

/**
 * מקטין ניסיון אחד, מציג הודעה ובודק אם המשחק הסתיים.
 * @param {string} msg - הודעת השגיאה.
 * @returns {void}
 */
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

/**
 * מסיים את המשחק: שומר את הניקוד, מציג הודעה ומנווט לדף השיאים.
 * @returns {void}
 */
function endGame() {
    if (state.isGameOver) return;
    state.isGameOver = true;

    stopTimer();
    cancelAll();
    clearBoard();

    const playerName = localStorage.getItem("currentPlayerName") || "אנונימי";
    saveScore(playerName, state.score, state.stage);
    showMessage("Game Over 💀");

    /*
     * שרשור פרמטרים לכתובת URL — מעביר שם, ניקוד ושלב ל-record.html
     * כך שדף השיאים יוכל להדגיש את התוצאה האחרונה גם ללא localStorage.
     */
    const params = new URLSearchParams({
        name: playerName,
        score: state.score,
        stage: state.stage
    });
    setTimeout(() => { window.location.href = `./record.html?${params.toString()}`; }, 1600);
}

// ─── סיבוב חדש (אחרי הפסד) ───────────────────────────────

/**
 * מתחיל סיבוב חדש מאפס לאחר הפסד.
 * @returns {void}
 */
function freshRound() {
    if (state.isGameOver || state.countChances <= 0) return;
    state.roundToken += 1;
    state.sequence = [randomCell()];
    state.userInput = [];
    showSequence();
}

// ─── סיבוב הצלחה ─────────────────────────────────────────

/**
 * ממשיך לסיבוב הבא לאחר הצלחה — מוסיף תא אחד לרצף.
 * @returns {void}
 */
function nextRound() {
    if (state.isGameOver || state.countChances <= 0) return;
    state.roundToken += 1;
    state.sequence.push(randomCell());
    state.userInput = [];
    showSequence();
}

/**
 * מחזיר מספר תא אקראי בין 1 ל-9.
 * @returns {number}
 */
function randomCell() {
    return Math.floor(Math.random() * 9) + 1;
}

// ─── חיפוש תא בהיסטוריית קלט ────────────────────────────

/**
 * בודק אם תא מסוים כבר הוקלד בסיבוב הנוכחי.
 *
 * 🆕 פונקציה חדשה: שימוש ב-indexOf (פונקציית מערך).
 * indexOf מחפשת את הערך במערך ומחזירה את האינדקס שלו, או -1 אם לא נמצא.
 * לפני כן: לא הייתה בדיקה כזו כלל — לא ידענו אם תא כבר הוזן.
 * כעת: אפשר להשתמש בזה כדי לתת פידבק ויזואלי מיוחד לתא שכבר הוזן.
 *
 * @param {number} cellId - מספר התא לחיפוש.
 * @returns {boolean} האם התא כבר הוזן בסיבוב זה.
 *
 * @example
 * // אחרי שהשחקן הזין תא 3:
 * wasCellAlreadyEntered(3); // true
 * wasCellAlreadyEntered(5); // false
 */
function wasCellAlreadyEntered(cellId) {
    return state.userInput.indexOf(cellId) !== -1;
}

// ─── סיכום הרצף כמחרוזת ─────────────────────────────────

/**
 * מחזיר את הרצף הנוכחי כמחרוזת קריאה לצורך לוגינג או debug.
 *
 * 🆕 פונקציה חדשה: שימוש ב-join ו-replace (פונקציות מחרוזת).
 * - join הופכת את מערך המספרים למחרוזת עם מפריד.
 * - replace מחליפה את הסוגריים המרובעים שמגיעים מ-toString ברווח ריק.
 * לפני כן: לא הייתה דרך נוחה להציג את הרצף כטקסט.
 *
 * @returns {string} הרצף כמחרוזת. לדוגמה: "3 → 7 → 1"
 *
 * @example
 * // אם הרצף הוא [3, 7, 1]:
 * getSequenceString(); // "3 → 7 → 1"
 */
function getSequenceString() {
    return state.sequence.join(" → ").replace(/,/g, "");
}

// ─── לחיצת שחקן ──────────────────────────────────────────

/**
 * מטפל בלחיצת שחקן על תא — בודק נכונות, מעדכן קלט וניקוד.
 *
 * 🆕 שינוי קטן: הוספת לוג debug עם getSequenceString.
 * מאפשר לראות בקונסול את הרצף הנוכחי בכל לחיצה.
 *
 * @param {number} cellId - מספר התא שנלחץ (1–9).
 * @returns {void}
 */
export function handleClick(cellId) {
    if (state.isGameOver || state.isPaused || state.isShowingSeq) return;

    const expected = state.sequence[state.userInput.length];

    console.log(`רצף נוכחי: ${getSequenceString()} | תא שנלחץ: ${cellId}`);

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
        SEQ_SPEED = Math.max(300, SEQ_SPEED - 100);
        updateStage();
        showMessage("עלית שלב! 🎉");
    }

    later(() => nextRound(), 1200);
}

// ─── התחלת משחק ──────────────────────────────────────────

/**
 * מאתחל ומפעיל משחק חדש מהתחלה.
 *
 * 🆕 שינוי: שימוש ב-spread operator במקום Object.assign.
 * לפני כן: Object.assign(state, { sequence: [], ... }) — הערכים היו כתובים מחדש.
 * כעת: spread מעתיק את כל ערכי defaultState בצורה נקייה וקצרה יותר.
 * גם מעדכן את stage ו-SEQ_SPEED לפי רמת ההתחלה שנבחרה.
 *
 * @returns {void}
 */
export function startGame() {
    stopTimer();
    cancelAll();
    clearBoard();

    const savedLevel = parseInt(localStorage.getItem("startLevel")) || 1;
    SEQ_SPEED = SPEED_BY_STAGE[savedLevel - 1] ?? 800;

    /*
     * 🆕 שינוי: spread operator במקום Object.assign ידני.
     * כל שדות defaultState מועתקים ל-state, ואז stage מוחלף בערך שנטען.
     */
    Object.assign(state, { ...defaultState, stage: savedLevel });

    updateStage();
    updateScore();
    updateChances();

    const name = localStorage.getItem("currentPlayerName") || "אנונימי";
    showMessage(`בהצלחה, ${name}! 🎮`);

    later(() => freshRound(), 1000);
}

// ─── כפתור השהייה ────────────────────────────────────────

/**
 * מאזין לכפתור ה-pause/resume.
 * @listens HTMLElement#click
 */
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

/**
 * מאזין לקלט מקלדת — מקשים 1–9 מדמים לחיצה על התא המתאים.
 * @listens document#keydown
 */
document.addEventListener("keydown", e => {
    const k = Number(e.key);
    if (k >= 1 && k <= 9) handleClick(k);
});