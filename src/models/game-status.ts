export type GameStatus<GameInfoType> = {
  gameId: string;
  playerUserIds: string[];
  gameInfo: GameInfoType & { currentPlayersTurn: string[] };
};

/**
 * gameInfo: {
 *      GameInfoType,
 *      currentPlayersTurn: ["peter", "samantha"]
 * }
 */
