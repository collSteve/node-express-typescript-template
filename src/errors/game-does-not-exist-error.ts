export class GameDoesNotExistError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}
