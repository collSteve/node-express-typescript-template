// import { io } from "./socket.io-client";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const gameSocket = io("/game");
const requestCreateGameButton = document.getElementById("request-create-game");

requestCreateGameButton.addEventListener("click", ()=>{requestCreateGame()});

gameSocket.on("connect", ()=>{
    console.log("client connected");
});

function requestCreateGame() {
    gameSocket.emit("user request create game", "[A dummy request for creating a game test]");
}