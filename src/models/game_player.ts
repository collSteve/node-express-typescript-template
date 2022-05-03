
export class PlayerModel {
    private userId: string;
    private games: Set<string>;

    constructor(userId:string) {
        this.userId = userId;
        this.games = new Set<string>();
    }

    public getUserId() {
        return this.userId;
    }

    public joinGame(gameId:string) {
        this.games.add(gameId);
    }
}