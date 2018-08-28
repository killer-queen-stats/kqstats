export interface Position {
  x: number;
  y: number;
}

export enum Character {
  GoldQueen = 1,
  BlueQueen = 2,
  GoldStripes = 3,
  BlueStripes = 4,
  GoldAbs = 5,
  BlueAbs = 6,
  GoldSkulls = 7,
  BlueSkulls = 8,
  GoldChecks = 9,
  BlueChecks = 10,
}

export enum Team {
  Gold = 'GOLD',
  Blue = 'BLUE',
}

export enum Maiden {
  Warrior = 'WARRIOR',
  Speed = 'SPEED',
}

export enum GameMap {
  Day = 'DAY',
  Night = 'NIGHT',
  Dusk = 'DUSK',
}

// Read keys as LeftRight
export enum CabOrientation {
  BlueOnLeft = 'BLUE_ON_LEFT',
  GoldOnLeft = 'GOLD_ON_LEFT',
}

export enum VictoryType {
  Military = 'MILITARY',
  Econimic = 'ECONIMIC',
  Snail = 'SNAIL',
}

export interface PlayerNames {}

export interface PlayerKill {
  pos: Position;
  killed: Character;
  by: Character;
}

export interface BlessMaiden {
  pos: Position;
  team: Team;
}

export interface ReserveMaiden {
  pos: Position;
  character: Character;
}

export interface UnreserveMaiden {
  pos: Position;
  character: Character;
}

export interface UseMaiden {
  pos: Position;
  type: Maiden;
  character: Character;
}

export interface Glance {
  attacker: Character;
  target: Character;
}

export interface CarryFood {
  character: Character;
}

export interface GameStart {
  map: GameMap;
  orientation: CabOrientation;
}

export interface GameEnd {
  map: GameMap;
  orientation: CabOrientation;
  duration: Number;
}

export interface Victory {
  team: Team;
  type: VictoryType;
}

export interface Spawn {
  character: Character;
  isAI: boolean;
}

export interface GetOnSnail {
  pos: Position;
  character: Character;
}

export interface GetOffSnail {
  pos: Position;
  character: Character;
}

export interface SnailEat {
  pos: Position;
  rider: Character;
  eaten: Character;
}

export interface SnailEscape {
  pos: Position;
  character: Character;
}

export interface BerryDeposit {
  pos: Position;
  character: Character;
}

export interface BerryKickIn {
  pos: Position;
  character: Character;
}
