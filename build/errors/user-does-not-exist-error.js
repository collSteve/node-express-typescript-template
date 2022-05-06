"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDoesNotExistError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.default = UserDoesNotExistError;
