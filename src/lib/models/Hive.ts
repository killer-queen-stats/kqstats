import { GameMap, Team } from './Game';
import { Position } from './KQStream';

/**
 * Describes the bounds of a `Hive` object.
 * Berries deposited into a hive must have
 * an x,y position within these bounds for
 * the deposit to be valid.
 */
type HiveBounds = {
    x: number,
    y: number,
    width: number,
    height: number
};

type HiveSet = {
    [map in GameMap]: () => Hive[]
};

type HiveOptions = {
    bounds: HiveBounds,
    team: Team,
    holes: number
};

export class Hive {
    static readonly set: HiveSet = {
        [GameMap.Day]: () => {
            return [
                new Hive({
                    bounds: {
                        // TODO: Fill this in
                    },
                    team: Team.Blue,
                    holes: 12
                }),
                new Hive({
                    bounds: {
                        // TODO: Fill this in
                    },
                    team: Team.Gold,
                    holes: 12
                })
            ];
        },
        [GameMap.Night]: () => {
            return [
                new Hive({
                    bounds: {
                        // TODO: Fill this in
                    },
                    team: Team.Blue,
                    holes: 12
                }),
                new Hive({
                    bounds: {
                        // TODO: Fill this in
                    },
                    team: Team.Gold,
                    holes: 12
                })
            ];
        },
        [GameMap.Dusk]: () => {
            return [
                new Hive({
                    bounds: {
                        // TODO: Fill this in
                    },
                    team: Team.Blue,
                    holes: 12
                }),
                new Hive({
                    bounds: {
                        // TODO: Fill this in
                    },
                    team: Team.Gold,
                    holes: 12
                })
            ];
        },
        [GameMap.BonusWarrior]: () => [],
        [GameMap.BonusSnail]: () => []
    };

    private _bounds: HiveBounds;
    get bounds(): HiveBounds {
        return this._bounds;
    }
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
        this.checkBounds(position);
        if (this.berries === this.holes) {
            throw new HiveIsFullError();
        }
        this._berryDeposits++;
    }
    kickInBerry() {
        if (this.berries === this.holes) {
            throw new HiveIsFullError();
        }
        this._berryKickIns++;
    }

    inBounds(position: Position) {
        return (
            position.x > this.bounds.x &&
            position.y > this.bounds.y &&
            position.x < this.bounds.x + this.bounds.width &&
            position.y < this.bounds.y + this.bounds.height
        );
    }

    private checkBounds(position: Position) {
        if (!this.inBounds(position)) {
            throw new BerryDepositOutOfBoundsError();
        }
    }
}
