import { GameModel } from "../models/game";
import { GameType } from "../models/game_users_info_model";
import { PlayerModel } from "../models/player";
import {GameClass, PlayerModelClass} from "./game-service"

export interface IGameStorageService {
    getGameByGameId(gameId:string): GameClass<any,any>;
    createGame(gameType: GameType):string;
    updateGameByGameId(gameId:string):void;
    deleteGameByGameId(gameId:string):void;
    addPlayerToGameByGameId(gameId:string, player:PlayerModelClass<any>):void;
    createPlayerByUserId(userId:string, gameType:GameType):string;
    updatePlayerByUserId(userId:string):void;
    removePlayerByUserIdGameId(userId:string, gameId:string):void;
}

export class GameStorageService implements IGameStorageService {
    private gamesMap: Map<string, GameModel<any, any>>;
    private userPlayersMap: Map<string, PlayerModel<any>>; // all players created for a user

    constructor() {
        this.gamesMap = new Map<string, GameModel<any, any>>();
        this.userPlayersMap = new Map<string, PlayerModel<any>>();
    }

    getGameByGameId(gameId: string): GameClass<any, any> {
        throw new Error("Method not implemented.");
    }
    createGame(gameType: GameType): string {
        throw new Error("Method not implemented.");
    }
    updateGameByGameId(gameId: string): void {
        throw new Error("Method not implemented.");
    }
    deleteGameByGameId(gameId: string): void {
        throw new Error("Method not implemented.");
    }
    addPlayerToGameByGameId(gameId: string, player: PlayerModelClass<any>): void {
        throw new Error("Method not implemented.");
    }
    createPlayerByUserId(userId: string, gameType: GameType): string {
        throw new Error("Method not implemented.");
    }
    updatePlayerByUserId(userId: string): void {
        throw new Error("Method not implemented.");
    }
    removePlayerByUserIdGameId(userId: string, gameId: string): void {
        throw new Error("Method not implemented.");
    }

}