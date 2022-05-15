import { GameModel, GameState } from '../models/game';
import {
	TicTacToeModel,
	TicTacToePlayerGameInfoType,
	TicTacToePlayerModel,
} from '../models/game-models/TicTacToe';
import { GameMove, GameType } from '../models/game_users_info_model';
import { PlayerModel } from '../models/player';
import User from '../models/user';
import * as crypto from 'crypto';
import UserService from './user-service';
import { InvalidGameTypeError } from '../errors/invalid-game-type-error';
import { GameDoesNotExistError } from '../errors/game-does-not-exist-error';
import { MaximumOlayerExceededError } from '../errors/maximum-player-exceeded-error';
import { GameStatus } from '../models/game-status';
import { PlayerStatus } from '../models/player-status';
import { deepCopy } from '../utils/data-manipulation';
import { staticImplements } from '../utils/static-implements';
import MoveInvalidError from '../errors/move-invalid-error';
// import { ISingletonStatic } from "../utils/singleton";

type GameClass<GameInfoType, PlayerGameInfoType> = {
	new (gameType: GameType, gameId: string, maxUserCount?: number): GameModel<
		GameInfoType,
		PlayerGameInfoType
	>;
};
type PlayerModelClass<PlayerGameInfoType> = {
	new (
		userId: string,
		currentMove?: boolean,
		gameId?: string | null
	): PlayerModel<PlayerGameInfoType>;
};

type GamePlayerPair<GameInfoType, PlayerGameInfoType> = {
	gameClass: GameClass<GameInfoType, PlayerGameInfoType>;
	playerClass: PlayerModelClass<PlayerGameInfoType>;
};

const gameTypeToClass: Map<GameType, GamePlayerPair<any, any>> = new Map<
	GameType,
	GamePlayerPair<any, any>
>();

gameTypeToClass.set(GameType.TicTacToe, {
	gameClass: TicTacToeModel,
	playerClass: TicTacToePlayerModel,
});

export interface IGameServiceDynamic {
	createGameForUser(
		creatorId: string,
		gameType: GameType,
		currentMove: boolean,
		maxUserCount?: number
	): Promise<{
		gameStatus: GameStatus<any>;
		playerStatus: PlayerStatus<any>;
	}>;
	joinUserToGame(
		userId: string,
		gameType: GameType
	): Promise<{
		gameStatus: GameStatus<any>;
		playerStatus: PlayerStatus<any>;
	}>;
	getAllUserIdsInGame(gameId: string): string[];
	updateGame(
		gameId: string,
		move: GameMove
	): Promise<{
		gameStatus: GameStatus<any>;
		playersStatus: PlayerStatus<any>[];
		isGameEnded: boolean;
	}>;
}

export interface IGameServiceStatic<T> {
	getInstance(): T;
}

export type IGameService = IGameServiceDynamic & IGameServiceStatic<any>;

@staticImplements<IGameServiceStatic<GameService>>()
export class GameService implements IGameServiceDynamic {
	private gamesMap: Map<string, GameModel<any, any>>;
	private userPlayersMap: Map<string, PlayerModel<any>>; // all players created for a user

	private static instance: GameService | null = null;

	private globalUserService: UserService;

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameService();
		}
		return this.instance;
	}

	private constructor() {
		this.gamesMap = new Map<string, GameModel<any, any>>();
		this.userPlayersMap = new Map<string, PlayerModel<any>>();
		this.globalUserService = UserService.getInstance(); // DI later
	}

	public async createGameForUser(
		creatorId: string,
		gameType: GameType,
		currentMove = true,
		maxUserCount?: number
	) {
		const creator = this.globalUserService.getUserById(creatorId); // throw user not exist error

		const NeededGamePlayerClass = gameTypeToClass.get(gameType);
		if (!NeededGamePlayerClass)
			throw new InvalidGameTypeError(
				'GameType does not exist or it does not has a according game type.'
			);

		// create a game of gameType
		const gameId = crypto.randomBytes(64).toString('hex'); // game id generation
		const newGame = new NeededGamePlayerClass.gameClass(
			gameType,
			gameId,
			maxUserCount
		);
		this.gamesMap.set(gameId, newGame);

		// create player for creator
		const creatorPlayer = new NeededGamePlayerClass.playerClass(
			creator.getUserId(),
			currentMove
		);
		this.userPlayersMap.set(creatorId, creatorPlayer);

		newGame.addPlayer(creatorPlayer);

		return {
			gameStatus: newGame.getGameStatus(),
			playerStatus: creatorPlayer.getPlayerStatus(),
		}; //stub;
	}

	public async joinUserToGame(
		userId: string,
		gameType: GameType
	): Promise<{
		gameStatus: GameStatus<any>;
		playerStatus: PlayerStatus<any>;
	}> {
		const user = this.globalUserService.getUserById(userId); // throw user not exist error

		const NeededGamePlayerClass = gameTypeToClass.get(gameType);
		if (!NeededGamePlayerClass)
			throw new InvalidGameTypeError(
				'GameType does not exist or it does not has a according game type.'
			);

		// create player
		const newPlayer = new NeededGamePlayerClass.playerClass(
			user.getUserId()
		);
		this.userPlayersMap.set(userId, newPlayer);

		const joinResult = await this.tryJoinPlayerToExistingGame(
			newPlayer,
			gameType
		);

		if (joinResult && joinResult.successfullyJoined) {
			return deepCopy(joinResult.gamePlayerStatus);
		} else {
			return this.createGameForPlayer(
				newPlayer,
				NeededGamePlayerClass.gameClass,
				gameType
			);
		}
	}

	private createGameForPlayer<GameInfoType, PlayerGameInfoType>(
		creatorPlayer: PlayerModel<PlayerGameInfoType>,
		gameClass: GameClass<GameInfoType, PlayerGameInfoType>,
		gameType: GameType,
		currentMove = true,
		maxUserCount?: number
	) {
		// create a game of gameType
		const gameId = crypto.randomBytes(64).toString('hex'); // game id generation
		const newGame = new gameClass(gameType, gameId, maxUserCount);
		this.gamesMap.set(gameId, newGame);

		newGame.addPlayer(creatorPlayer);

		return {
			gameStatus: newGame.getGameStatus(),
			playerStatus: creatorPlayer.getPlayerStatus(),
		};
	}

	// async due to database implementation in later
	private async tryJoinPlayerToExistingGame<PlayerGameInfoType>(
		player: PlayerModel<PlayerGameInfoType>,
		gameType: GameType
	): Promise<{
		successfullyJoined: boolean;
		gamePlayerStatus: {
			gameStatus: GameStatus<any>;
			playerStatus: PlayerStatus<any>;
		};
	} | null> {
		for (const [gameId, game] of this.gamesMap.entries()) {
			// console.log(`In Join: ${gameId} -- ${game}`);
			if (
				game.getGameType() === gameType &&
				game.getGameState() === GameState.WaitForPlayersToJoin
			) {
				try {
					game.addPlayer(player);
					return {
						successfullyJoined: true,
						gamePlayerStatus: {
							gameStatus: game.getGameStatus(),
							playerStatus: player.getPlayerStatus(),
						},
					};
				} catch (e: unknown) {
					// if (e instanceof MaximumOlayerExceededError) {
					//     return null;
					// }
					// return null;
					// console.log("error cauther in join");
				}
			} else {
				// console.log(`Join u: ${gameId} -- Type: ${gameType}, game state: ${game.getGameState() === GameState.WaitForPlayersToJoin}`);
			}
		}
		// console.log("Join Failed!!!!");
		return null;
	}

	public getGameById(gameId: string): GameModel<any, any> {
		const game = this.gamesMap.get(gameId);
		if (game) {
			return game;
		}

		throw new GameDoesNotExistError(
			`Game with gameId ${gameId} does not exist`
		);
	}

	public getAllUserIdsInGame(gameId: string): string[] {
		const game: GameModel<any, any> | undefined = this.gamesMap.get(gameId);

		if (!game)
			throw new GameDoesNotExistError(
				`Game with gameId ${gameId} does not exist`
			);

		return game.getPlayerUserIds();
	}

	public removeUserFromGames(userId: string): void {
		// TODO
	}

	public async updateGame(
		gameId: string,
		move: GameMove
	): Promise<{
		gameStatus: GameStatus<any>;
		playersStatus: PlayerStatus<any>[];
		isGameEnded: boolean;
	}> {
		const GAME_DOES_NOT_EXIST_ERROR_MSG = `Game with ${gameId} does not exist`;
		const MOVE_INVALID_ERROR_MSG = `Game move ${move} is invalid`;

		// retrieve game model:
		const game = this.gamesMap.get(gameId);
		if (!game) {
			return Promise.reject(
				new GameDoesNotExistError(GAME_DOES_NOT_EXIST_ERROR_MSG)
			);
		}

		// check if move valid, if not then return rejected promise:
		if (!game.isMoveValid(move)) {
			return Promise.reject(new MoveInvalidError(MOVE_INVALID_ERROR_MSG));
		}

		// update game state
		game.updateGame(move);

		// if game is ended/over proceed with game end process
		if (game.getGameState() === GameState.Ended) {
			const playerStatuses: PlayerStatus<any>[] =
				this.gameEndProcess(game);
			return Promise.resolve({
				gameStatus: game.getGameStatus(),
				playersStatus: playerStatuses,
				isGameEnded: true,
			});
		}

		// otherwise proceed with regular game status return
		return Promise.resolve({
			gameStatus: game.getGameStatus(),
			playersStatus: game.getPlayersStatus(),
			isGameEnded: false,
		});
	}

	private gameEndProcess(game: GameModel<any, any>): PlayerStatus<any>[] {
		// deep copy player status values to return before deleting players
		const deepCopyPlayerStatuses: PlayerStatus<any>[] = deepCopy(
			game.getPlayersStatus()
		);

		// delete players associated with game and remove user's association to game
		const gamePlayers: string[] = game.getPlayerUserIds();
		gamePlayers.forEach((playerId) => {
			// the below should not be undefined unless there is bug in game service
			const playerUserId: string | undefined = this.userPlayersMap
				.get(playerId)
				?.getUserId();

			// remove user association to this game
			if (playerUserId) {
				this.globalUserService.removeGameAssociation(
					game.getGameId(),
					playerUserId
				);
			}

			// delete the player
			this.userPlayersMap.delete(playerId);
		});

		return deepCopyPlayerStatuses;
	}

	public getAllGames() {
		return new Map(this.gamesMap);
	}
}
