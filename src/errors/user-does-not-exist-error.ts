export default class UserDoesNotExistError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
