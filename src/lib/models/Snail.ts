import { Position, Character } from './KQStream';
import { GameMap, Possession } from '../models/Game';
import {
  SnailDoesNotHaveRiderError,
  SnailHasRiderError,
  SnailIsNotEatingError,
  SnailIsEatingError
} from './errors/gameState/SnailError';

type SnailSet = {
  [map in GameMap]: () => Snail[]
};

type SnailOptions = {
  position: Position
};

export class Snail {
  static readonly set: SnailSet = {
    [GameMap.Day]: () => {
      return [
        new Snail({
          position: {
            x: 960,
            y: 11
          }
        })
      ];
    },
    [GameMap.Night]: () => {
      return [
        new Snail({
          position: {
            x: 960,
            y: 491
          }
        })
      ];
    },
    [GameMap.Dusk]: () => {
      return [
        new Snail({
          position: {
            x: 960,
            y: 11
          }
        })
      ];
    },
    [GameMap.BonusWarrior]: () => {
      return [];
    },
    [GameMap.BonusSnail]: () => {
      return [
        new Snail({
          position: {
            x: 520,
            y: 371
          }
        }),
        new Snail({
          position: {
            x: 1400,
            y: 371
          }
        }),
        new Snail({
          position: {
            x: 960,
            y: 731
          }
        })
      ];
    }
  };

  private static readonly characterPossession = {
    [Character.GoldQueen]: Possession.Gold,
    [Character.BlueQueen]: Possession.Blue,
    [Character.GoldStripes]: Possession.Gold,
    [Character.BlueStripes]: Possession.Blue,
    [Character.GoldAbs]: Possession.Gold,
    [Character.BlueAbs]: Possession.Blue,
    [Character.GoldSkulls]: Possession.Gold,
    [Character.BlueSkulls]: Possession.Blue,
    [Character.GoldChecks]: Possession.Gold,
    [Character.BlueChecks]: Possession.Blue
  };

  private _position: Position;
  get position(): Position {
    return this._position;
  }
  private _rider: Character | undefined;
  get rider(): Character | undefined {
    return this._rider;
  }
  get possession(): Possession {
    if (this._rider === undefined) {
      return Possession.None;
    }
    return Snail.characterPossession[this._rider];
  }
  private _eatingCharacter?: Character;
  get eatingCharacter(): Character | undefined {
    return this._eatingCharacter;
  }

  constructor(options: SnailOptions) {
    this._position = options.position;
    this._rider = undefined;
    this._eatingCharacter = undefined;
  }

  setPosition(position: Position) {
    this.checkForRider(true);
    // TODO: Make sure snail moves in right direction
    // (Accept orientation at construction time and perform check here)
    this._position = position;
  }
  setRider(rider: Character) {
    this.checkForRider(false);
    this._rider = rider;
  }
  clearRider() {
    this.checkForRider(true);
    this._rider = undefined;
  }
  startEating(character: Character) {
    this.checkForRider(true);
    this.checkForEatingDrone(false);
    this._eatingCharacter = character;
  }
  endEating() {
    this.checkForEatingDrone(true);
    this._eatingCharacter = undefined;
  }

  private checkForRider(mustExist: boolean) {
    if (mustExist && this.rider === undefined) {
      throw new SnailDoesNotHaveRiderError();
    } else if (!mustExist && this.rider !== undefined) {
      throw new SnailHasRiderError();
    }
  }
  private checkForEatingDrone(mustExist: boolean) {
    if (mustExist && this.eatingCharacter === undefined) {
      throw new SnailIsNotEatingError();
    } else if (!mustExist && this.eatingCharacter !== undefined) {
      throw new SnailIsEatingError();
    }
  }
}
