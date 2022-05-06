"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserAlreadyExistsError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.default = UserAlreadyExistsError;
