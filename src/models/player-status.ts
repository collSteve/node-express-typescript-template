export type PlayerStatus<PlayerGameInfoType> = {
    userId:string,
    isCurrentMove:boolean,
    playerGameInfo:PlayerGameInfoType
};