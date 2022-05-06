"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const user_already_exists_error_1 = __importDefault(require("../errors/user-already-exists-error"));
const user_does_not_exist_error_1 = __importDefault(require("../errors/user-does-not-exist-error"));
// A class that handles all User services
// A server can only have one instance of this class
class UserService {
    constructor() {
        this.users = new Map();
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new UserService();
        }
        return this.instance;
    }
    /**
     * Creates a new user if there does not already exist a user with the given id
     * @param {string} userId - the user id of the user to create (must be unique)
     * @param {string} password - the password of the user to create
     * @throws {UserAlreadyExistsError} throws UserAlreadyExistsError if there already exists user with given user id
     */
    createNewUser(userId, password) {
        const ERROR_MESSAGE = `Player with id: ${userId}, already exist`;
        if (this.users.has(userId)) {
            throw new user_already_exists_error_1.default(ERROR_MESSAGE);
        }
        this.users.set(userId, new user_1.default(userId, password));
    }
    /**
     * Removes user with user id
     * @param {string} userId - the id of the user to remove
     * @throws {UserDoesNotExistError} throws UserDoesNotExistError if there does not exist a player with given user id
     */
    deleteUser(userId) {
        const ERROR_MESSAGE = `Player with id: ${userId}, does not exist`;
        if (!this.users.has(userId)) {
            throw new user_does_not_exist_error_1.default(ERROR_MESSAGE);
        }
        this.users.delete(userId);
    }
    /**
     * Retrieves all the users associated with a particular game
     * @param {string} gameId
     * @returns {User[]} an array of users
     */
    retrieveGameUsers(gameId) {
        return [...this.users.values()].filter((user) => user.hasGame(gameId));
    }
    /**
     * Updates specified user's password
     * @param userId - the user id of user to update
     * @param password - the new password
     * @throws {UserDoesNotExistError}
     * @returns {User} the updated user
     */
    updateUserPassword(userId, password) {
        const userToUpdate = this.findUser(userId);
        const updatedUser = userToUpdate.updatePassword(password);
        return updatedUser;
    }
    getUserById(userId) {
        const user = this.users.get(userId);
        if (user) {
            return user;
        }
        throw new user_does_not_exist_error_1.default(`User with Id ${userId} does not exist.`);
    }
    /**
     * Finds user with specified user id
     * @param {string} userId - the user id of the user to find
     * @throws {UserDoesNotExistError} will throw UserDoesNotExistError error if user with given user id is not found
     * @returns {User} the user with given id
     */
    findUser(userId) {
        const ERROR_MESSAGE = `Player with id: ${userId}, does not exist`;
        const userToUpdate = this.users.get(userId);
        if (!userToUpdate) {
            throw new user_does_not_exist_error_1.default(ERROR_MESSAGE);
        }
        return userToUpdate;
    }
}
exports.default = UserService;
UserService.instance = null;
