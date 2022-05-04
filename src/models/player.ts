export class PlayerModel {
    private userId: string;
    private currentMove: boolean;
    private gameId: string;

    constructor(userId:string, currentMove:boolean, gameId:string) {
        this.userId = userId;
        this.currentMove = currentMove;
        this.gameId = gameId;
    }

    public isCurrentMove() {
        return this.currentMove;
    }
}