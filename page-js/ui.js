/**
 * @fileoverview שכבת ממשק המשתמש — עדכון אלמנטי DOM, אפקטים ויזואליים והודעות.
 * כל הפונקציות בודקות קיום אלמנטים לפני גישה כדי לתמוך בריצה בכמה דפים.
 * @module ui
 */

/**
 * רפרנס למצב המשחק, מוזרק מ-{@link module:logicGame} דרך {@link setGameState}.
 * @type {import('./logicGame.js').GameState|null}
 */
let gameState = null;

/**
 * מזריק את אובייקט מצב המשחק למודול ה-UI.
 * יש לקרוא פונקציה זו מיד לאחר יצירת ה-state ב-logicGame.js.
 *
 * @param {import('./logicGame.js').GameState} state - אובייקט מצב המשחק.
 * @returns {void}
 *
 * @example
 * // בתוך logicGame.js:
 * setGameState(state);
 */
export function setGameState(state) {
    gameState = state;
}

/**
 * מעדכן את תצוגת השלב הנוכחי בכל האלמנטים הרלוונטיים ב-DOM.
 * מחפש גם `#level` (בעמוד המשחק) וגם `#level-display` (overlay).
 *
 * @returns {void}
 */
export function updateStage() {
    const stageElement = document.getElementById("level");
    const stageDisplay = document.getElementById("level-display");
    if (!gameState) return;
    if (stageElement) stageElement.innerText = gameState.stage;
    if (stageDisplay) stageDisplay.innerText = gameState.stage;
}

/**
 * מעדכן את תצוגת הניקוד הנוכחי בכל האלמנטים הרלוונטיים ב-DOM.
 * מחפש `#score`, `#score-display` וגם `.record-score` (כרטיס שיאים).
 *
 * @returns {void}
 */
export function updateScore() {
    const scoreElement = document.getElementById("score");
    const scoreDisplay = document.getElementById("score-display");
    const recordScore = document.querySelector(".record-score");
    if (!gameState) return;
    if (scoreElement) scoreElement.innerText = gameState.score;
    if (scoreDisplay) scoreDisplay.innerText = gameState.score;
    if (recordScore) recordScore.innerText = gameState.score;
}

/**
 * מעדכן את תצוגת מספר הניסיונות שנותרו (`#ch`).
 * הניווט לדף שיאים בעת סיום מטופל ב-{@link module:logicGame} ולא כאן.
 *
 * @returns {void}
 */
export function updateChances() {
    const ch = document.getElementById("ch");
    if (gameState && ch) {
        ch.innerText = gameState.countChances;
    }
}

/**
 * מוסיף אפקט ויזואלי קצר לתא על ידי הוספת class ייעודי להסרתו לאחר 200ms.
 *
 * @param {string}  elementId - ה-id של אלמנט התא (למשל `"cell-3"`).
 * @param {boolean} [isPlayer=true] - אם `true` מוסיף `"player-active"`, אחרת `"pc-active"`.
 * @returns {void}
 *
 * @example
 * playClickEffect("cell-5", true);  // אפקט לחיצת שחקן על תא 5
 * playClickEffect("cell-2", false); // אפקט הצגת מחשב על תא 2
 */
export function playClickEffect(elementId, isPlayer = true) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const effectClass = isPlayer ? "player-active" : "pc-active";
    element.classList.add(effectClass);
    setTimeout(() => {
        element.classList.remove(effectClass);
    }, 200);
}

/**
 * מציג הודעה בתיבת ההודעות (`.message`) בעמוד המשחק.
 *
 * @param {string} text - טקסט ההודעה להצגה.
 * @returns {void}
 *
 * @example
 * showMessage("נכון! ✅");
 * showMessage("טעות! ❌ ירד ניסיון");
 */
export function showMessage(text) {
    const msg = document.querySelector(".message");
    if (msg) msg.innerText = text;
}