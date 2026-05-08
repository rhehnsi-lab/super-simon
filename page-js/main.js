import { createBoard } from "./Board.js";
import { handleClick, startGame } from "./logicGame.js";

const boardContainer = document.getElementById("board");
if (boardContainer) {
    createBoard(handleClick);
}

const btn = document.getElementById("enter-btn");
const playerName = document.getElementById("player-name");
const homeButton = document.getElementById("home");
const homeScreen = document.getElementById("home-screen");
const backToGame = document.getElementById("back-to-game");
const gamePage = document.querySelector(".game-page");
const gameLevel = document.getElementById("level");
const gameScore = document.getElementById("score");
const recordLevel = document.querySelector(".record-level");
const recordScore = document.querySelector(".record-score");
const playerDisplay = document.getElementById("player-display");
const playerNameLabel = document.getElementById("player-name-label");

if (btn) {
    btn.addEventListener("click", () => {
        const name = playerName ? playerName.value.trim() : "";

        if (!name && playerName) {
            playerName.focus();
            playerName.reportValidity();
            return;
        }

        localStorage.setItem("currentPlayerName", name);
        window.location.href = "game.html";
    });
}

if (boardContainer) {
    const savedName = localStorage.getItem("currentPlayerName") || "אנונימי";
    if (playerDisplay) playerDisplay.innerText = savedName;
    if (playerNameLabel) playerNameLabel.innerText = savedName;
    startGame();
}

if (homeButton) {
    homeButton.addEventListener("click", () => {
        if (recordLevel && gameLevel) {
            recordLevel.innerText = gameLevel.innerText || "0";
        }

        if (recordScore && gameScore) {
            recordScore.innerText = gameScore.innerText || "0";
        }

        if (homeScreen) {
            homeScreen.style.display = "flex";
        }

        if (gamePage) {
            gamePage.style.display = "none";
        }
    });
}

if (backToGame) {
    backToGame.addEventListener("click", () => {
        if (homeScreen) {
            homeScreen.style.display = "none";
        }

        if (gamePage) {
            gamePage.style.display = "flex";
        }
    });
}