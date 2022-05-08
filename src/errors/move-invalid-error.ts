export default class MoveInvalidError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
