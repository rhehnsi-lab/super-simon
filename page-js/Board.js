const size_b = 9;
const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "cyan", "lime"];
 export const boardGame ={
    id: 0,
    color: "",
    isPressed: false
}

/* הפונקציה createBoard אחראית על יצירה דינמית של לוח משחק (או ממשק) בתוך דף ה-HTML. היא עוברת בלולאה על מספר מסוים של תאים, יוצרת אותם, מעצבת אותם ומוסיפה להם אינטראקטיביות. */
export function createBoard(onClick) {
    for (let i = 0; i < size_b; i++) {
        boardGame.id = i + 1;
        boardGame.color = colors[i];
        const cell = document.createElement("div");
        cell.dataset.id = i + 1;
        cell.className = "cell ";
        document.getElementById("board").appendChild(cell);
        console.log(`create data ${i + 1} and color ${colors[i]}`);
        cell.addEventListener("click", () => {
            cell.classList.add("pressed");
            setTimeout(() => {
                cell.classList.remove("pressed");
            }, 150);
            // קריאה לפונקציית onClick עם מזהה התא שנלחץ (i + 1)
            onClick(i + 1);
        });
    }
}
