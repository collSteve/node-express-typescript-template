import User from './user';

/**
 * Temporary user
 * @extends {User}
 */
export default class TemporaryUser extends User {
  private readonly MAX_GAMES = 1;

  /** constructor */
  constructor() {
    super();
  }

  /** @override */
  public getMaxGames(): number {
    return this.MAX_GAMES;
  }
}
