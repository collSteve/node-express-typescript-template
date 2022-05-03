import {GameType, GameUserInfo } from "../models/game_users_info_model";
import * as crypto from "crypto";
import { GameModel } from "../models/game";
import { PlayerModel } from "../models/game_player";

class GameStore{
    private games: Map<string, GameModel>;

    private gameToUsersMap: Map<string, Set<GameUserInfo>>;
    private userToGamesMap: Map<string, Set<GameModel>>;

    constructor() {
        this.gameToUsersMap = new Map<string, Set<GameUserInfo>>();
        this.userToGamesMap = new Map<string, Set<GameModel>>();
        this.games = new Map<string, GameModel>();
    }

    createGame(gameType:GameType, userCount:number = 2, creator: PlayerModel, currentMove:boolean=true) {
        const gameId = crypto.randomBytes(64).toString("hex");  // id generation

        const game = new GameModel(gameType, gameId, userCount);
        this.games.set(gameId, game);

        this.gameToUsersMap.set(game.getGameId(), new Set<GameUserInfo>());
        this.gameToUsersMap.get(game.getGameId())?.add({gameId:gameId, userId:creator.getUserId(), currentMove:currentMove});

        creator.joinGame(game.getGameId());
        const gamesOfCreator = this.userToGamesMap.get(creator.getUserId());

        if (gamesOfCreator) {
            gamesOfCreator.add(game);
        } else {
            const newGameSet = new Set<GameModel>();
            newGameSet.add(game);
            this.userToGamesMap.set(creator.getUserId(), newGameSet);
        }
    }

    joinGame(gameId:string, player:string) {
        
    }
}