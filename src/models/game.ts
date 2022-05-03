import { GameType } from "./game_users_info_model";
import { PlayerModel } from "./player";

export class GameModel {
    private gameType: GameType;
    private gameId:string;
    private players: Set<PlayerModel>;
    private maxUserCount: number;
    private userCount: number = 0;

    constructor(gameType: GameType, gameId: string, maxUserCount:number) {
        this.gameType = gameType;
        this.gameId = gameId;
        this.maxUserCount = maxUserCount;

        this.players = new Set<PlayerModel>();
    }

    public addUser(player:PlayerModel) {
        if (this.userCount>=this.maxUserCount) {
            throw new Error("Fail to add new user to game: reached max user count in game."); // fail to add
            return;
        }    

        this.players.add(JSON.parse(JSON.stringify(player)));
        this.userCount++;
    }

    public getGameId() {
        return this.gameId;
    }
}