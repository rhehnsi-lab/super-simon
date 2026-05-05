let pley=[1,1,2,2,3,3,3,4,5,6]
let sequence = [];
let userInput = [];
let countChans=3;
function randomCell(){
    
        const randomIndex = Math.floor(Math.random() * 9)+1;
        sequence.push(randomIndex);
        console.log(`the cell random ${sequence[i]}`);
    }

function checkEqual(cellId){
    userInput.push(cellId)
    const index=userInput.length-1;
    if(sequence[index]!==userInput[index]){
        console.log("error click")
        sequence=[];
        userInput=[];
        countChans--;
        return;
    }
    if(userInput.length===sequence.length)
    {
        console.log("good");
        userInput=[];
        randomCell();
    }
};
creatBoard();
randomCell();