import * as crypto from 'crypto';
import User from '../models/user';
import UserAlreadyExistsError from '../errors/user-already-exists-error';
import UserDoesNotExistError from '../errors/user-does-not-exist-error';
import TemporaryUser from '../models/temporary-user';
import PermanentUser from '../models/permanent-user';
import { GameService } from './game-service';

/**
 * A class that handles all User services
 */
export default class UserService {
  private static readonly USER_ALREADY_EXISTS_MSG: string = `The user with the given id and/or username already exists`;
  private static readonly USER_DOES_NOT_EXIST_MSG: string = `The user with the specified id does not exist`;
  private static instance: UserService | null = null;
  private readonly gloablGameService: GameService;
  private users: Map<string, User> = new Map();

  /** @constructor */
  private constructor() {
    this.gloablGameService = GameService.getInstance();
  }

  /**
   * Ensures only one instance of UserService is created
   * @returns {UserService}
   */
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new UserService();
    }
    return this.instance;
  }

  /**
   * Creates new Temporary User
   * @throws {UserAlreadyExistsError} Throws error if there already exists a user with the same id
   */
  public createTempUser(): void {
    const newUserId: string = this.generateUserId();

    if (this.users.has(newUserId)) {
      throw new UserAlreadyExistsError(UserService.USER_ALREADY_EXISTS_MSG);
    }

    const newUser: User = new TemporaryUser(newUserId);
    this.users.set(newUserId, newUser);
  }

  /**
   * Creates a new Permanent User with the specified details
   * @param {string} userName
   * @param {string} email
   * @param {string} password
   * @throws {UserAlreadyExistsError} Throws error if there already exists a user with the same id, username or email
   */
  public createPermanentUser(userName: string, email: string, password: string): void {
    const newUserId: string = this.generateUserId();

    if (this.users.has(newUserId) || !this.userNameUnique(userName) || !this.emailUnique(email)) {
      throw new UserAlreadyExistsError(UserService.USER_ALREADY_EXISTS_MSG);
    }

    const newUser: User = new PermanentUser(newUserId, userName, email, password);
    this.users.set(newUserId, newUser);
  }

  /**
   * Removes user with the specified id, and removes user from all games the user is associated with
   * @param {string} userId
   * @throws {UserDoesNotExistError} Throws error if there does not exist a player with specified user id
   */
  public deleteUser(userId: string): void {
    if (!this.users.has(userId)) {
      throw new UserDoesNotExistError(UserService.USER_DOES_NOT_EXIST_MSG);
    }

    // remove user from all games the he/she is associated with:
    const userGames: string[] | undefined = this.users.get(userId)?.getAllGameAssociations();
    this.gloablGameService.removeUserFromGames(userId);

    // delete user:
    this.users.delete(userId);
  }

  /**
   * Retrieves all the users associated with a particular game
   * @param {string} gameId
   * @returns {User[]} an array of users
   */
  public retrieveGameUsers(gameId: string): User[] {
    return [...this.users.values()].filter((user: User) => user.hasGame(gameId));
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

  /**
   * Generates a random user id
   * @returns {string}
   */
  private generateUserId(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Returns true if there does not exist another user with the same user name, false otherwise
   * @param {string} userName
   * @returns {boolean}
   */
  private userNameUnique(userName: string): boolean {
    for (let user of this.users.values()) {
      if (user instanceof PermanentUser) {
        if (userName === user.getUserName()) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Returns true if there does not already exist an user associated with the indicated email, false otherwise
   * @param {string} email
   * @returns {boolean}
   */
  private emailUnique(email: string): boolean {
    for (let user of this.users.values()) {
      if (user instanceof PermanentUser) {
        if (email === user.getEmail()) {
          return false;
        }
      }
    }
    return true;
  }
}
