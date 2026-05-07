// logicGame.js

import { saveScore } from "../record.js";
import { Timer } from "../taimer.js";
import { playNote, notes } from "../sound.js"; // ייבוא הסאונד
// --- הגדרות קבועות (חוקי המשחק) ---
const gameStart = {
    sequence =[],          // הרצף שהמחשב בנה
    userInput =[],        // מה שהשחקן לחץ בפועל
    countChances = baseChances,
    stage = 1,
    stagePoints = 0,
    score = 0,
    timer = baseTimer,
    isPlaying = false
}
const maxStagePoints = 7;   // כמה הצלחות צריך כדי לעבור שלב
const baseTimer = 15;       // זמן התחלתי לכל סיבוב
const baseChances = 3;     // כמות פסילות התחלתית
const minTimer = 5;         // הגבול התחתון של הזמן (שלא יהיה קצר מדי)
const minChances = 1;       // הגבול התחתון של הפסילות

// --- משתני מצב (משתנים שמשתנים במהלך המשחק) ---

let stagePoints = 0;
let score = 0;
let isPlaying = false;      // חיווי האם המחשב "מדבר" כרגע
let timer = baseTimer;

// --- פונקציות עדכון ממשק (UI) ---
// מעדכנות את המספרים שמופיעים לשחקן על המסך

// --- לוגיקת הרצף ---

// הגרלת מספר בין 1 ל-9 והוספתו לסוף הרצף
function randomCell() {
    const randomIndex = Math.floor(Math.random() * 9) + 1;
    sequence.push(randomIndex);
}

// מעבר על המערך והצגת כל תא בתורו עם השהיה
function playSequence(onSequenceEnd) {
    isPlaying = true; // נועל לחיצות משתמש
    sequence.forEach((id, index) => {
        setTimeout(() => {
            lightCell(id);
        }, index * 1000); // רווח של שנייה בין הבהוב להבהוב
    });

    // פתיחת הנעילה בסיום כל ההבהובים
    setTimeout(() => {
        isPlaying = false;
        if (typeof onSequenceEnd === "function") onSequenceEnd();
    }, sequence.length * 1000);
}

// --- טיפול באירועים ותוצאות ---

// מה קורה כשעולים שלב: מקצרים זמן ומורידים אפשרות לפסילה (העלאת קושי)
function handleStageUpgrade() {
    stage++;
    stagePoints = 0;
    timer = Math.max(minTimer, timer - 5);
    countChances = Math.max(minChances, countChances - 1);
    showMessage("Stage upgraded!");
    updateStage();
    updateChances();
}

// מה קורה כשנגמר הזמן
function handleTimeout() {
    showMessage("Time's up");
    sequence = [];
    userInput = [];
    countChances--;
    updateChances();
    if (countChances > 0)
        saveScore(playerDisplay.innerText, score, stage); // שמירת הניקוד לפני אתחול מחדש
    updateChances();

}

// הפונקציה המרכזית: בדיקת כל לחיצה של המשתמש
export function handleClick(cellId) {
    if (isPlaying) return; // הגנה: לא מאפשר ללחוץ כשהמחשב מציג רצף

    playNote(notes[cellId - 1]); // צליל ללחיצה
    userInput.push(cellId);
    const index = userInput.length - 1;

    // בדיקה: האם הלחיצה הנוכחית טועה?
    if (sequence[index] !== userInput[index]) {
        showMessage("Wrong!");
        sequence = [];
        userInput = [];
        countChances--;
        updateChances();
        if (countChances > 0) {
            setTimeout(startGame, 1000);
        }
        return;
    }

    // בדיקה: האם השלמת את כל הרצף בהצלחה?
    if (userInput.length === sequence.length) {
        showMessage("Correct!");
        score++;
        stagePoints++;
        updateScore();

        if (stagePoints >= maxStagePoints) {
            handleStageUpgrade();
        }

        userInput = []; // איפוס לקראת הסיבוב הבא
        randomCell();   // הוספת צעד חדש לרצף
        // הצגת הרצף החדש והפעלת טיימר בסיומו
        playSequence(() => Timer(timer, handleTimeout));
    }
}

// --- פונקציות עזר ויזואליות ---

// הארת תא בלוח (הוספת מחלקת CSS והסרתה)
function lightCell(id) {
    const light = document.querySelector(`[data-id="${id}"]`);
    if (!light) return;

    playNote(notes[id - 1]); // צליל הבהוב אוטומטי
    light.classList.add("active");
    setTimeout(() => {
        light.classList.remove("active");
    }, 500);
}

// הצגת טקסט במרכז המסך
function showMessage(text) {
    const msg = document.querySelector(".message");
    if (msg) msg.innerText = text;
}

// אתחול המשחק מאפס
export function startGame() {

    Object.assign(gameStart); // איפוס כל המשתנים למצב ההתחלתי 
    updateStage();
    updateScore();
    updateChances();
    showMessage("Get Ready...");

    setTimeout(() => {
        randomCell();
        playSequence(() => Timer(timer, handleTimeout));
    }, 1000);
}

// --- מאזינים חיצוניים (מקלדת וכפתורי שליטה) ---

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
        isPlaying = !isPlaying; // עצירה/המשך לוגי
    });
}

stopp();