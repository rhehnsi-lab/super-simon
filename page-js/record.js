// record.js

export function saveScore(name, score, stage) {
    const scores = getScores();
    scores.push({ name, score: Number(score), stage: Number(stage) });
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10); // שומרת רק 10 ראשונים
    localStorage.setItem("highScores", JSON.stringify(scores));
}

export function getScores() {
    return JSON.parse(localStorage.getItem("highScores")) || [];
}

// קריאת נתונים מה-URL בטעינת דף השיאים
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const score = params.get("score");
const stage = params.get("stage");

if (name) {
    saveScore(name, score, stage);
    displayScores();
}

function displayScores() {
    const scores = getScores();
    const list = document.getElementById("scores-list");
    if (!list) return;

    scores.forEach((entry, i) => {
        const row = document.createElement("tr");

        [i + 1, entry.name, entry.score, entry.stage].forEach(val => {
            const td = document.createElement("td");
            td.textContent = val;
            row.appendChild(td);
        });

        list.appendChild(row);
    });
}