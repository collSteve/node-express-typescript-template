// A class representing a User
export default class UserModel {
  private readonly MAX_GAMES = 5;
  protected userId: string;
  private password: string;
  private games: Set<string> = new Set<string>(); // set of game ids

  /**
   * @constructor
   * @param {string} userId - the user id
   * @param {string} password - password associated with user account
   */
  constructor(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
  }

  /**
   * If the max number of games has not been reached allow user to join game,
   * otherwise reject new game creation
   * @param {string} gameId - game id to be linked with user
   */
  public joinGame(gameId: string) {
    if (this.games.size < this.MAX_GAMES) {
      this.games.add(gameId);
    }
  }

  /**
   * Removes a game that this user is associated with
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

  public getPassword() {
    return this.password;
  }

  public updatePassword(newPassword: string) {
    this.password = newPassword;
  }
}
