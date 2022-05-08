import User from './user';

/**
 * Temporary user
 * @extends {User}
 */
export default class TemporaryUser extends User {
  private readonly MAX_GAMES = 1;

  /**
   * @constructor
   * @param {string} userId - the user id of the user
   */
  constructor(userId: string) {
    super(userId);
  }

  /** @override */
  public getMaxGames(): number {
    return this.MAX_GAMES;
  }
}
