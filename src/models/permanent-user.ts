import User from './user';

/**
 * Permanent user
 * @extends {User}
 */
export default class PermanentUser extends User {
  private readonly MAX_GAMES = 5;
  private userName: string;
  private email: string;
  private password: string;

  /**
   * @constructor
   * @param {string} userName - the userName of the permanent user
   * @param {string} email - the email of the user
   * @param {string} password - the password for user
   */
  constructor(userName: string, email: string, password: string) {
    super();
    this.userName = userName;
    this.email = email;
    this.password = password;
  }

  /**
   * Getters:
   */
  public getUserName(): string {
    return this.userName;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  /** @override */
  public getMaxGames(): number {
    return this.MAX_GAMES;
  }

  /**
   * Setters:
   */
  public setUserName(newUserName: string): void {
    this.userName = newUserName;
  }

  public setEmail(newEmail: string): void {
    this.email = newEmail;
  }

  public setPassword(newPassword: string): void {
    this.password = newPassword;
  }
}
