import UserModel from "../models/user";

export class PlayerStore {
  private players: Map<string, UserModel>;

  constructor() {
    this.players = new Map<string, UserModel>();
  }

  public getPlayer(playerId: string) {
    const player = this.players.get(playerId);
    if (player) {
      return player;
    }

    throw new Error("Player with id not exist");
  }

  public createPlayer(playerId: string) {
    const existPlayer = this.players.get(playerId);

    if (existPlayer) {
      throw new Error(`Player with id ${playerId} already exist.`);
      return;
    }
    const player = new UserModel(playerId);
    this.players.set(playerId, player);
  }
}
