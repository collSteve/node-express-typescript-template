// A class representing a User
export class UserModel {
  private static readonly MAX_GAMES = 5;
  private userId: string;
  private userName: string;
  private password: string;
  private games: Set<string> = new Set<string>(); // set of game ids

  /**
   * @constructor
   * @param {string} userId - the user id
   * @param {string} userName - the username associated with user
   * @param {string} password - password associated with user account
   */
  constructor(userId: string, userName: string, password: string) {
    this.userId = userId;
    this.userName = userName;
    this.password = password;
  }

  /**
   * If the max number of games has not been reached allow user to join game,
   * otherwise reject new game creation
   * @param {string} gameId - game id to be linked with user
   */
  public joinGame(gameId: string) {
    this.games.add(gameId);
  }

  /**
   * Removes a game from the games this user is associated with
   * @param {string} gameId - the gameId of the game to be removed
   */
  public removeGame(gameId: string) {
    this.games.delete(gameId);
  }

  /**
   * Returns true if this user is associated with the specified game, false otherwise
   * @param {string} gameId
   * @returns {boolean}
   */
  public hasGame(gameId: string) {
    return this.games.has(gameId);
  }

  // getters
  public getUserId() {
    return this.userId;
  }

  public getUserName() {
    return this.userName;
  }

  public getPassword() {
    return this.password;
  }

  // setters:
  public updateUserName(newUserName: string) {
    this.userName = newUserName;
  }

  public updatePassword(newPassword: string) {
    this.password = newPassword;
  }
}
