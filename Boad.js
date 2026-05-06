const size_b = 9;
const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "cyan", "lime"];

export function createBoard(onClick) {
    for (let i = 0; i < size_b; i++) {
        const cell = document.createElement("div");
        cell.dataset.id = i + 1;
        cell.className = "cell ";
        document.getElementById("board").appendChild(cell);
        cell.style.backgroundColor = colors[i];
        console.log(`create data ${i + 1} and color ${colors[i]}`);
        cell.addEventListener("click", () => {
            cell.classList.add("pressed");
            setTimeout(() => {
                cell.classList.remove("pressed");
            }, 150);
            onClick(i + 1);
        });
    }
}
