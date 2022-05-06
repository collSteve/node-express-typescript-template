import { PlayerStatus } from "./player-status";

export abstract class PlayerModel<PlayerGameInfoType> {
    protected userId: string;
    protected currentMove: boolean;
    protected gameId: string|null;

    constructor(userId:string, currentMove:boolean=false, gameId:string|null=null) {
        this.userId = userId;
        this.currentMove = currentMove;
        this.gameId = gameId;
    }

    public isCurrentMove() {
        return this.currentMove;
    }

    public setGameId(gameId:string) {
        this.gameId = gameId;
    }

    public getUserId():string {
        return this.userId;
    }

    public abstract getPlayerStatus():PlayerStatus<PlayerGameInfoType>
}