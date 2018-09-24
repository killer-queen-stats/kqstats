export type GameSideType = 'gold' | 'blue' | 'neutral';
export type GameMapType = 'day' | 'night' | 'dusk';

export enum GameType {
    Real = 'REAL',
    Attract = 'ATTRACT',
}

export enum GameMap {
    Day = 'DAY',
    Night = 'NIGHT',
    Dusk = 'DUSK',
    BonusWarrior = 'BONUS_WARRIOR',
    BonusSnail = 'BONUS_SNAIL',
}

export enum GameOrientation {
    BlueOnLeft = 'BLUE_ON_LEFT',
    GoldOnLeft = 'GOLD_ON_LEFT',
}

export enum Team {
    Blue = 'BLUE',
    Gold = 'GOLD',
}

export enum WinType {
    Economic = 'ECONOMIC',
    Military = 'MILITARY',
    Snail = 'SNAIL',
}

export type GameWin = {
    team: Team,
    type: WinType,
};

export type GameEnd = {
    winTeam: Team,
    winType: WinType,
    duration: number
};

export enum Possession {
    Gold = 'GOLD',
    Blue = 'BLUE',
    None = 'NONE'
}
