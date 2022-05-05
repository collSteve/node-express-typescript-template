import { GameModel } from "../game";
import { GameStatus } from "../game-status";
import { GameMove } from "../game_users_info_model";
import { PlayerModel } from "../player";
import { PlayerStatus } from "../player-status";

export class TicTacToeModel extends GameModel<TicTacToeGameInfoType, TicTacToePlayerGameInfoType>{
    public getGameStatus(): GameStatus<TicTacToeGameInfoType> {
        throw new Error("Method not implemented.");
    }
    public getPlayersStatus(): PlayerStatus<TicTacToePlayerGameInfoType>[] {
        throw new Error("Method not implemented.");
    }
    public isMoveValid(move: GameMove): boolean {
        throw new Error("Method not implemented.");
    }
    public updateGame(move: GameMove): void {
        throw new Error("Method not implemented.");
    }
    public isGameEnded(): boolean {
        throw new Error("Method not implemented.");
    }
}



export type TicTacToePlayerGameInfoType = {x:number, y:number}[];

export type TicTacToeGameInfoType = {x:number, y:number, checked:boolean, checkedByPlayerId:string|null}[][]; // 3x3 board

export class TicTacToePlayerModel extends PlayerModel<TicTacToePlayerGameInfoType>{
    public getPlayerStatus(): PlayerStatus<TicTacToePlayerGameInfoType> {
        throw new Error("Method not implemented.");
    }
}