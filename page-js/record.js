// record.js — רץ רק בדף השיאים (record.html)


// storage.js — שמירה וטעינה של שיאים מ-localStorage
// מיובא על ידי logicGame.js בלבד. אין כאן שום DOM.

export function saveScore(name, score, stage) {
    const scores = getScores();
    scores.push({ name, score: Number(score), stage: Number(stage) });
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10);
    localStorage.setItem("highScores", JSON.stringify(scores));
}

export function getScores() {
    try {
        return JSON.parse(localStorage.getItem("highScores")) || [];
    } catch {
        return [];
    }
}111
1
//q:
const MEDALS = ["🥇", "🥈", "🥉"];

function displayScores() {
    const scores = getScores();

    // כרטיסי סיכום עליון
    const bestStage = scores.reduce((max, s) => Math.max(max, s.stage), 0);
    const bestScore = scores.reduce((max, s) => Math.max(max, s.score), 0);

    const levelEl = document.querySelector(".record-level");
    const scoreEl = document.querySelector(".record-score");
    if (levelEl) levelEl.textContent = bestStage;
    if (scoreEl) scoreEl.textContent = bestScore;

    // רשימה
    const list = document.querySelector(".record-list");
    if (!list) return;

    while (list.firstChild) list.removeChild(list.firstChild);

    if (scores.length === 0) {
        const empty = document.createElement("li");
        empty.className = "record-item empty";
        empty.textContent = "אין עדיין שיאים 🏆";
        list.appendChild(empty);
        return;
    }

    scores.forEach((entry, i) => {
        const li = document.createElement("li");
        li.className = "record-item";

        const rank = document.createElement("span");
        rank.className = "rank";
        rank.textContent = MEDALS[i] ?? `#${i + 1}`;

        const player = document.createElement("span");
        player.className = "player";
        player.textContent = entry.name;

        const stage = document.createElement("span");
        stage.className = "stage";
        stage.textContent = `שלב ${entry.stage}`;

        const score = document.createElement("span");
        score.className = "score";
        score.textContent = `${entry.score} קודים`;

        li.appendChild(rank);
        li.appendChild(player);
        li.appendChild(stage);
        li.appendChild(score);
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", displayScores);