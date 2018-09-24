import { KQStream } from './KQStream';
import { ProtectedEventEmitter } from 'eventemitter-ts';
import {
  GameOrientation,
  GameType,
  Team,
  WinType
} from './models/Game';
import { Game } from './Game';
import {
  GameStart,
  CabOrientation,
  GameEnd,
  Victory,
  Team as TeamEnum,
  VictoryType,
  BlessMaiden,
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
  private game: Game;

  constructor(stream: KQStream) {
    super();

    this.stream = stream;

    this.stream.on('playernames', () => {
      // TODO: Right here, remove all listeners except playernames
      // so previous game object is no longer updated
      // (You tried to use this.game so only the current game object
      // gets updated, but because of closures it actually passes
      // that object into the callbacks, so it always holds onto
      // a single reference.)
      this.game = new Game();

      // Metadata
      this.stream.on('gamestart', (gameStart: GameStart) => {
        this.game.setOrientation(GameManager.orientationMap[gameStart.orientation]);
      });
      this.stream.on('gameend', (gameEnd: GameEnd) => {
        this.game.setDuration(gameEnd.duration);
        this.game.setType(GameType.Real);
      });
      this.stream.on('victory', (victory: Victory) => {
        this.game.setWin({
          team: GameManager.teamMap[victory.team],
          type: GameManager.winTypeMap[victory.type],
        });
      });

      // Gate
      this.stream.on('blessMaiden', (blessMaiden: BlessMaiden) => {
        const position = blessMaiden.pos;
        const team = GameManager.teamMap[blessMaiden.team];
        this.game.tagGate(position, team);
      });
      this.stream.on('reserveMaiden', (reserveMaiden: ReserveMaiden) => {
        const position = reserveMaiden.pos;
        const character = reserveMaiden.character;
        this.game.enterGate(position, character);
      });
      this.stream.on('unreserveMaiden', (unreserveMaiden: UnreserveMaiden) => {
        const position = unreserveMaiden.pos;
        const character = unreserveMaiden.character;
        this.game.exitGate(position, character);
      });
      this.stream.on('useMaiden', (useMaiden: UseMaiden) => {
        const position = useMaiden.pos;
        const character = useMaiden.character;
        this.game.useGate(position, character);
      });

      // Berry
      this.stream.on('berryDeposit', (berryDeposit: BerryDeposit) => {
        const position = berryDeposit.pos;
        const character = berryDeposit.character;
        this.game.depositBerry(position, character);
      });
      this.stream.on('berryKickIn', (berryKickIn: BerryKickIn) => {
        const position = berryKickIn.pos;
        const character = berryKickIn.character;
        this.game.kickInBerry(position, character);
      });

      // Snail
      this.stream.on('getOnSnail', (getOnSnail: GetOnSnail) => {
        const position = getOnSnail.pos;
        const character = getOnSnail.character;
        this.game.getOnSnail(position, character);
      });
      this.stream.on('getOffSnail', (getOffSnail: GetOffSnail) => {
        const character = getOffSnail.character;
        const position = getOffSnail.pos;
        this.game.updateSnailPosition(character, position);
        this.game.getOffSnail(character);
      });
      this.stream.on('snailEat', (snailEat: SnailEat) => {
        const rider = snailEat.rider;
        const eaten = snailEat.eaten;
        this.game.startEating(rider, eaten);
      });

      // Player
      this.stream.on('spawn', (spawn: Spawn) => {
        const character = spawn.character;
        const isAI = spawn.isAI;
        if (!isAI) {
          this.game.becomeHuman(character);
        }
      });
      this.stream.on('carryFood', (carryFood: CarryFood) => {
        const character = carryFood.character;
        this.game.holdBerry(character);
      });
      this.stream.on('playerKill', (playerKill: PlayerKill) => {
        const victim = playerKill.killed;
        const killer = playerKill.by;
        this.game.kill(victim, killer);
      });

      this.protectedEmit('game', this.game);
    });
  }
}
