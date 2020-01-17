import { Position, Character } from './KQStream';
import {
  GameMap,
  Possession
} from '../models/Game';
import { Game } from '../Game';
import {
  GateCanNotBecomeNeutralError,
  SamePossessionError,
  GateOccupiedError,
  PossessionMismatchError,
  GateNotOccupiedError,
  CharacterMismatchError
} from './errors/gameState/GateError';

type GateSet = {
  [map in GameMap]: () => Gate[]
};

export enum GateType {
  Speed = 'SPEED',
  Warrior = 'WARRIOR',
}

type GateOptions = {
  type: GateType,
  position: Position,
};

export class Gate {
  static readonly set: GateSet = {
    [GameMap.Day]: () => {
      return [
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 560,
            y: 260
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 960,
            y: 500
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 1360,
            y: 260
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 410,
            y: 860
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 1510,
            y: 860
          }
        })
      ];
    },
    [GameMap.Night]: () => {
      return [
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 700,
            y: 260
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 960,
            y: 700
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 1220,
            y: 260
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 170,
            y: 740
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 1750,
            y: 740
          }
        })
      ];
    },
    [GameMap.Dusk]: () => {
      return [
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 310,
            y: 620
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 960,
            y: 140
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 1610,
            y: 620
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 340,
            y: 140
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 1580,
            y: 140
          }
        })
      ];
    },
    [GameMap.BonusWarrior]: () => {
      return [
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 400,
            y: 20
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 960,
            y: 580
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 1520,
            y: 20
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 960,
            y: 20
          }
        })
      ];
    },
    [GameMap.BonusSnail]: () => {
      return [
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 400,
            y: 860
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 1520,
            y: 860
          }
        }),
        new Gate({
          type: GateType.Warrior,
          position: {
            x: 960,
            y: 20
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 290,
            y: 620
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 1630,
            y: 620
          }
        }),
        new Gate({
          type: GateType.Speed,
          position: {
            x: 960,
            y: 260
          }
        })
      ];
    }
  };

  private _type: GateType;
  get type(): GateType {
    return this._type;
  }
  private _position: Position;
  get position(): Position {
    return this._position;
  }
  private _possession: Possession;
  get possession(): Possession {
    return this._possession;
  }
  private _character?: Character;
  get character(): Character | undefined {
    return this._character;
  }

  constructor(options: GateOptions) {
    this._type = options.type;
    this._position = options.position;
    this._possession = Possession.None;
  }

  setPossession(possession: Possession) {
    if (possession === Possession.None) {
      throw new GateCanNotBecomeNeutralError();
    } else if (this._possession === possession) {
      throw new SamePossessionError();
    }
    this._possession = possession;
  }

  enter(character: Character) {
    if (this._character !== undefined) {
      throw new GateOccupiedError();
    } else if (this._possession !== Possession.None) {
      const team = Game.characterTeam[character];
      const possession = Game.teamPossession[team];
      if (this._possession !== possession) {
        throw new PossessionMismatchError();
      }
    }
    this._character = character;
  }

  exit(character: Character) {
    if (this._character === undefined) {
      throw new GateNotOccupiedError();
    } else if (this._character !== character) {
      throw new CharacterMismatchError();
    }
    this._character = undefined;
  }

  use(character: Character) {
    if (this._character === undefined) {
      throw new GateNotOccupiedError();
    } else if (this._character !== character) {
      throw new CharacterMismatchError();
    }
    this._character = undefined;
  }
}
