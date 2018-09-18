import { ProtectedEventEmitter } from 'eventemitter-ts';
import { Character, Position } from './KQStream';
import { Player } from './Player';
import { Gate, GateType } from './Gate';
import { Hive } from './Hive';
import { Snail } from './Snail';

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

type Characters = {
    [character in Character]: Player
};

type Hives = {
    [team in Team]: Hive
};

// TODO: Put this in a better place
function equal(a: Position, b: Position) {
    return a.x === b.x && a.y === b.y;
}

/**
 * A state machine that represents game state and validates
 * changes between states.
 * 
 * `Game` class takes a strict approach to state changes and
 * restricts what is considered valid state. For example,
 * a warrior or a drone holding a berry cannot be on the snail.
 * If an invalid state is reached, the state changing method
 * will throw an error.
 * 
 * If `Game` enters an invalid state, it indicates that either
 * the developer using the class made a mistake, or the valid
 * states of Killer Queen have changed (e.g. due to game rules
 * and mechanics changing) and the `Game` class must be updated
 * to reflect these changes.
 * 
 * A `Game` holds 5 groups of state information:
 * 
 * - Metadata
 *   - Map
 *   - Cab orientation
 *   - Game duratio
 *   - Win condition
 *   - Ongoing or final
 * - Players
 *   - Is warrior
 *   - Is speed
 *   - On snail
 *   - Has berry
 *   - Kills
 *   - Deaths
 * - Gates
 *   - Type (speed, warrior)
 *   - Possession (gold, blue)
 * - Hives
 *   - Total number of berry holes
 *   - Number of berries deposited
 *   - Number of berries kicked in
 * - Snails
 *   - Position
 *   - Possession
 */
export class Game extends ProtectedEventEmitter<Events> {
    static readonly characterTeam = {
      [Character.GoldQueen]: Team.Gold,
      [Character.BlueQueen]: Team.Blue,
      [Character.GoldStripes]: Team.Gold,
      [Character.BlueStripes]: Team.Blue,
      [Character.GoldAbs]: Team.Gold,
      [Character.BlueAbs]: Team.Blue,
      [Character.GoldSkulls]: Team.Gold,
      [Character.BlueSkulls]: Team.Blue,
      [Character.GoldChecks]: Team.Gold,
      [Character.BlueChecks]: Team.Blue
    };
    static readonly teamPossession = {
        [Team.Gold]: Possession.Gold,
        [Team.Blue]: Possession.Blue
    };

    // Metadata
    private _type?: GameType;
    get type(): GameType | undefined {
        return this._type;
    }
    private _map?: GameMap;
    get map(): GameMap | undefined {
        return this._map;
    }
    private _orientation?: GameOrientation;
    get orientation(): GameOrientation | undefined {
        return this._orientation;
    }
    private _duration?: Number;
    get duration(): Number | undefined {
        return this._duration;
    }
    private _win?: GameWin;
    get win(): GameWin | undefined {
        return this._win;
    }
    get isFinal(): boolean {
        return this.win !== undefined;
    }

    // Game Elements
    private _players: Characters;
    get players(): Characters {
        return this._players;
    }
    private _gates: Gate[];
    get gates(): Gate[] {
        return this._gates;
    }
    private _hives: Hive[];
    get hives(): Hive[] {
        return this._hives;
    }
    private _snails: Snail[];
    get snails(): Snail[] {
        return this._snails;
    }

    constructor() {
        super();

        this._type = undefined;
        this._map = undefined;
        this._orientation = undefined;
        this._win = undefined;

        this._players = {
            [Character.GoldQueen]: new Player({
                character: Character.GoldQueen
            }),
            [Character.BlueQueen]: new Player({
                character: Character.BlueQueen
            }),
            [Character.GoldStripes]: new Player({
                character: Character.GoldStripes
            }),
            [Character.BlueStripes]: new Player({
                character: Character.BlueStripes
            }),
            [Character.GoldAbs]: new Player({
                character: Character.GoldAbs
            }),
            [Character.BlueAbs]: new Player({
                character: Character.BlueAbs
            }),
            [Character.GoldSkulls]: new Player({
                character: Character.GoldSkulls
            }),
            [Character.BlueSkulls]: new Player({
                character: Character.BlueSkulls
            }),
            [Character.GoldChecks]: new Player({
                character: Character.GoldChecks
            }),
            [Character.BlueChecks]: new Player({
                character: Character.BlueChecks
            }),
        };
        this._gates = [];
        this._hives = [];
        this._snails = [];
    }

    // Metadata
    setType(type: GameType) {
        if (this.type !== undefined) {
            throw new MetadataValueMustBeFinalError();
        }
        this._type = type;
    }
    setMap(map: GameMap) {
        if (this.map !== undefined) {
            throw new MetadataValueMustBeFinalError();
        }
        this._map = map;
        // TODO: Set up gates, hives, snails, etc.
    }
    setOrientation(orientation: GameOrientation) {
        if (this.orientation !== undefined) {
            throw new MetadataValueMustBeFinalError();
        }
        this._orientation = orientation;
    }
    setDuration(duration: number) {
        if (this.duration !== undefined) {
            throw new MetadataValueMustBeFinalError();
        }
        this._duration = duration;
    }
    setWin(win: GameWin) {
        if (this.win !== undefined) {
            throw new MetadataValueMustBeFinalError();
        }
        this._win = win;
    }

    // Gates
    tagGate(position: Position, team: Team) {
        const gate = this.getGate(position);
        const possession = Game.teamPossession[team];
        gate.setPossession(possession);
    }
    enterGate(position: Position, character: Character) {
        const gate = this.getGate(position);
        gate.enter(character);
    }
    exitGate(position: Position, character: Character) {
        const gate = this.getGate(position);
        gate.exit(character);
    }
    useGate(position: Position, character: Character) {
        const gate = this.getGate(position);
        const player = this.getPlayer(character);
        switch (gate.type) {
            case GateType.Speed:
            player.becomeSpeed();
            break;
            case GateType.Warrior:
            player.becomeWarrior();
            break;
            default:
            break;
        }
        gate.use(character);
    }

    // Hives
    depositBerry(position: Position, character: Character) {
        const team = Game.characterTeam[character];
        const hive = this.getHive(team, position);
        const player = this.getPlayer(character);
        hive.depositBerry(position);
        player.depositBerry();
    }
    kickInBerry(position: Position, character: Character) {
        // TODO: Implement
        // (Use a "best guess" system for which hive the berry
        // got kicked into)
    }

    // Snail
    getOnSnail(position: Position, character: Character) {
        const snail = this.getSnailByPosition(position);
        const player = this.getPlayer(character);
        snail.setRider(character);
        player.getOnSnail();
    }
    getOffSnail(character: Character) {
        const snail = this.getSnailByRider(character);
        const player = this.getPlayer(character);
        snail.clearRider();
    }
    updateSnailPosition(rider: Character, position: Position) {
        const snail = this.getSnailByRider(rider);
        snail.setPosition(position);
    }
    startEating(rider: Character, eaten: Character) {
        const snail = this.getSnailByRider(rider);
        snail.startEating(eaten);
    }
    endEating(rider: Character) {
        const snail = this.getSnailByRider(rider);
        snail.endEating();
    }

    // Player
    becomeHuman(character: Character) {
        const player = this.getPlayer(character);
        player.becomeHuman();
    }
    holdBerry(character: Character) {
        const player = this.getPlayer(character);
        player.holdBerry();
    }
    kill(victim: Character, killer: Character) {
        const player = this.getPlayer(victim);
        player.kill();
        // If victim was snail rider, free drone being eaten
        const snailByRider = this.getSnailByRiderSafe(victim);
        if (
            snailByRider !== undefined &&
            snailByRider.eatingCharacter !== undefined
         ) {
            snailByRider.endEating();
            snailByRider.clearRider();
        }
        // If victim was drone being eaten by snail, end eating
        const snailByEatingCharacter = this.getSnailByEatingCharacterSafe(victim);
        if (snailByEatingCharacter !== undefined) {
            snailByEatingCharacter.endEating();
        }
    }

    private getPlayer(character: Character) {
        return this.players[character];
    }
    private getGate(position: Position) {
        const gate = this._gates.find((elem) => {
            return equal(position, elem.position);
        });
        if (gate === undefined) {
            throw new GateNotFoundError();
        }
        return gate;
    }
    private getHive(team: Team, position: Position) {
        for (let hive of this.hives) {
            if (hive.team === team && hive.inBounds(position)) {
                return hive;
            }
        }
        throw new HiveNotFoundError();
    }
    private getSnailByPosition(position: Position) {
        const snail = this._snails.find((elem) => {
            return equal(elem.position, position);
        });
        if (snail === undefined) {
            throw new SnailNotFoundError();
        }
        return snail;
    }
    private getSnailByRider(rider: Character) {
        const snail = this._snails.find((elem) => {
            return elem.rider === rider;
        });
        if (snail === undefined) {
            throw new SnailNotFoundError();
        }
        return snail;
    }
    private getSnailByEatingCharacter(eatingCharacter: Character) {
        const snail = this.snails.find((elem) => {
            return elem.eatingCharacter === eatingCharacter;
        });
        if (snail === undefined) {
            throw new SnailNotFoundError();
        }
        return snail;
    }

    private getSnailByRiderSafe(rider: Character) {
        try {
            return this.getSnailByRider(rider);
        } catch (error) {
            if (error instanceof SnailNotFoundError) {
                return undefined;
            } else {
                throw error;
            }
        }
    }
    private getSnailByEatingCharacterSafe(eatingCharacter: Character) {
        try {
            return this.getSnailByEatingCharacter(eatingCharacter);
        } catch (error) {
            if (error instanceof SnailNotFoundError) {
                return undefined;
            } else {
                throw error;
            }
        }
    }
}
