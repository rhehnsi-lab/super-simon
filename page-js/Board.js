/**
 * @fileoverview מודול יצירת לוח המשחק — בונה את תשעת התאים ומנהל את אירועי הלחיצה עליהם.
 * @module Board
 */

/** @constant {number} sizeBoard - מספר התאים בלוח המשחק */
const sizeoard = 9;

/**
 * יוצר את לוח המשחק ומוסיף תשעה תאים לאלמנט ה-HTML עם id="board".
 * לכל תא מוסיפה מאזין לחיצה שמפעיל את ה-callback שהועבר.
 *
 * @param {function(number): void} onCellClick - פונקציית callback שתופעל עם מספר התא שנלחץ (1–9).
 * @returns {void}
 *
 * @example
 * createBoard((cellId) => {
 *   console.log(`נלחץ תא מספר ${cellId}`);
 * });
 */
export function createBoard(onCellClick) {
    const board = document.getElementById("board");
    if (!board) {
        console.error("Board element not found!");
        return;
    }

    for (let i = 1; i <= sizeoard; i++) {
        console.log(`Creating cell ${i}`);
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${i}`;
        cell.dataset.id = i;
        cell.setAttribute("aria-label", `תא ${i}`);

        const keyHint = document.createElement("span");
        keyHint.className = "cell-key";
        keyHint.textContent = i;
        cell.appendChild(keyHint);

        cell.addEventListener("click", () => {
            if (typeof onCellClick === "function") {
                onCellClick(i);
            }
        });

        board.appendChild(cell);
    }
}

/**
 * אובייקט המנהל גישה לתאי הלוח ב-DOM.
 *
 * @namespace boardGame
 * @property {NodeList} cells - רשימת כל אלמנטי התא בלוח.
 */
export const boardGame = {
    /** @type {NodeList} */
    cells: [],

    /**
     * מאתחל את הרשימה של תאי הלוח מה-DOM.
     * יש לקרוא לפונקציה זו לאחר ש-{@link createBoard} סיים לבנות את הלוח.
     *
     * @memberof boardGame
     * @returns {void}
     *
     * @example
     * createBoard(handleClick);
     * boardGame.init();
     * console.log(boardGame.cells.length); // 9
     */
    init() {
        this.cells = document.querySelectorAll(".cell");
    }
};