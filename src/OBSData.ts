import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { KQStream, Character, PlayerKill } from './KQStream';

interface CharacterStats {
    'kills': number,
    'deaths': number
}

interface CabStats {
    'characters': {
        'queen': CharacterStats,
        'stripes': CharacterStats,
        'abs': CharacterStats,
        'skulls': CharacterStats,
        'checks': CharacterStats
    }
}

interface GameStats {
    'gold': CabStats,
    'blue': CabStats
}

interface CharacterMapping {
    [key: number]: {
        'cab': string,
        'character': string
    }
}

export class OBSData {
    private static readonly defaultGameStats: GameStats = {
        'gold': {
            'characters': {
                'queen': {
                    kills: 0,
                    deaths: 0
                },
                'stripes': {
                    kills: 0,
                    deaths: 0
                },
                'abs': {
                    kills: 0,
                    deaths: 0
                },
                'skulls': {
                    kills: 0,
                    deaths: 0
                },
                'checks': {
                    kills: 0,
                    deaths: 0
                }
            }
        },
        'blue': {
            'characters': {
                'queen': {
                    kills: 0,
                    deaths: 0
                },
                'stripes': {
                    kills: 0,
                    deaths: 0
                },
                'abs': {
                    kills: 0,
                    deaths: 0
                },
                'skulls': {
                    kills: 0,
                    deaths: 0
                },
                'checks': {
                    kills: 0,
                    deaths: 0
                }
            }
        }
    }
    private static readonly statsDirName = '.kqstats';

    private stream: KQStream;
    private rootPath: string;
    private gameStats: GameStats;

    constructor(stream: KQStream) {
        this.stream = stream;
        this.rootPath = path.join(os.homedir(), OBSData.statsDirName);
        this.prepareRootDir();
        this.resetStats();
        this.stream.on('playernames', () => {
            this.resetStats();
        });
        this.stream.on('playerKill', (kill: PlayerKill) => {
            this.processKill(kill);
        });
    }

    private prepareRootDir() {
        if (fs.existsSync(this.rootPath)) {
            rimraf.sync(this.rootPath);
        }
        fs.mkdirSync(this.rootPath);
    }

    private resetStats() {
        this.gameStats = JSON.parse(JSON.stringify(OBSData.defaultGameStats));
        this.write();
    }

    private processKill(kill: PlayerKill) {
        const characterNames = [
            'queen',
            'stripes',
            'abs',
            'skulls',
            'checks'
        ];
        const updates = [{
            playerNumber: kill.by,
            target: 'kills'
        }, {
            playerNumber: kill.killed,
            target: 'deaths'
        }];

        for (let update of updates) {
            let cab: string;
            let character: string;

            if (update.playerNumber % 2 === 0) {
                cab = 'blue';
            }
            else {
                cab = 'gold';
            }
            const characterIndex = Math.floor((update.playerNumber - 1) / 2);
            character = characterNames[characterIndex];

            this.gameStats[cab].characters[character][update.target]++;
        }

        this.write();
    }

    private write() {
        function recursiveWrite(rootDir: string, data: object) {
            for (let itemName in data) {
                const itemPath = path.join(rootDir, itemName);
                // Is a directory
                if (typeof data[itemName] === 'object') {
                    if (!fs.existsSync(itemPath)) {
                        fs.mkdirSync(itemPath);
                    }
                    recursiveWrite(itemPath, data[itemName]);
                }
                // Is a file
                else {
                    fs.writeFileSync(`${itemPath}.txt`, data[itemName]);
                }
            }
        }
        recursiveWrite(this.rootPath, this.gameStats);
    }
}
