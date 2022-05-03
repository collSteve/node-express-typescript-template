export interface GameUserInfo {
    userId: string,
    currentMove: boolean,
    gameId: string
}

export enum GameType {
    One_on_one,
    Two_groups_combat,
    Multi_singles,
    Multi_groups
}
