import { GameModel } from "../game";
import { GameMove } from "../game_users_info_model";

export class TicTacToeModel extends GameModel{
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