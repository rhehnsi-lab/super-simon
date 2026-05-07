import { createBoard, boardGame } from "./Board.js";
import { handleClick, startGame } from "./logicGame.js";


createBoard(handleClick);

const btn = document.getElementById("enter-btn");
const modal = document.getElementById("modal");
const playerName = document.getElementById("player-name");
const homeButton = document.getElementById("home");
const homeScreen = document.getElementById("home-screen");
const backToGame = document.getElementById("back-to-game");
const playerDisplay = document.getElementById("player-display");
const gameLevel = document.getElementById("level");
const gameScore = document.getElementById("score");
const recordLevel = document.querySelector(".record-level");
const recordScore = document.querySelector(".record-score");

btn.addEventListener("click", () => {
    const name = playerName.value.trim();
    if (!name) {
        playerName.focus();
        playerName.reportValidity();
        return;
    }

    if (playerDisplay) {
        playerDisplay.innerText = name;
    }
    if (modal) {
        modal.style.display = "none";
    }
    startGame();
});

if (homeButton) {
    homeButton.addEventListener("click", () => {
        if (gameLevel && recordLevel) {
            recordLevel.innerText = gameLevel.innerText || "0";
        }
        if (gameScore && recordScore) {
            recordScore.innerText = gameScore.innerText || "0";
        }
        if (homeScreen) {
            homeScreen.style.display = "flex";
        }
    });
}

if (backToGame) {
    backToGame.addEventListener("click", () => {
        if (homeScreen) {
            homeScreen.style.display = "none";
        }
    });
}


