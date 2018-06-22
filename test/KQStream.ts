import { expect } from 'chai';
import * as http from 'http';
import * as sinon from 'sinon';
import * as websocket from 'websocket';
import { KQStream, Events, PlayerNames, PlayerKill, Character } from '../src/lib/KQStream';
import * as sleep from 'sleep-promise';
import { KQCab } from '../src/lib/KQCab';

interface ListenerCount {
    onPlayerNames?: number;
    onPlayerKill?: number;
}

type TestEvent = {
    timestamp: string;
    type: keyof Events;
    data: string;
};

type CabEvents = {
    [K in keyof Events]: Events[K][];
};

type CabPromises = {
    [K in keyof Events]: Promise<void>[];
};

/**
 * Removes all event listeners from a KQStream.
 * 
 * This is a holdover until the following issue is fixed:
 * https://github.com/KevinSnyderCodes/eventemitter-ts/issues/2
 * 
 * @param stream The KQStream to remove all event listeners from
 */
function removeAllListeners(stream: KQStream) {
    stream.removeAllListeners('playernames');
    stream.removeAllListeners('playerKill');
}

describe('KQStream', () => {
    const stream = new KQStream();
    const messages: TestEvent[] = [{
        timestamp: '1518063130441',
        type: 'playernames',
        data: '![k[playernames],v[,,,,,,,,,]]!'
    }, {
        timestamp: '1518063130451',
        type: 'playerKill',
        data: '![k[playerKill],v[730,860,9,8]]!'
    }, {
        timestamp: '1518063130461',
        type: 'playerKill',
        data: '![k[playerKill],v[770,860,9,10]]!'
    }, {
        timestamp: '1518063130471',
        type: 'playerKill',
        data: '![k[playerKill],v[810,860,9,4]]!'
    }, {
        timestamp: '1518063130481',
        type: 'playerKill',
        data: '![k[playerKill],v[1071.977,20,3,10]]!'
    }];
    const expectedEvents: CabEvents = {
        playernames: [{}],
        playerKill: [{
            pos: {
                x: 770,
                y: 860
            },
            killed: Character.BlueChecks,
            by: Character.GoldChecks
        }, {
            pos: {
                x: 770,
                y: 860
            },
            killed: Character.BlueChecks,
            by: Character.GoldChecks
        }, {
            pos: {
                x: 810,
                y: 860
            },
            killed: Character.BlueStripes,
            by: Character.GoldChecks
        }, {
            pos: {
                x: 1071.977,
                y: 20
            },
            killed: Character.BlueChecks,
            by: Character.GoldStripes
        }]
    };

    let receivedEvents: CabEvents;

    describe('#connect', () => {
        before(async () => {
            receivedEvents = {
                playernames: [],
                playerKill: []
            };

            const cab = new KQCab();
            await stream.connect(`ws://localhost:${KQCab.DEFAULT_PORT}`);

            for (let message of messages) {
                await new Promise<void>((resolve) => {
                    stream.once(message.type, (arg) => {
                        (receivedEvents[message.type] as any).push(arg);
                        resolve();
                    });
                    cab.send(message.data);
                });
            }
        });

        it('should process playernames events', async () => {
            expect(receivedEvents.playernames.length).to.equal(1);
            for (let expectedEvent of expectedEvents.playernames) {
                expect(receivedEvents.playernames).to.deep.include(expectedEvent);
            }
        });

        it('should process playerKill events', async () => {
            expect(receivedEvents.playerKill.length).to.equal(4);
            for (let expectedEvent of expectedEvents.playerKill) {
                expect(receivedEvents.playerKill).to.deep.include(expectedEvent);
            }
        });
    });

    describe('#read', () => {
        before(async () => {
            receivedEvents = {
                playernames: [],
                playerKill: []
            };

            stream.on('playernames', (arg) => {
                receivedEvents.playernames.push(arg);
            });
            stream.on('playerKill', (arg) => {
                receivedEvents.playerKill.push(arg);
            });

            let data: string = '';
            for (let message of messages) {
                data += `${message.timestamp},${message.data}\n`;
            }
            stream.read(data);

            await sleep(100);
        });

        it('should process playernames events', async () => {
            expect(receivedEvents.playernames.length).to.equal(1);
            for (let expectedEvent of expectedEvents.playernames) {
                expect(receivedEvents.playernames).to.deep.include(expectedEvent);
            }
        });

        it('should process playerKill events', async () => {
            expect(receivedEvents.playerKill.length).to.equal(4);
            for (let expectedEvent of expectedEvents.playerKill) {
                expect(receivedEvents.playerKill).to.deep.include(expectedEvent);
            }
        });
    });
});
