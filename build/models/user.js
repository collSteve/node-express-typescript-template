"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A class representing a User
class UserModel {
    /**
     * @constructor
     * @param {string} userId - the user id
     * @param {string} password - password associated with user account
     */
    constructor(userId, password) {
        this.MAX_GAMES = 5;
        this.games = new Set(); // set of game ids
        this.userId = userId;
        this.password = password;
    }
    /**
     * If the max number of games has not been reached allow user to join game,
     * otherwise reject new game creation
     * @param {string} gameId - game id to be linked with user
     */
    joinGame(gameId) {
        if (this.games.size < this.MAX_GAMES) {
            this.games.add(gameId);
        }
    }
    /**
     * Removes a game that this user is associated with
     * @param {string} gameId - the gameId of the game to be removed
     */
    removeGame(gameId) {
        this.games.delete(gameId);
    }
    /**
     * Returns true if this user is associated with the specified game, false otherwise
     * @param {string} gameId
     * @returns {boolean}
     */
    hasGame(gameId) {
        return this.games.has(gameId);
    }
    // getters
    getUserId() {
        return this.userId;
    }
    getPassword() {
        return this.password;
    }
    updatePassword(newPassword) {
        this.password = newPassword;
    }
}
exports.default = UserModel;
