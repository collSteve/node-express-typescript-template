import { GameModel, GameState } from "../models/game";
import { TicTacToeModel } from "../models/game-models/TicTacToe";
import { GameMove, GameType } from "../models/game_users_info_model";
import { PlayerModel } from "../models/player";
import UserModel from "../models/user";
import * as crypto from "crypto";
import UserService from "./user-service";
import { InvalidGameTypeError } from "../errors/invalid-game-type-error";
import {GameDoesNotExistError} from "../errors/game-does-not-exist-error"
import { MaximumOlayerExceededError } from "../errors/maximum-player-exceeded-error";
import { GameStatus } from "../models/game-status";
import { PlayerStatus } from "../models/player-status";

type GameClass = {new(gameType: GameType, gameId: string, maxUserCount?:number):  GameModel<any,any>};

const gameTypeToClass: Map<GameType, GameClass> = new Map<GameType, GameClass>();
gameTypeToClass.set(GameType.TicTacToe, TicTacToeModel);

interface IGameService {
    createGameForUser(creatorId:string, gameType:GameType, currentMove:boolean, maxUserCount?:number): {gameStatus:GameStatus<any>, playerStatus:PlayerStatus<any>};
    joinUserToGame(userId:string, gameType:GameType):{gameStatus:GameStatus<any>, playerStatus:PlayerStatus<any>};
    GetAllUserIdsInGame(gameId:string):string[];
    UpdateGame(gameId:string, move:GameMove):{gameStatus:GameStatus<any>, playersStatus:PlayerStatus<any>, isGameEnded:boolean};
}


export class GameService implements IGameService {
    private gamesMap: Map<string, GameModel<any,any>>;
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
        this.gamesMap = new Map<string, GameModel<any, any>>();
        this.userPlayersMap = new Map<string, PlayerModel>();
        this.globalUserService = UserService.getInstance(); // DI later
    }

    public createGameForUser(creatorId:string, gameType:GameType, currentMove=true, maxUserCount?:number) {
        const creator = this.globalUserService.getUserById(creatorId); // throw user not exist error

        // create player for creator
        const creatorPlayer = new PlayerModel(creator.getUserId(), currentMove);
        this.userPlayersMap.set(creatorId, creatorPlayer);

        this.createGameForPlayer(creatorPlayer, gameType, currentMove, maxUserCount);



        return {};//stub;
    }

    public async joinUserToGame(userId:string, gameType:GameType) {
        const user = this.globalUserService.getUserById(userId); // throw user not exist error

        // create player
        const newPlayer = new PlayerModel(user.getUserId());
        this.userPlayersMap.set(userId, newPlayer);

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

    // async due to database implementation in later
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
                    return false;
                }
            }
        }
        return false;
    }

    public getGameById(gameId:string): GameModel<any,any> {
        const game = this.gamesMap.get(gameId);
        if (game) {
            return game;
        }

        throw new GameDoesNotExistError(`Game with gameId ${gameId} does not exist`);
    }
}