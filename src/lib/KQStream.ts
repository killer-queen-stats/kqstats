/**
 * Many thanks to Tony for his awesome work on kqdeathmap:
 * https://github.com/arantius/kqdeathmap
 */

import { ProtectedEventEmitter } from 'eventemitter-ts';
import * as stream from 'stream';
import * as websocket from 'websocket';
import * as parsers from './parsers';
import {
    PlayerNames,
    PlayerKill,
    BlessMaiden,
    ReserveMaiden,
    UnreserveMaiden,
    UseMaiden,
    Glance,
    CarryFood,
    GameStart,
    GameEnd,
    Victory,
    Spawn,
    GetOnSnail,
    GetOffSnail,
    SnailEat,
    SnailEscape,
    BerryDeposit,
    BerryKickIn,
} from './models/KQStream';

export interface KQStreamOptions {
    log?: stream.Writable;
}

export type GameEvents = {
    'playernames': PlayerNames,
    'playerKill': PlayerKill,
    // New events from beta 2018-08-21
    'blessMaiden': BlessMaiden,
    'reserveMaiden': ReserveMaiden,
    'unreserveMaiden': UnreserveMaiden,
    'useMaiden': UseMaiden,
    'glance': Glance,
    'carryFood': CarryFood,
    'gamestart': GameStart,
    'gameend': GameEnd,
    'victory': Victory,
    'spawn': Spawn,
    'getOnSnail': GetOnSnail,
    'getOffSnail': GetOffSnail,
    'snailEat': SnailEat,
    'snailEscape': SnailEscape,
    'berryDeposit': BerryDeposit,
    'berryKickIn': BerryKickIn,
};

type ConnectionClose = {
    code: number,
    desc: string,
};

type ConnectionError = {
    err: Error,
    connected: boolean,
};

type StreamEvents = {
    'connectionClose': ConnectionClose,
    'connectionError': ConnectionError,
};

type Events = GameEvents & StreamEvents;

export class KQStream extends ProtectedEventEmitter<Events> {
    private options: KQStreamOptions;
    private connection: websocket.connection;

    /**
     * Parses a Killer Queen websocket message.
     * 
     * @param message The message to parse
     * @returns The type (key) and data (value) of the message,
     *          or `undefined` if unable to parse the message.
     */
    static parse(message: string) {
        const dataArray = message.match(/!\[k\[(.*?)\],v\[(.*)?\]\]!/);
        if (!dataArray) {
            return;
        }
        return {
            type: dataArray[1],
            data: dataArray[2]
        };
    }

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
                connection.on('close', (code, desc) => {
                    this.protectedEmit('connectionClose', {
                        code,
                        desc
                    });
                });
                connection.on('error', (err) => {
                    this.protectedEmit('connectionError', {
                        err,
                        connected: this.connection.connected
                    });
                });
                resolve();
            });
            client.connect(host);
        });
    }

    private processMessage(message: string): void {
        if (this.options.log !== undefined) {
            this.options.log.write(`${Date.now().toString()},${message}\n`);
        }
        const parsedMessage = KQStream.parse(message);
        if (!parsedMessage) {
            console.warn('Could not parse message', message);
            return;
        }
        switch (parsedMessage.type) {
        case 'alive':
            this.sendMessage('im alive', null);
            break;
        case 'playernames':
            const playernames = parsers.playernames(parsedMessage.data);
            this.protectedEmit('playernames', playernames);
            break;
        case 'playerKill':
            const playerKill = parsers.playerKill(parsedMessage.data);
            this.protectedEmit('playerKill', playerKill);
            break;
        // New events from beta 2018-08-21
        case 'blessMaiden':
            const blessMaiden = parsers.blessMaiden(parsedMessage.data);
            this.protectedEmit('blessMaiden', blessMaiden);
            break;
        case 'reserveMaiden':
            const reserveMaiden = parsers.reserveMaiden(parsedMessage.data);
            this.protectedEmit('reserveMaiden', reserveMaiden);
            break;
        case 'unreserveMaiden':
            const unreserveMaiden = parsers.unreserveMaiden(parsedMessage.data);
            this.protectedEmit('unreserveMaiden', unreserveMaiden);
            break;
        case 'useMaiden':
            const useMaiden = parsers.useMaiden(parsedMessage.data);
            this.protectedEmit('useMaiden', useMaiden);
            break;
        case 'glance':
            const glance = parsers.glance(parsedMessage.data);
            this.protectedEmit('glance', glance);
            break;
        case 'carryFood':
            const carryFood = parsers.carryFood(parsedMessage.data);
            this.protectedEmit('carryFood', carryFood);
            break;
        case 'gamestart':
            const gameStart = parsers.gameStart(parsedMessage.data);
            this.protectedEmit('gamestart', gameStart);
            break;
        case 'gameend':
            const gameEnd = parsers.gameEnd(parsedMessage.data);
            this.protectedEmit('gameend', gameEnd);
            break;
        case 'victory':
            const victory = parsers.victory(parsedMessage.data);
            this.protectedEmit('victory', victory);
            break;
        case 'spawn':
            const spawn = parsers.spawn(parsedMessage.data);
            this.protectedEmit('spawn', spawn);
            break;
        case 'getOnSnail: ':
            const getOnSnail = parsers.getOnSnail(parsedMessage.data);
            this.protectedEmit('getOnSnail', getOnSnail);
            break;
        case 'getOffSnail: ':
            const getOffSnail = parsers.getOffSnail(parsedMessage.data);
            this.protectedEmit('getOffSnail', getOffSnail);
            break;
        case 'snailEat':
            const snailEat = parsers.snailEat(parsedMessage.data);
            this.protectedEmit('snailEat', snailEat);
            break;
        case 'snailEscape':
            const snailEscape = parsers.snailEscape(parsedMessage.data);
            this.protectedEmit('snailEscape', snailEscape);
            break;
        case 'berryDeposit':
            const berryDeposit = parsers.berryDeposit(parsedMessage.data);
            this.protectedEmit('berryDeposit', berryDeposit);
            break;
        case 'berryKickIn':
            const berryKickIn = parsers.berryKickIn(parsedMessage.data);
            this.protectedEmit('berryKickIn', berryKickIn);
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
