"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToePlayerModel = exports.TicTacToeModel = void 0;
const data_manipulation_1 = require("../../utils/data-manipulation");
const game_1 = require("../game");
const player_1 = require("../player");
class TicTacToeModel extends game_1.GameModel {
    getGameStatus() {
        const currentGameInfo = (0, data_manipulation_1.deepCopy)(this.currentGameInfo);
        return { gameId: this.gameId, playerUserIds: this.getPlayerUserIds(), gameInfo: currentGameInfo };
    }
    getPlayersStatus() {
        throw new Error("Method not implemented.");
    }
    isMoveValid(move) {
        throw new Error("Method not implemented.");
    }
    updateGame(move) {
        throw new Error("Method not implemented.");
    }
    isGameEnded() {
        throw new Error("Method not implemented.");
    }
}
exports.TicTacToeModel = TicTacToeModel;
class TicTacToePlayerModel extends player_1.PlayerModel {
    getPlayerStatus() {
        return { userId: this.userId, isCurrentMove: this.currentMove, playerGameInfo: [] };
    }
}
exports.TicTacToePlayerModel = TicTacToePlayerModel;
