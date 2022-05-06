"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidGameTypeError = void 0;
class InvalidGameTypeError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.InvalidGameTypeError = InvalidGameTypeError;
