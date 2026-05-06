import { Taimer } from "./taimer.js";
let pley=[1,1,2,2,3,3,3,4,5,6]
let sequence = [];
let userInput = [];
let countChans=3;
let  level=1;
let isPlaying = false;
let taimer=45;
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
        } ,index * 700);
})
setTimeout(()=>
{isPlaying=false;},sequence.length*800);
};

export function handleClick(cellId){
    if(isPlaying)return;
  
    userInput.push(cellId)
    const index=userInput.length-1;
    showMessage(cellId);
    if(sequence[index]!==userInput[index]){
        console.log("error click")
        sequence=[];
        userInput=[];
        countChans--;
        updateChans();
        startGame();
        return;
    }
    if(userInput.length===sequence.length)
    {
        console.log("good");
        userInput=[];
        randomCell();
        pleySequence();
        Taimer(taimer)
    }
};

function lightCell(id){
    const light = document.querySelector(`[data-id="${id}"]`)
    light.classList.add("active");
       setTimeout(()=>{
         light.classList.remove("active");
       },500);
}
function updateChans(){
    if (countChans<=0){showMessage("gameOver");
    startGame();
    }
    const ch = document.getElementById("ch");
    ch.innerText = countChans;
}
function showMessage(text) {
    const msg = document.querySelector(".message");
    msg.innerText += text;};
export function startGame(){
sequence=[];
userInput=[];
updateChans();
randomCell();
pleySequence();
Taimer(taimer);
};

function stopp(){
    const playing=document.getElementById("playing");
    playing.addEventListener("click",()=>{
        if(!isPlaying)
            isPlaying=true;
        else isPlaying=false;})
};
stopp();
