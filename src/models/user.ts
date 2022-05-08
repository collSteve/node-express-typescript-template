import * as crypto from 'crypto';

// A class representing a User
export default abstract class UserModel {
  protected userId: string;
  protected games: Set<string> = new Set<string>(); // set of game ids

  /** @constructor */
  constructor() {
    this.userId = this.generateUserId();
  }

  /**
   * If the max number of games has not been reached allow user to join game,
   * otherwise reject new game creation
   * @param {string} gameId - game id to be linked with user
   */
  public joinGame(gameId: string): void {
    if (this.games.size < this.getMaxGames()) {
      this.games.add(gameId);
    }
  }

  /**
   * Removes a game that this user is associated with
   * @param {string} gameId - the gameId of the game to be removed
   */
  public leaveGame(gameId: string): void {
    this.games.delete(gameId);
  }

  /**
   * Returns true if this user is associated with the specified game, false otherwise
   * @param {string} gameId
   * @returns {boolean}
   */
  public hasGame(gameId: string): boolean {
    return this.games.has(gameId);
  }

  /**
   * Removes all games that the player is currently associated with
   */
  public removeAllGameAssociations(): void {
    this.games.clear();
  }

  /**
   * Getters:
   */
  public getUserId() {
    return this.userId;
  }

  public abstract getMaxGames(): number;

  public getAllGameAssociations(): string[] {
    return [...this.games];
  }

  /**
   * Generates random user Id
   * @returns  {string}
   */
  private generateUserId(): string {
    return crypto.randomBytes(64).toString('hex');
  }
}
