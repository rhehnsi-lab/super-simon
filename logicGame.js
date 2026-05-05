let pley=[1,1,2,2,3,3,3,4,5,6]
let sequence = [];
let userInput = [];
let countChans=3;
let isPlaying = false;
function randomCell(){
    
        const randomIndex = Math.floor(Math.random() * 9)+1;
        sequence.push(randomIndex);
        console.log(`the cell random ${randomIndex}`);
};

function pleySequence(){
    isPlaying=true;
    sequence.forEach((id,index)=> {
        setTimeout(() => {
            lightCell(id);
        } ,index * 500);
})};

export function handleClick(cellId){
    if(isPlaying)return;
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
        pleySequence();
    }
};

function lightCell(id){
    const light = document.querySelector(`[data-id="${id}"]`)
    light.classList.add("active");
       setTimeout(()=>{
         light.classList.remove("active");
       },500);
}
export function startGame(){
sequence=[];
userInput=[];

randomCell();
pleySequence();
};
