export default class OperationNotValidOnTempUserError extends Error {
	constructor(msg: string) {
		super(msg);
	}
}
