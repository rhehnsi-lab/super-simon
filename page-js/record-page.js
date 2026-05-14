/**
 * @module recordPage
 * Renders the record page and highlights the latest score.
 */

import { getScores } from "./scoreStorage.js";

/**
 * יוצר אלמנט רשומה מתוך פריט שיא.
 * @param {{name:string,score:number,stage:number}} item
 * @param {number} rank
 * @returns {HTMLLIElement}
 */
function createRecordItem(item, rank) {
    const listItem = document.createElement("li");
    listItem.className = "record-item";

    const title = document.createElement("span");
    title.textContent = `${rank}. ${item.name}`;

    const details = document.createElement("strong");
    details.textContent = `${item.score} נקודות • שלב ${item.stage}`;

    listItem.append(title, details);
    return listItem;
}

function renderRecordPage() {
    const recordLevelEl = document.querySelector(".record-level");
    const recordScoreEl = document.querySelector(".record-score");
    const recordList = document.querySelector(".record-list");
    const params = new URLSearchParams(window.location.search);
    const lastStage = params.get("stage") || "0";
    const lastScore = params.get("score") || "0";
    const scores = getScores();

    if (recordLevelEl) recordLevelEl.textContent = lastStage;
    if (recordScoreEl) recordScoreEl.textContent = lastScore;
    if (!recordList) return;

    const fragment = document.createDocumentFragment();
    scores.forEach((item, index) => {
        fragment.appendChild(createRecordItem(item, index + 1));
    });

    recordList.textContent = "";
    recordList.appendChild(fragment);
}

window.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".record-page")) {
        renderRecordPage();
    }
});
