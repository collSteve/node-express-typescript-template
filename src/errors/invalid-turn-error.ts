export default class InvalidTurnError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
