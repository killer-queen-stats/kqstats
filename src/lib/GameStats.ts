import * as uuid from 'uuid/v4';
import { KQStream, Character, PlayerKill } from './KQStream';

type StatisticType = 'kills' | 'queen_kills' | 'warrior_kills' | 'deaths';

interface Enum {
    [key: number]: string;
}

export interface GameStatsType {
    // Should be [character in Character], but there's a regression in TypeScript:
    // https://github.com/Microsoft/TypeScript/issues/13042
    [character: number]: {
        [statisticType in StatisticType]: number
    };
}

interface GameStateType {
    // Should be [character in Character], but there's a regression in TypeScript:
    // https://github.com/Microsoft/TypeScript/issues/13042
    [character: number]: {
        isWarrior: boolean
    };
}

export interface GameStatsFilter {
    // Should be [character in Character], but there's a regression in TypeScript:
    // https://github.com/Microsoft/TypeScript/issues/13042
    [character: number]: StatisticType[];
}

export interface KQStat {
    character: Character;
    statistic: StatisticType;
    value: number;
}

export type GameStatsCallback<T> = (data: T) => any;

interface GameStatsCallbackDictionary<T> {
    [id: string]: GameStatsCallback<T>;
}

export class GameStats {
    private stream: KQStream;
    private hasGameStartBeenEncountered: boolean;
    private gameStats: GameStatsType;
    private gameState: GameStateType;
    private onChange: GameStatsCallbackDictionary<KQStat>;

    /**
     * Complete list of valid statistic types.
     */
    static get statisticTypes(): StatisticType[] {
        return [
            'kills',
            'queen_kills',
            'warrior_kills',
            'deaths'
        ];
    }
    /**
     * Default game statistics. This is what the
     * statistics of a game are when it begins.
     */
    static get defaultGameStats(): GameStatsType {
        const defaultGameStats: GameStatsType = {};
        const characterValues = GameStats.getEnumNumbers(Character);
        for (let character of characterValues) {
            defaultGameStats[character] = {} as any;
            for (let statistic of GameStats.statisticTypes) {
                defaultGameStats[character][statistic] = 0;
            }
        }
        return defaultGameStats;
    }
    static get defaultGameState(): GameStateType {
        const defaultGameState: GameStateType = {};
        const characterValues = GameStats.getEnumNumbers(Character);
        for (let character of characterValues) {
            defaultGameState[character] = {
                isWarrior: false
            };
        }
        return defaultGameState;
    }
    static get defaultChangeFilter(): GameStatsFilter {
        const defaultChangeFilter: GameStatsFilter = {};
        const characterValues = GameStats.getEnumNumbers(Character);
        for (let character of characterValues) {
            defaultChangeFilter[character] = GameStats.statisticTypes;
        }
        return defaultChangeFilter;
    }
    /**
     * Get all the number values of an enum.
     * 
     * This function is only relevant if your
     * enum uses number values, as opposed to
     * other value types (e.g. strings).
     * 
     * @param e The enum whose number values to get
     */
    static getEnumNumbers(e: Enum): number[] {
        const values: number[] = [];
        for (let key of Object.keys(e)) {
            const n = Number(key);
            if (!isNaN(n)) {
                values.push(n);
            }
        }
        return values;
    }

    /**
     * Returns true if character is a queen.
     * 
     * @param character The character to evaluate
     */
    private static isQueen(character: Character): boolean {
        return character === Character.GoldQueen || character === Character.BlueQueen;
    }

    /**
     * Returns true if the kill was maybe a snail eating a drone (i.e. snail kill).
     * 
     * - On day and dusk maps, snail kills happen at `y: 20`.
     * - On night map, snail kills happen at `y: 500`.
     * 
     * Drones killed while standing on a platform at the same height as the snail
     * will also have the same y-pos as a snail kill.
     * 
     * @param kill The kill to evaluate
     */
    private static isMaybeSnailKill(kill: PlayerKill): boolean {
        // Snail kills can happen within roughly 40 position units from
        // the default y-pos of 20 on day and dusk, and 500 on night.
        return (
            (kill.pos.y > -20 && kill.pos.y < 60) ||
            (kill.pos.y > 460 && kill.pos.y < 540)
        );
    }

    constructor(stream: KQStream) {
        this.stream = stream;
        this.onChange = {};
    }

    on(eventType: 'change', callback: GameStatsCallback<KQStat>): string;
    on(eventType: string, callback: GameStatsCallback<any>): string {
        let id = uuid();
        switch (eventType) {
        case 'change':
            while (this.onChange[id] !== undefined) {
                id = uuid();
            }
            this.onChange[id] = callback;
            break;
        default:
            throw new Error(`${eventType} is not a supported event type`);
        }
        return id;
    }

    off(eventType: 'change', id?: string): boolean;
    off(eventType: string, id?: string): boolean {
        let removed = false;
        if (id !== undefined) {
            switch (eventType) {
            case 'change':
                if (this.onChange[id] !== undefined) {
                    delete this.onChange[id];
                    removed = true;
                }
                break;
            default:
                throw new Error(`${eventType} is not a supported event type`);   
            }
        } else {
            let keys: string[] = [];
            switch (eventType) {
            case 'change':
                keys = Object.keys(this.onChange);
                removed = keys.length > 0;
                this.onChange = {};
                break;
            default:
                throw new Error(`${eventType} is not a supported event type`);
            }
        }
        return removed;
    }

    start() {
        this.resetStats();
        this.stream.on('playernames', () => {
            this.resetStats();
            if (!this.hasGameStartBeenEncountered) {
                this.stream.on('playerKill', (kill: PlayerKill) => {
                    this.processKill(kill);
                });
            }
            this.hasGameStartBeenEncountered = true;
        });
    }

    /**
     * Triggers a change event on the specified statistics.
     * If no filter is specified, a change event is triggered
     * for all statistics.
     * 
     * @param eventType The 'change' event
     * @param filter The statistics to filter
     */
    trigger(eventType: 'change', filter?: GameStatsFilter) {
        const ids = Object.keys(this.onChange);
        if (ids.length > 0) {
            if (filter === undefined) {
                filter = GameStats.defaultChangeFilter;
            }
            for (let character of Object.keys(filter)) {
                const characterNumber = Number(character);
                if (!isNaN(characterNumber)) {
                    for (let statistic of filter[character]) {
                        for (let id of ids) {
                            this.onChange[id]({
                                character: characterNumber,
                                statistic: statistic,
                                value: this.gameStats[characterNumber][statistic]
                            });
                        }
                    }
                }
            }
        }
    }

    private resetStats() {
        this.gameStats = GameStats.defaultGameStats;
        this.gameState = GameStats.defaultGameState;
        this.trigger('change');
    }

    private processKill(kill: PlayerKill) {
        const filter: GameStatsFilter = {
            [kill.by]: ['kills'],
            [kill.killed]: ['deaths']
        };

        // Increment kills and deaths
        this.gameStats[kill.by].kills++;
        if (kill.killed === Character.GoldQueen || kill.killed === Character.BlueQueen) {
            this.gameStats[kill.by].queen_kills++;
            filter[kill.by].push('queen_kills');
        } else if (this.gameState[kill.killed].isWarrior) {
            this.gameStats[kill.by].warrior_kills++;
            filter[kill.by].push('warrior_kills');
        }
        this.gameStats[kill.killed].deaths++;

        // Set state of characters
        if (!GameStats.isQueen(kill.by) && !GameStats.isMaybeSnailKill(kill)) {
            this.gameState[kill.by].isWarrior = true;
        }
        if (!GameStats.isQueen(kill.killed)) {
            this.gameState[kill.killed].isWarrior = false;
        }

        this.trigger('change', filter);
    }
}
