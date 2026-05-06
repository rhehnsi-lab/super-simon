let interval 
 export const taimer = (minit) => {
    clearInterval(interval);
    let time=minit
   interval= setInterval(()=>{
  time--;
  const mins=  document.getElementById("taimer")
  mins.innerText=time
  if(time<=0)
    clearInterval(interval);
},1000)}