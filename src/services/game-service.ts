import { GameModel } from "../models/game";
import { TicTacToeModel } from "../models/game-models/TicTacToe";
import { GameType } from "../models/game_users_info_model";
import { PlayerModel } from "../models/player";
import UserModel from "../models/user";
import * as crypto from "crypto";

type GameClass = {new(gameType: GameType, gameId: string, maxUserCount?:number):  GameModel};

const gameTypeToClass: Map<GameType, GameClass> = new Map<GameType, GameClass>();
gameTypeToClass.set(GameType.TicTacToe, TicTacToeModel);

export class GameService {
    private gamesList: GameModel[];
    private playersList: PlayerModel[];

    private static instance: GameService|null = null;

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new GameService();
        }
        return this.instance;
    }

    private constructor() {
        this.gamesList = [];
        this.playersList = [];
    }

    public createGameForUser(creatorId:string, gameType:GameType) {

    }

    createGame(creator:UserModel, gameType:GameType, userCount?:number, creatorMoveFirst:boolean=true) {
        // create game
        const NeededGameClass = gameTypeToClass.get(gameType);
        if (!NeededGameClass) throw new Error("GameType does not exist or it does not has a according game type.");

        const gameId = crypto.randomBytes(64).toString("hex");  // game id generation
        const newGame = new NeededGameClass(gameType, gameId, userCount);
        
        // create a player for user
        const creatorPlayer = new PlayerModel(creator.getUserId(), creatorMoveFirst, gameId);

        newGame.addPlayer(creatorPlayer);

        this.gamesList.push(newGame);
        this.playersList.push(creatorPlayer);
    }

    joinUserToGame(player:PlayerModel, gameType:GameType, gameId: string) {
        const game:GameModel = this.getGameById(gameId);
        game.addPlayer(player);
    }

    getGameById(gameId:string):GameModel {
        this.gamesList.forEach((game,i)=>{
            if (gameId === game.getGameId()){
                return game;
            }
        });
        throw new Error(`Game with gameId ${gameId} does not exist`);
    }
}