const sizeoard = 9;
//Q:•	חובה לתעד את כל קבצי ה-JS באמצעות JSDoc.
//A: התיעוד ב-JSDoc מתווסף כתגובות מעל הפונקציות והאובייקטים. הנה דוגמה כיצד ניתן לתעד את פונקציית createBoard באמצעות JSDoc:
//A:**

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

export const boardGame = {
    cells: [],
    init() {
        this.cells = document.querySelectorAll(".cell");
    }
};
