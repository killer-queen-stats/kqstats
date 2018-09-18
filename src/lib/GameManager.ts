import { KQStream } from './KQStream';
import { ProtectedEventEmitter } from 'eventemitter-ts';
import {
  Game,
  GameOrientation,
  GameType,
  Team,
  WinType,
  GameMap
} from './models/Game';
import {
  GameStart,
  CabOrientation,
  GameEnd,
  Victory,
  Team as TeamEnum,
  VictoryType,
  BlessMaiden,
  Position,
  ReserveMaiden,
  UnreserveMaiden,
  UseMaiden,
  CarryFood,
  BerryDeposit,
  BerryKickIn,
  GetOnSnail,
  GetOffSnail,
  SnailEat,
  PlayerKill,
  Spawn
} from './models/KQStream';

type Events = {
  'game': Game,
};

/**
 * Emits and updates game models according to events from a
 * `KQStream` class.
 * 
 * Intended for use with v2 events.
 */
export class GameManager extends ProtectedEventEmitter<Events> {
  // Metadata
  private static orientationMap = {
    [CabOrientation.BlueOnLeft]: GameOrientation.BlueOnLeft,
    [CabOrientation.GoldOnLeft]: GameOrientation.GoldOnLeft,
  };
  private static teamMap = {
    [TeamEnum.Blue]: Team.Blue,
    [TeamEnum.Gold]: Team.Gold,
  };
  private static winTypeMap = {
    [VictoryType.Econimic]: WinType.Economic,
    [VictoryType.Military]: WinType.Military,
    [VictoryType.Snail]: WinType.Snail,
  };

  private stream: KQStream;

  /**
   * Uses the position of a maiden event to infer the game map.
   * 
   * @param position The position of the maiden event
   * @returns The only map that has a gate at the given position,
   *          or `null` if multiple maps have a gate at that position.
   */
  private static inferMapFromGatePos(position: Position): GameMap | undefined {
    // TODO: Implement and use in KQStream listeners
  }

  constructor(stream: KQStream) {
    super();

    this.stream = stream;

    this.stream.on('playernames', () => {
      const game = new Game();

      // Metadata
      this.stream.on('gamestart', (gameStart: GameStart) => {
        game.setOrientation(GameManager.orientationMap[gameStart.orientation]);
      });
      this.stream.on('gameend', (gameEnd: GameEnd) => {
        game.setDuration(gameEnd.duration);
        game.setType(GameType.Real);
      });
      this.stream.on('victory', (victory: Victory) => {
        game.setWin({
          team: GameManager.teamMap[victory.team],
          type: GameManager.winTypeMap[victory.type],
        });
      });

      // Gate
      this.stream.on('blessMaiden', (blessMaiden: BlessMaiden) => {
        const position = blessMaiden.pos;
        const team = GameManager.teamMap[blessMaiden.team];
        game.tagGate(position, team);
      });
      this.stream.on('reserveMaiden', (reserveMaiden: ReserveMaiden) => {
        const position = reserveMaiden.pos;
        const character = reserveMaiden.character;
        game.enterGate(position, character);
      });
      this.stream.on('unreserveMaiden', (unreserveMaiden: UnreserveMaiden) => {
        const position = unreserveMaiden.pos;
        const character = unreserveMaiden.character;
        game.exitGate(position, character);
      });
      this.stream.on('useMaiden', (useMaiden: UseMaiden) => {
        const position = useMaiden.pos;
        const character = useMaiden.character;
        game.useGate(position, character);
      });

      // Berry
      this.stream.on('berryDeposit', (berryDeposit: BerryDeposit) => {
        const position = berryDeposit.pos;
        const character = berryDeposit.character;
        game.depositBerry(position, character);
      });
      this.stream.on('berryKickIn', (berryKickIn: BerryKickIn) => {
        const position = berryKickIn.pos;
        const character = berryKickIn.character;
        game.kickInBerry(position, character);
      });

      // Snail
      this.stream.on('getOnSnail', (getOnSnail: GetOnSnail) => {
        const position = getOnSnail.pos;
        const character = getOnSnail.character;
        game.getOnSnail(position, character);
      });
      this.stream.on('getOffSnail', (getOffSnail: GetOffSnail) => {
        const character = getOffSnail.character;
        const position = getOffSnail.pos;
        game.updateSnailPosition(character, position);
        game.getOffSnail(character);
      });
      this.stream.on('snailEat', (snailEat: SnailEat) => {
        const rider = snailEat.rider;
        const eaten = snailEat.eaten;
        game.startEating(rider, eaten);
      });

      // Player
      this.stream.on('spawn', (spawn: Spawn) => {
        const character = spawn.character;
        const isAI = spawn.isAI;
        if (!isAI) {
          game.becomeHuman(character);
        }
      });
      this.stream.on('carryFood', (carryFood: CarryFood) => {
        const character = carryFood.character;
        game.holdBerry(character);
      });
      this.stream.on('playerKill', (playerKill: PlayerKill) => {
        const victim = playerKill.killed;
        const killer = playerKill.by;
        game.kill(victim, killer);
      });

      this.protectedEmit('game', game);
    });
  }
}
