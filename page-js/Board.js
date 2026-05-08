export function createBoard(onCellClick) {
    const board = document.getElementById("board");
    if (!board) {
        console.error("Board element not found!");
        return;
    }

    // מסיר תאים ישנים אחד אחד — ללא innerHTML
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    for (let i = 1; i <= 9; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${i}`;
        cell.dataset.id = i;
        cell.setAttribute("aria-label", `תא ${i}`);

        // מספר מקלדת בפינה
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