"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModel = exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["WaitForPlayersToJoin"] = 0] = "WaitForPlayersToJoin";
    GameState[GameState["WaitToStart"] = 1] = "WaitToStart";
    GameState[GameState["Playing"] = 2] = "Playing";
    GameState[GameState["Ended"] = 3] = "Ended";
})(GameState = exports.GameState || (exports.GameState = {}));
class GameModel {
    constructor(gameType, gameId, maxUserCount = GameModel.DEFAULT_MAX_USER_COUNT) {
        this.userCount = 0;
        this.currentGameInfo = null;
        this.gameType = gameType;
        this.gameId = gameId;
        this.maxUserCount = maxUserCount;
        this.players = new Set();
        this.gameState = GameState.WaitForPlayersToJoin;
    }
    addPlayer(player) {
        if (this.userCount >= this.maxUserCount) {
            throw new Error("Fail to add new player to game: reached max user count in game."); // fail to add
            return;
        }
        if (this.gameState != GameState.WaitForPlayersToJoin) {
            throw new Error("Fail to add new player to game: game is not waiting for players to join");
            return;
        }
        this.players.add(player);
        player.setGameId(this.gameId);
        this.userCount++;
        if (this.userCount >= this.maxUserCount) {
            this.gameState = GameState.WaitToStart;
        }
    }
    getGameId() {
        return this.gameId;
    }
    getGameState() {
        return this.gameState;
    }
    getGameType() {
        return this.gameType;
    }
    getPlayerUserIds() {
        const ids = [];
        this.players.forEach((player) => {
            const id = player.getUserId();
            ids.push(id);
        });
        return ids;
    }
}
exports.GameModel = GameModel;
GameModel.DEFAULT_MAX_USER_COUNT = 2;
