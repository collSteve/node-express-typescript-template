import { GameStatus } from './game-status';
import { GameMove, GameType } from './game_users_info_model';
import { PlayerModel } from './player';
import { PlayerStatus } from './player-status';

export enum GameState {
	WaitForPlayersToJoin,
	WaitToStart, // player loaded
	Playing,
	Ended,
}

export abstract class GameModel<GameInfoType, PlayerGameInfoType> {
	public static readonly DEFAULT_MAX_USER_COUNT = 2;
	protected gameType: GameType;
	protected gameId: string;
	protected players: Set<PlayerModel<PlayerGameInfoType>>;
	protected maxUserCount: number;
	protected userCount: number = 0;

	protected gameState: GameState;
	protected currentGameInfo: GameInfoType | null = null;

	constructor(
		gameType: GameType,
		gameId: string,
		maxUserCount: number = GameModel.DEFAULT_MAX_USER_COUNT
	) {
		this.gameType = gameType;
		this.gameId = gameId;
		this.maxUserCount = maxUserCount;

		this.players = new Set<PlayerModel<PlayerGameInfoType>>();

		this.gameState = GameState.WaitForPlayersToJoin;
	}

	public addPlayer(player: PlayerModel<PlayerGameInfoType>) {
		if (this.userCount >= this.maxUserCount) {
			throw new Error(
				'Fail to add new player to game: reached max user count in game.'
			); // fail to add
		}

		if (this.gameState != GameState.WaitForPlayersToJoin) {
			throw new Error(
				'Fail to add new player to game: game is not waiting for players to join'
			);
		}

		this.players.add(player);
		player.setGameId(this.gameId);
		this.userCount++;

		if (this.userCount >= this.maxUserCount) {
			this.gameState = GameState.WaitToStart;
		}
	}

	public getGameId() {
		return this.gameId;
	}

	public getGameState() {
		return this.gameState;
	}

	public getGameType() {
		return this.gameType;
	}

	protected setGameState(gameState: GameState) {
		this.gameState = gameState;
	}

	public getPlayerUserIds(): string[] {
		const ids: string[] = [];
		this.players.forEach((player) => {
			const id: string = player.getUserId();
			ids.push(id);
		});
		return ids;
	}

	public abstract isMoveValid(move: GameMove): boolean;

	public abstract updateGame(move: GameMove): void;

	public abstract isGameEnded(): boolean;

	public abstract getGameStatus(): GameStatus<GameInfoType>;

	public abstract getPlayersStatus(): PlayerStatus<PlayerGameInfoType>[];
}
