const size_b=9
let lavel=0;
let id=1;
const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "cyan", "lime"];

export function creatBoard(onClick){
    for(let i =0;i<size_b;i++){
    const cell= document.createElement("div");
    cell.dataset.id=i+1;
    cell.className ="cell ";
    document.getElementById("board").appendChild(cell);
    cell.style.backgroundColor = colors[i];
    cell.addEventListener("click", () => onClick(i + 1));
    console.log(`creat data ${i+1} and color ${colors[i]}`);

}}
