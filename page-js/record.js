export function saveScore(name,score,stage  ) {
const score= getScore(); 
score.push({score,name,stage});
score.sort((a, b) => b.score - a.score); // מיון לפי ניקוד בסדר יורד
localStorage.setItem("highScores", JSON.stringify(score)); // שמירת הניקוד 
}
export function getScore() {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];   
  
}