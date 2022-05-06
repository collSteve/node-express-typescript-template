"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const game_service_1 = require("../services/game-service");
const user_service_1 = __importDefault(require("../services/user-service"));
const game_users_info_model_1 = require("../models/game_users_info_model");
class SocketServer {
    constructor(httpServer) {
        this.io = new socket_io_1.Server({});
        this.gameService = game_service_1.GameService.getInstance();
        this.userService = user_service_1.default.getInstance();
        // testing
        this.userService.createNewUser("123", "123");
        this.gameService.createGameForUser("123", game_users_info_model_1.GameType.TicTacToe, true, 2)
            .then((status) => {
            const gameId = status.gameStatus.gameId;
            console.log(`GameID: ${gameId}: ${this.gameService.getAllUserIdsInGame(gameId)}`);
            // new player
            this.userService.createNewUser("abc", "abc");
            this.gameService.joinUserToGame("abc", game_users_info_model_1.GameType.TicTacToe)
                .then((status) => {
                const gameId = status.gameStatus.gameId;
                console.log(`GameID: ${gameId}: ${this.gameService.getAllUserIdsInGame(gameId)}`);
                // new player
                this.userService.createNewUser("ijk", "ijk");
                this.gameService.joinUserToGame("ijk", game_users_info_model_1.GameType.TicTacToe)
                    .then((status) => {
                    const gameId = status.gameStatus.gameId;
                    console.log(`GameID: ${gameId}: ${this.gameService.getAllUserIdsInGame(gameId)}`);
                });
            });
        });
        this.gameIo = this.io.of("/game");
        this.sessionIo = this.io.of("/sessions");
        this.initializeSocketConnections();
        this.httpServer = httpServer;
        this.io.listen(httpServer);
    }
    initializeSocketConnections() {
        this.io.on("connection", (socket) => {
            this.onUserConnetion(socket);
        });
        this.gameIo.on("connection", (socket) => {
            socket.on("user request create game", (createGameRequestInfo) => {
                this.onUserRequestCreateGame(socket, createGameRequestInfo);
            });
            socket.on("user request join game", (joinGameRequestInfo) => {
                this.onUserRequestJoinGame(socket, joinGameRequestInfo);
            });
            socket.on("user played move", (gameMoveRequestInfo) => {
                this.onUserRequestGameMove(socket, gameMoveRequestInfo);
            });
            socket.on("user request quit game", (quitGameRequestInfo) => {
                this.onUserRequestQuitGame(socket, quitGameRequestInfo);
            });
        });
    }
    onUserConnetion(socket) {
    }
    onUserRequestJoinGame(socket, joinGameRequestInfo) {
    }
    onUserRequestCreateGame(socket, createGameRequestInfo) {
        console.log(`Recieved client's request to create game: <${createGameRequestInfo}>`);
    }
    onUserRequestGameMove(socket, gameMoveRequestInfo) {
    }
    onUserRequestQuitGame(socket, quitGameRequestInfo) {
    }
}
exports.default = SocketServer;
