/**
 * Many thanks to Tony for his awesome work on kqdeathmap:
 * https://github.com/arantius/kqdeathmap
 */

import * as websocket from 'websocket';
import * as stream from 'stream';

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

export interface Position {
    x: number,
    y: number
}

export interface PlayerKill {
    pos: Position,
    killed: Character,
    by: Character
}

export type KQEvent = PlayerKill;

export type KQEventType = 'playerKill';

export type KQEventCallback<T> = (event: T) => any;

export interface KQStreamOptions {
    log?: stream.Writable
}

export class KQStream {
    private client: websocket.client;
    private connection: websocket.connection;

    private onPlayerKill: KQEventCallback<PlayerKill>;

    private log: stream.Writable;

    constructor(options?: KQStreamOptions) {
        if (options !== undefined) {
            if (options.log !== undefined) {
                this.log = options.log;
            }
        }
    }

    async connect(host: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.client = new websocket.client();
            this.client.on('connectFailed', (err) => {
                reject(err);
            });
            this.client.on('connect', (connection) => {
                this.connection = connection;
                connection.on('message', (data) => {
                    const message = data.utf8Data.toString();
                    this.processMessage(message);
                });
                resolve();
            });
            this.client.connect(host);
        })
    }

    read(data: string): void {
        const lines = data.split('\n');
        if (data[data.length-1] === '\n') {
            lines.splice(lines.length-1, 1);
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
        if (this.log !== undefined) {
            this.log.write(`${Date.now().toString()},${message}\n`);
        }
        const dataArray = message.match(/!\[k\[(.*?)\],v\[(.*)?\]\]!/);
        if (!dataArray) {
            console.warn('Could not parse message', message);
            return;
        }
        const [_, key, value] = dataArray;
        switch (key) {
        case 'alive':
            this.sendMessage('im alive', null);
        case 'playerKill':
            if (this.onPlayerKill) {
                const [x, y, by, killed] = value.split(',');
                const playerKill: PlayerKill = {
                    pos: {
                        x: Number(x),
                        y: Number(y)
                    },
                    killed: Number(killed),
                    by: Number(by)
                };
                this.onPlayerKill(playerKill);
            }
            break;
        }
    }

    private sendMessage(key: string, value: any): void {
        const valueString = JSON.stringify(value);
        const message = `![k[${key}],v[${valueString}]]!`;
        const buffer = Buffer.from(message, 'utf8');
        this.connection.send(buffer);
    }

    on(eventType: 'playerKill', callback: KQEventCallback<PlayerKill>): void;
    on(eventType: KQEventType, callback: KQEventCallback<KQEvent>): void {
        switch (eventType) {
        case 'playerKill':
            this.onPlayerKill = callback;
            break;
        }
    }
}
