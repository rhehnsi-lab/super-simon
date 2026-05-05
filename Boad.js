const size_b=9
let sequence=[];
let userInput=[];
let lavel=0;
let id=1;
const colors = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "cyan", "lime"];

function creatBoard(){
    for(let i =0;i<size_b;i++){
    const cell= document.createElement("div");
    cell.index=i+1;
    cell.class ="cell ";
    document.getElementById("board").appendChild(cell);
    cell.style.backgroundColor = colors[i];

    console.log(`creat data ${i+1} and color ${colors[i]}`);

}}
creatBoard()