import { GameModel, GameState } from "../models/game";
import { TicTacToeModel } from "../models/game-models/TicTacToe";
import { GameType } from "../models/game_users_info_model";
import { PlayerModel } from "../models/player";
import UserModel from "../models/user";
import * as crypto from "crypto";
import UserService from "./user-service";
import { InvalidGameTypeError } from "../errors/invalid-game-type-error";
import {GameDoesNotExistError} from "../errors/game-does-not-exist-error"
import { MaximumOlayerExceededError } from "../errors/maximum-player-exceeded-error";

type GameClass = {new(gameType: GameType, gameId: string, maxUserCount?:number):  GameModel};

const gameTypeToClass: Map<GameType, GameClass> = new Map<GameType, GameClass>();
gameTypeToClass.set(GameType.TicTacToe, TicTacToeModel);

export class GameService {
    private gamesMap: Map<string, GameModel>;
    private userPlayersMap: Map<string, PlayerModel>; // all players created for a user

    private static instance: GameService|null = null;

    private globalUserService:UserService;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GameService();
        }
        return this.instance;
    }

    private constructor() {
        this.gamesMap = new Map<string, GameModel>();
        this.userPlayersMap = new Map<string, PlayerModel>();
        this.globalUserService = UserService.getInstance(); // DI later
    }

    public createGameForUser(creatorId:string, gameType:GameType, currentMove=true, maxUserCount?:number) {
        const creator = this.globalUserService.getUserById(creatorId);

        // create player for creator
        const creatorPlayer = new PlayerModel(creator.getUserId(), currentMove);
        this.userPlayersMap.set(creatorId, creatorPlayer);

        this.createGameForPlayer(creatorPlayer, gameType, currentMove, maxUserCount);
    }

    public async joinUserToGame(userId:string, gameType:GameType) {
        // create player
        const newPlayer = new PlayerModel(userId);

        const successfullyJoined = await this.tryJoinPlayerToExistingGame(newPlayer, gameType);

        if (!successfullyJoined) {
            this.createGameForPlayer(newPlayer, gameType);
        }
    }

    private createGameForPlayer(creatorPlayer:PlayerModel, gameType:GameType, currentMove=true, maxUserCount?:number) {
        const NeededGameClass = gameTypeToClass.get(gameType);
        if (!NeededGameClass) throw new InvalidGameTypeError("GameType does not exist or it does not has a according game type.");

        // create a game of gameType
        const gameId = crypto.randomBytes(64).toString("hex");  // game id generation
        const newGame = new NeededGameClass(gameType, gameId, maxUserCount);
        this.gamesMap.set(gameId, newGame);

        newGame.addPlayer(creatorPlayer);
    }

    private async tryJoinPlayerToExistingGame(player: PlayerModel, gameType:GameType) {
        for (const [gameId, game] of Object.entries(this.gamesMap)) {
            if (game.getGameType() === gameType && game.getGameState() == GameState.WaitForPlayersToJoin) {
                try {
                    game.addPlayer(player);
                    return true;
                } catch(e:unknown) {
                    if (e instanceof MaximumOlayerExceededError) {
                        return false;
                    }
                }
                break;
            }
        }
        return false;
    }

    getGameById(gameId:string):GameModel {
        const game = this.gamesMap.get(gameId);
        if (game) {
            return game;
        }

        throw new GameDoesNotExistError(`Game with gameId ${gameId} does not exist`);
    }
}