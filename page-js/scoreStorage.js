/**
 * @module scoreStorage
 * shared persistence for high scores.
 */

/**
 * מחזיר את רשימת השיאים שמורה ב-localStorage.
 * @returns {{name:string,score:number,stage:number}[]}
 */
export function getScores() {
    const raw = localStorage.getItem("highScores");
    return raw ? JSON.parse(raw) : [];
}

/**
 * שומר תוצאה חדשה במאגר השיאים ומצמצם ל-10 פריטים.
 * @param {string} name - שם השחקן.
 * @param {number} score - הניקוד שהושג.
 * @param {number} stage - השלב שהושג.
 * @returns {void}
 */
export function saveScore(name = "אנונימי", score = 0, stage = 1) {
    const scores = getScores();
    scores.push({ name, score: Number(score), stage: Number(stage) });
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10);
    localStorage.setItem("highScores", JSON.stringify(scores));
}
