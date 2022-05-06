"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDoesNotExistError = void 0;
class GameDoesNotExistError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.GameDoesNotExistError = GameDoesNotExistError;
