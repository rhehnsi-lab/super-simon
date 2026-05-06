import { createBoard } from "./Boad.js";
import { handleClick, startGame } from "./logicGame.js";

createBoard(handleClick);

const btn = document.getElementById("enter-btn");
const modal = document.getElementById("modal");
const playerName = document.getElementById("player-name");
const homeButton = document.getElementById("home");
const homeScreen = document.getElementById("home-screen");
const backToGame = document.getElementById("back-to-game");
const playerDisplay = document.getElementById("player-display");

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
        if (homeScreen) {
            homeScreen.style.display = "block";
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


