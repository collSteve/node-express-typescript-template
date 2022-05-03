import { PlayerModel } from "../models/game_player";

export class PlayerStore {
    private players: Map<string, PlayerModel>;

    constructor() {
        this.players = new Map<string, PlayerModel>();
    }

    public getPlayer(playerId:string) {
        const player = this.players.get(playerId);
        if (player) {
            return player;
        }

        throw new Error("Player with id not exist");
    }

    public createPlayer(playerId:string) {
        const existPlayer = this.players.get(playerId);

        if (existPlayer) {
            throw new Error(`Player with id ${playerId} already exist.`);
            return;
        }
        const player = new PlayerModel(playerId);
        this.players.set(playerId, player);
    }
}