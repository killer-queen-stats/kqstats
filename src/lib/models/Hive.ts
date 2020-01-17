import {
    GameMap,
    Team
} from '../models/Game';
import { Hives } from '../Game';
import { Position } from './KQStream';
import {
    HiveMustHaveMoreThanZeroHolesError,
    HiveIsFullError
} from './errors/gameState/HiveError';

type HiveSet = {
    [map in GameMap]: () => Hives
};

type HiveOptions = {
    team: Team,
    holes: number
};

export class Hive {
    static readonly set: HiveSet = {
        [GameMap.Day]: Hive.defaultHives,
        [GameMap.Night]: Hive.defaultHives,
        [GameMap.Dusk]: Hive.defaultHives,
        [GameMap.BonusWarrior]: () => {
            return {};
        },
        [GameMap.BonusSnail]: () => {
            return {};
        }
    };

    private _team: Team;
    get team(): Team {
        return this._team;
    }
    private _holes: number;
    get holes(): number {
        return this._holes;
    }
    private _berryDeposits: number;
    get berryDeposits(): number {
        return this._berryDeposits;
    }
    private _berryKickIns: number;
    get berryKickIns(): number {
        return this._berryKickIns;
    }
    get berries(): number {
        return this._berryDeposits + this._berryKickIns;
    }

    static defaultHives() {
        return {
            [Team.Blue]: new Hive({
                team: Team.Blue,
                holes: 12
            }),
            [Team.Gold]: new Hive({
                team: Team.Gold,
                holes: 12
            })
        };
    }

    constructor(options: HiveOptions) {
        if (options.holes <= 0) {
            throw new HiveMustHaveMoreThanZeroHolesError();
        }
        this._team = options.team;
        this._holes = options.holes;
        this._berryDeposits = 0;
        this._berryKickIns = 0;
    }

    depositBerry(position: Position) {
        if (this.berries === this.holes) {
            throw new HiveIsFullError();
        }
        this._berryDeposits++;
    }
    kickInBerry(position: Position) {
        if (this.berries === this.holes) {
            throw new HiveIsFullError();
        }
        this._berryKickIns++;
    }
}
