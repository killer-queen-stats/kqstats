import { expect } from 'chai';
import { Game, equal } from '../src/lib/Game';
import { Character, Position } from '../src/lib/models/KQStream';
import { Player } from '../src/lib/models/Player';
import { GameType, GameMap, GameOrientation, Team, WinType, Possession } from '../src/lib/models/Game';
import {
  MetadataValueMustBeFinalError,
  DurationMustBeGreaterThanZeroError
} from '../src/lib/models/errors/gameState/MetadataError';
import { Gate } from '../src/lib/models/Gate';
import { Snail } from '../src/lib/models/Snail';
import { Hive } from '../src/lib/models/Hive';
import { GateNotFoundError } from '../src/lib/models/errors/gameState/GameError';
import { SamePossessionError } from '../src/lib/models/errors/gameState/GateError';

// function getGate(game: Game, position: Position) {
//   let gate: Gate | undefined = undefined;
//   const gates = game.gates;
//   if (gates !== undefined) {
//     gate = gates.find((elem) => {
//       return equal(elem.position, position);
//     });
//   }
//   if (gate === undefined) {
//     throw new GateNotFoundError();
//   }
//   return gate;
// }

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it('should start with no type', () => {
    expect(game.type).to.be.undefined;
  });
  it('should start with no map', () => {
    expect(game.map).to.be.undefined;
  });
  it('should start with no orientation', () => {
    expect(game.orientation).to.be.undefined;
  });
  it('should start with no duration', () => {
    expect(game.duration).to.be.undefined;
  });
  it('should start with no win', () => {
    expect(game.win).to.be.undefined;
  });
  it('should start not being final', () => {
    expect(game.isFinal).to.be.false;
  });
  it('should start with all players defined', () => {
    const keys = Object.keys(game.players);
    expect(keys.length).to.equal(10);
    for (let character of Object.keys(Character)) {
      const characterNumber = Number(character);
      if (!isNaN(characterNumber)) {
        const player = game.players[character] as Player;
        expect(player).to.be.instanceof(Player);
        expect(player.character).to.equal(characterNumber);
      }
    }
  });
  it('should start with no gates', () => {
    expect(game.gates).to.be.undefined;
  });
  it('should start with no snails', () => {
    expect(game.snails).to.be.undefined;
  });
  it('should start with no hives', () => {
    expect(game.hives).to.be.undefined;
  });

  // Metadata
  describe('#setType', () => {
    it('should set the game type', () => {
      game.setType(GameType.Real);
      expect(game.type).to.equal(GameType.Real);
    });
    it('should throw an error if called twice', () => {
      game.setType(GameType.Real);
      expect(() => {
        game.setType(GameType.Real);
      }).to.throw(MetadataValueMustBeFinalError);
    });
  });
  describe('#setMap', () => {
    it('should set the game map', () => {
      game.setMap(GameMap.Day);
      expect(game.map).to.equal(GameMap.Day);
    });
    it('should throw an error if called twice', () => {
      game.setMap(GameMap.Day);
      expect(() => {
        game.setMap(GameMap.Day);
      }).to.throw(MetadataValueMustBeFinalError);
    });
    for (let key of Object.keys(GameMap)) {
      const map = GameMap[key] as GameMap;
      it(`should set gates for ${map} map`, () => {
        game.setMap(map);
        const gates = Gate.set[map]();
        expect(game.gates).to.deep.equal(gates);
      });
      it(`should set snails for ${map} map`, () => {
        game.setMap(map);
        const snails = Snail.set[map]();
        expect(game.snails).to.deep.equal(snails);
      });
      it(`should set hives for ${map} map`, () => {
        game.setMap(map);
        const hives = Hive.set[map]();
        expect(game.hives).to.deep.equal(hives);
      });
    }
  });
  describe('#setOrientation', () => {
    it('should set the game orientation', () => {
      game.setOrientation(GameOrientation.BlueOnLeft);
      expect(game.orientation).to.equal(GameOrientation.BlueOnLeft);
    });
    it('should throw an error if called twice', () => {
      game.setOrientation(GameOrientation.BlueOnLeft);
      expect(() => {
        game.setOrientation(GameOrientation.BlueOnLeft);
      }).to.throw(MetadataValueMustBeFinalError);
    });
  });
  describe('#setDuration', () => {
    it('should set the game duration', () => {
      game.setDuration(123);
      expect(game.duration).to.equal(123);
    });
    it('should throw an error if called twice', () => {
      game.setDuration(123);
      expect(() => {
        game.setDuration(123);
      }).to.throw(MetadataValueMustBeFinalError);
    });
    it('should throw an error if the duration is not greater than zero', () => {
      expect(() => {
        game.setDuration(-1);
      }).to.throw(DurationMustBeGreaterThanZeroError);
    });
  });
  describe('#setWin', () => {
    const win = {
      team: Team.Blue,
      type: WinType.Economic
    };
    it('should set the game win', () => {
      game.setWin(win);
      expect(game.win).to.deep.equal(win);
    });
    it('should throw an error if called twice', () => {
      game.setWin(win);
      expect(() => {
        game.setWin(win);
      }).to.throw(MetadataValueMustBeFinalError);
    });
  });

  // Gates
  describe('#tagGate', () => {
    const gateMap = GameMap.Day;
    const gatePosition = {
      x: 560,
      y: 260
    };
    it('should infer the map from the gate position', () => {
      for (let key of Object.keys(GameMap)) {
        const map = GameMap[key] as GameMap;
        const gates = Gate.set[map]();
        for (let gate of gates) {
          game = new Game();
          game.tagGate(gate.position, Team.Blue);
          expect(game.map).to.equal(map);
        }
      }
    });
    it('should set the possession of the gate', () => {
      game.setMap(gateMap);
      game.tagGate(gatePosition, Team.Blue);
      for (let gate of game.gates as Gate[]) {
        if (equal(gate.position, gatePosition)) {
          expect(gate.possession).to.equal(Possession.Blue);
        } else {
          expect(gate.possession).to.equal(Possession.None);
        }
      }
    });
    it('should throw an error if the possession of the gate is the same', () => {
      game.setMap(gateMap);
      game.tagGate(gatePosition, Team.Blue);
      expect(() => {
        game.tagGate(gatePosition, Team.Blue);
      }).to.throw(SamePossessionError);
    });
  });
  describe('#enterGate', () => {
    const gateMap = GameMap.Day;
    const gatePosition = {
      x: 560,
      y: 260
    };
    it('should infer the map from the gate position', () => {
      for (let key of Object.keys(GameMap)) {
        const map = GameMap[key] as GameMap;
        const gates = Gate.set[map]();
        for (let gate of gates) {
          game = new Game();
          game.enterGate(gate.position, Character.BlueAbs);
          expect(game.map).to.equal(map);
        }
      }
    });
    it('should set the character inside the gate', () => {
      game.setMap(gateMap);
      game.enterGate(gatePosition, Character.BlueAbs);
      for (let gate of game.gates as Gate[]) {
        if (equal(gate.position, gatePosition)) {
          expect(gate.character).to.equal(Character.BlueAbs);
        } else {
          expect(gate.character).to.be.undefined;
        }
      }
    });
    it('should throw an error if the character entering the gate is a warrior');
    it('should throw an error if the character entering the gate is a queen');
    it('should throw an error if the character entering the gate does not have a berry');
  });
});
