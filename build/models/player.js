"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerModel = void 0;
class PlayerModel {
    constructor(userId, currentMove = false, gameId = null) {
        this.userId = userId;
        this.currentMove = currentMove;
        this.gameId = gameId;
    }
    isCurrentMove() {
        return this.currentMove;
    }
    setGameId(gameId) {
        this.gameId = gameId;
    }
    getUserId() {
        return this.userId;
    }
}
exports.PlayerModel = PlayerModel;
