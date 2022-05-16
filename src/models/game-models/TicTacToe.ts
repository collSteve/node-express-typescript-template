import { deepCopy } from '../../utils/data-manipulation';
import { GameModel, GameState } from '../game';
import { GameStatus } from '../game-status';
import { GameMove } from '../game_users_info_model';
import { PlayerModel } from '../player';
import { PlayerStatus } from '../player-status';

export class TicTacToeModel extends GameModel<
	TicTacToeGameInfoType,
	TicTacToePlayerGameInfoType
> {
	public getGameStatus(): GameStatus<TicTacToeGameInfoType> {
		const currentGameInfo = deepCopy(super.currentGameInfo);
		return {
			gameId: this.gameId,
			playerUserIds: this.getPlayerUserIds(),
			gameInfo: currentGameInfo,
		};
	}

	public getPlayersStatus(): PlayerStatus<TicTacToePlayerGameInfoType>[] {
		throw new Error('Method not implemented.');
	}
	public isMoveValid(move: GameMove): boolean {
		throw new Error('Method not implemented.');
	}
	public updateGame(move: GameMove): void {
		// calls isMoveValid in here
		// update

		// if game has ended set game state to ended
		if (this.isGameEnded()) {
			super.setGameState(GameState.Ended);
		}
	}
	public isGameEnded(): boolean {
		throw new Error('Method not implemented.');
	}
}

export type TicTacToePlayerGameInfoType = { x: number; y: number }[];

export type TicTacToeGameInfoType = {
	x: number;
	y: number;
	checked: boolean;
	checkedByPlayerId: string | null;
}[][]; // 3x3 board

export class TicTacToePlayerModel extends PlayerModel<TicTacToePlayerGameInfoType> {
	public getPlayerStatus(): PlayerStatus<TicTacToePlayerGameInfoType> {
		return {
			userId: this.userId,
			isCurrentMove: this.currentMove,
			playerGameInfo: [],
		};
	}
}
