export default class UserAlreadyExistsError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
