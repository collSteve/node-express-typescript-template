import UserModel from "../models/user";
import UserAlreadyExistsError from "../errors/user-already-exists-error";
import UserDoesNotExistError from "../errors/user-does-not-exist-error";

// A class that handles all User services
// A server can only have one instance of this class
export default class UserService {
  private users: Map<string, UserModel> = new Map();

  private static instance: UserService|null = null;

  public static getInstance() {
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
  public createNewUser(userId: string, password: string) {
    const ERROR_MESSAGE = `Player with id: ${userId}, already exist`;
    if (this.users.has(userId)) {
      throw new UserAlreadyExistsError(ERROR_MESSAGE);
    }
    this.users.set(userId, new UserModel(userId, password));
  }

  /**
   * Removes user with user id
   * @param {string} userId - the id of the user to remove
   * @throws {UserDoesNotExistError} throws UserDoesNotExistError if there does not exist a player with given user id
   */
  public deleteUser(userId: string) {
    const ERROR_MESSAGE = `Player with id: ${userId}, does not exist`;
    if (!this.users.has(userId)) {
      throw new UserDoesNotExistError(ERROR_MESSAGE);
    }
    this.users.delete(userId);
  }

  /**
   * Retrieves all the users associated with a particular game
   * @param {string} gameId
   * @returns {User[]} an array of users
   */
  public retrieveGameUsers(gameId: string): UserModel[] {
    return [...this.users.values()].filter((user: UserModel) =>
      user.hasGame(gameId)
    );
  }

  /**
   * Updates specified user's password
   * @param userId - the user id of user to update
   * @param password - the new password
   * @throws {UserDoesNotExistError}
   * @returns {User} the updated user
   */
  public updateUserPassword(userId: string, password: string) {
    const userToUpdate = this.findUser(userId);
    const updatedUser = userToUpdate.updatePassword(password);
    return updatedUser;
  }

  public getUserById(userId: string) {
    const user = this.users.get(userId);
    if (user) {
      return user;
    }
    throw new UserDoesNotExistError(`User with Id ${userId} does not exist.`);
  }

  /**
   * Finds user with specified user id
   * @param {string} userId - the user id of the user to find
   * @throws {UserDoesNotExistError} will throw UserDoesNotExistError error if user with given user id is not found
   * @returns {User} the user with given id
   */
  private findUser(userId: string) {
    const ERROR_MESSAGE = `Player with id: ${userId}, does not exist`;
    const userToUpdate = this.users.get(userId);
    if (!userToUpdate) {
      throw new UserDoesNotExistError(ERROR_MESSAGE);
    }
    return userToUpdate;
  }
}
