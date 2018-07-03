/**
 * Many thanks to Tony for his awesome work on kqdeathmap:
 * https://github.com/arantius/kqdeathmap
 */

import { ProtectedEventEmitter } from 'eventemitter-ts';
import * as stream from 'stream';
import * as websocket from 'websocket';

export enum Character {
    GoldQueen = 1,
    BlueQueen = 2,
    GoldStripes = 3,
    BlueStripes = 4,
    GoldAbs = 5,
    BlueAbs = 6,
    GoldSkulls = 7,
    BlueSkulls = 8,
    GoldChecks = 9,
    BlueChecks = 10
}

export interface PlayerNames {}

export interface Position {
    x: number;
    y: number;
}

export interface PlayerKill {
    pos: Position;
    killed: Character;
    by: Character;
}

export interface KQStreamOptions {
    log?: stream.Writable;
}

export interface Events {
    'playernames': PlayerNames;
    'playerKill': PlayerKill;
}

export class KQStream extends ProtectedEventEmitter<Events> {
    private options: KQStreamOptions;
    private connection: websocket.connection;

    constructor(options?: KQStreamOptions) {
        super();
        if (options === undefined) {
            options = {};
        }
        this.options = options;
    }

    async connect(host: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const client = new websocket.client();
            client.on('connectFailed', (err) => {
                reject(err);
            });
            client.on('connect', (connection) => {
                this.connection = connection;
                connection.on('message', (data) => {
                    if (data !== undefined && data.utf8Data !== undefined) {
                        const message = data.utf8Data.toString();
                        this.processMessage(message);
                    }
                });
                resolve();
            });
            client.connect(host);
        });
    }

    read(data: string): void {
        const lines = data.split('\n');
        if (data[data.length - 1] === '\n') {
            lines.splice(lines.length - 1, 1);
        }
        const start = Number(lines[0].split(',')[0]);
        for (let line of lines) {
            const lineArray = line.split(',');
            const timestamp = Number(lineArray[0]);
            lineArray.splice(0, 1);
            const message = lineArray.join(',');
            setTimeout(() => {
                this.processMessage(message);
            }, timestamp - start);
        }
    }

    private processMessage(message: string): void {
        if (this.options.log !== undefined) {
            this.options.log.write(`${Date.now().toString()},${message}\n`);
        }
        const dataArray = message.match(/!\[k\[(.*?)\],v\[(.*)?\]\]!/);
        if (!dataArray) {
            console.warn('Could not parse message', message);
            return;
        }
        const [, key, value] = dataArray;
        switch (key) {
        case 'alive':
            this.sendMessage('im alive', null);
            break;
        case 'playernames':
            // Not sure what the values of the message mean,
            // so just pass an empty object for now.
            this.protectedEmit('playernames', {});
            break;
        case 'playerKill':
            const [x, y, by, killed] = value.split(',');
            const playerKill: PlayerKill = {
                pos: {
                    x: Number(x),
                    y: Number(y)
                },
                killed: Number(killed),
                by: Number(by)
            };
            this.protectedEmit('playerKill', playerKill);
            break;
        default:
            break;
        }
    }

    private sendMessage(key: string, value: any): void {
        if (this.connection !== undefined) {
            const valueString = JSON.stringify(value);
            const message = `![k[${key}],v[${valueString}]]!`;
            const buffer = Buffer.from(message, 'utf8');
            this.connection.send(buffer);
        }
    }
}
