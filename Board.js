/**
 * Board.js - Creates and manages the game board
 */

export function createBoard(onCellClick) {
    const board = document.getElementById("board");
    
    if (!board) {
        console.error("Board element not found!");
        return;
    }

    
    for (let i = 1; i <= 9; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.id = i;
        cell.setAttribute("aria-label", `Cell ${i}`);

        // Add click event listener
        cell.addEventListener("click", () => {
            if (typeof onCellClick === "function") {
                onCellClick(i);
            }
        });

        board.appendChild(cell);
    }

    console.log("Game board created successfully!");
}

export const boardGame = {
    cells: [],
    init: function() {
        this.cells = document.querySelectorAll(".cell");
    }
};
