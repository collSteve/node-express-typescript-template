"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GameService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const game_1 = require("../models/game");
const TicTacToe_1 = require("../models/game-models/TicTacToe");
const game_users_info_model_1 = require("../models/game_users_info_model");
const crypto = __importStar(require("crypto"));
const user_service_1 = __importDefault(require("./user-service"));
const invalid_game_type_error_1 = require("../errors/invalid-game-type-error");
const game_does_not_exist_error_1 = require("../errors/game-does-not-exist-error");
const data_manipulation_1 = require("../utils/data-manipulation");
const static_implements_1 = require("../utils/static-implements");
const gameTypeToClass = new Map();
gameTypeToClass.set(game_users_info_model_1.GameType.TicTacToe, { gameClass: TicTacToe_1.TicTacToeModel, playerClass: TicTacToe_1.TicTacToePlayerModel });
let GameService = GameService_1 = class GameService {
    constructor() {
        this.gamesMap = new Map();
        this.userPlayersMap = new Map();
        this.globalUserService = user_service_1.default.getInstance(); // DI later
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new GameService_1();
        }
        return this.instance;
    }
    createGameForUser(creatorId, gameType, currentMove = true, maxUserCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const creator = this.globalUserService.getUserById(creatorId); // throw user not exist error
            const NeededGamePlayerClass = gameTypeToClass.get(gameType);
            if (!NeededGamePlayerClass)
                throw new invalid_game_type_error_1.InvalidGameTypeError("GameType does not exist or it does not has a according game type.");
            // create a game of gameType
            const gameId = crypto.randomBytes(64).toString("hex"); // game id generation
            const newGame = new NeededGamePlayerClass.gameClass(gameType, gameId, maxUserCount);
            this.gamesMap.set(gameId, newGame);
            // create player for creator
            const creatorPlayer = new NeededGamePlayerClass.playerClass(creator.getUserId(), currentMove);
            this.userPlayersMap.set(creatorId, creatorPlayer);
            newGame.addPlayer(creatorPlayer);
            return { gameStatus: newGame.getGameStatus(), playerStatus: creatorPlayer.getPlayerStatus() }; //stub;
        });
    }
    joinUserToGame(userId, gameType) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.globalUserService.getUserById(userId); // throw user not exist error
            const NeededGamePlayerClass = gameTypeToClass.get(gameType);
            if (!NeededGamePlayerClass)
                throw new invalid_game_type_error_1.InvalidGameTypeError("GameType does not exist or it does not has a according game type.");
            // create player
            const newPlayer = new NeededGamePlayerClass.playerClass(user.getUserId());
            this.userPlayersMap.set(userId, newPlayer);
            const joinResult = yield this.tryJoinPlayerToExistingGame(newPlayer, gameType);
            if (joinResult && joinResult.successfullyJoined) {
                return (0, data_manipulation_1.deepCopy)(joinResult.gamePlayerStatus);
            }
            else {
                return this.createGameForPlayer(newPlayer, NeededGamePlayerClass.gameClass, gameType);
            }
        });
    }
    createGameForPlayer(creatorPlayer, gameClass, gameType, currentMove = true, maxUserCount) {
        // create a game of gameType
        const gameId = crypto.randomBytes(64).toString("hex"); // game id generation
        const newGame = new gameClass(gameType, gameId, maxUserCount);
        this.gamesMap.set(gameId, newGame);
        newGame.addPlayer(creatorPlayer);
        return { gameStatus: newGame.getGameStatus(), playerStatus: creatorPlayer.getPlayerStatus() };
    }
    // async due to database implementation in later
    tryJoinPlayerToExistingGame(player, gameType) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [gameId, game] of this.gamesMap.entries()) {
                // console.log(`In Join: ${gameId} -- ${game}`);
                if (game.getGameType() === gameType && game.getGameState() === game_1.GameState.WaitForPlayersToJoin) {
                    try {
                        game.addPlayer(player);
                        return { successfullyJoined: true, gamePlayerStatus: { gameStatus: game.getGameStatus(), playerStatus: player.getPlayerStatus() } };
                    }
                    catch (e) {
                        // if (e instanceof MaximumOlayerExceededError) {
                        //     return null;
                        // }
                        // return null;
                        // console.log("error cauther in join");
                    }
                }
                else {
                    // console.log(`Join u: ${gameId} -- Type: ${gameType}, game state: ${game.getGameState() === GameState.WaitForPlayersToJoin}`);
                }
            }
            // console.log("Join Failed!!!!");
            return null;
        });
    }
    getGameById(gameId) {
        const game = this.gamesMap.get(gameId);
        if (game) {
            return game;
        }
        throw new game_does_not_exist_error_1.GameDoesNotExistError(`Game with gameId ${gameId} does not exist`);
    }
    getAllUserIdsInGame(gameId) {
        const game = this.gamesMap.get(gameId);
        if (!game)
            throw new game_does_not_exist_error_1.GameDoesNotExistError(`Game with gameId ${gameId} does not exist`);
        return game.getPlayerUserIds();
    }
    updateGame(gameId, move) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    getAllGames() {
        return new Map(this.gamesMap);
    }
};
GameService.instance = null;
GameService = GameService_1 = __decorate([
    (0, static_implements_1.staticImplements)()
], GameService);
exports.GameService = GameService;
