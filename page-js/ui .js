export function updateStage() {
    const stageElement = document.getElementById("level");
    const stageDisplay = document.getElementById("level-display");
    if (stageElement) stageElement.innerText = stage;
    if (stageDisplay) stageDisplay.innerText = stage;
}

export function updateScore() {
    const scoreElement = document.getElementById("score");
    const scoreDisplay = document.getElementById("score-display");
    if (scoreElement) scoreElement.innerText = score;
    if (scoreDisplay) scoreDisplay.innerText = score;
}

export function updateChances() {
    const ch = document.getElementById("ch");
    if (ch) ch.innerText = countChances;

    // בדיקה אם נגמרו החיים
    if (countChances <= 0) {
        gameOver(); // שמירת הניקוד לפני הצגת המסך
        showMessage("Game Over");
        startGame(); // אתחול המשחק מחדש
    }
}
// הצגת טקסט במרכז המסך
export function showMessage(text) {
    const msg = document.querySelector(".message");
    if (msg) msg.innerText = text;
}