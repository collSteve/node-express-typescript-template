import { GameType, GameUserInfo } from "./game_users_info_model";

export class GameModel {
    private gameType: GameType;
    private gameId:string;
    private users: Set<GameUserInfo>;
    private maxUserCount: number;
    private userCount: number = 0;

    constructor(gameType: GameType, gameId: string, maxUserCount:number) {
        this.gameType = gameType;
        this.gameId = gameId;
        this.maxUserCount = maxUserCount;

        this.users = new Set<GameUserInfo>();
    }

    public addUser(user:GameUserInfo) {
        if (this.userCount>=this.maxUserCount) {
            throw new Error("Fail to add new user to game: reached max user count in game."); // fail to add
            return;
        }    

        this.users.add(JSON.parse(JSON.stringify(user)));
        this.userCount++;
    }

    public getGameId() {
        return this.gameId;
    }
}