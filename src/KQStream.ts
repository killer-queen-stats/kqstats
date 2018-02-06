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
                connection.on('message', (data) => {
                    this.processMessage(data);
                });
                resolve();
            });
            this.client.connect(host);
        })
    }

    private processMessage(data: websocket.IMessage): void {
        const message = data.binaryData.toString();
        if (this.log !== undefined) {
            this.log.write(`${Date.now().toString()},${message}\n`);
        }
        const dataArray = message.match(/!\[k\[(.*?)\],v\[(.*)?\]\]!/);
        if (!dataArray) {
            console.warn('Could not parse data', data.utf8Data);
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
