export type GameStatus<GameInfoType> = {
    gameId: string,
    playerUserIds: string[],
    gameInfo:GameInfoType & {currentPlayersTurn:string[]}
};