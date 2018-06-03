import { expect } from 'chai';
import * as http from 'http';
import * as sinon from 'sinon';
import * as websocket from 'websocket';
import { KQStream, Events, PlayerNames, PlayerKill, Character } from '../src/lib/KQStream';
import { sleep } from '../src/lib/helper';
import { KQCab } from '../src/lib/KQCab';

interface ListenerCount {
    onPlayerNames?: number;
    onPlayerKill?: number;
}

function createListenerPromise<K extends keyof Events>(
    stream: KQStream,
    event: K,
    listener: (event: Events[K]) => void,
    numCalls: number
) {
    let count = 0;
    return new Promise<void>((resolve) => {
        stream.on(event, (arg) => {
            listener(arg);
            if (++count === numCalls) {
                resolve();
            }
        });
    });
}

describe('KQStream', () => {
    interface TestEvent {
        timestamp: string;
        message: string;
    }

    const stream = new KQStream();
    const events: TestEvent[] = [{
        timestamp: '1518063130441',
        message: '![k[playernames],v[,,,,,,,,,]]!'
    }, {
        timestamp: '1518063130451',
        message: '![k[playerKill],v[730,860,9,8]]!'
    }, {
        timestamp: '1518063130461',
        message: '![k[playerKill],v[770,860,9,10]]!'
    }, {
        timestamp: '1518063130471',
        message: '![k[playerKill],v[810,860,9,4]]!'
    }, {
        timestamp: '1518063130481',
        message: '![k[playerKill],v[1071.977,20,3,10]]!'
    }];
    const expectedPlayerNamesEvents: PlayerNames[] = [{}];
    const expectedPlayerKillEvents: PlayerKill[] = [{
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
    }];
    const onPlayerNames = (event: PlayerNames) => {
        playerNamesEvents.push(event);
    };
    const onPlayerKill = (event: PlayerKill) => {
        playerKillEvents.push(event);
    };

    let playerNamesEvents: PlayerNames[];
    let playerKillEvents: PlayerKill[];
    let playerNamesPromise: Promise<void>;
    let playerKillPromise: Promise<void>;

    describe('#connect', () => {
        before(async () => {
            const cab = new KQCab();
            await stream.connect(`ws://localhost:${KQCab.DEFAULT_PORT}`);

            // Arrange
            playerNamesEvents = [];
            playerKillEvents = [];
            playerNamesPromise = createListenerPromise(stream, 'playernames', onPlayerNames, 1);
            playerKillPromise = createListenerPromise(stream, 'playerKill', onPlayerKill, 4);

            // Act
            for (let event of events) {
                cab.send(event.message);
            }
        });

        it('should process playernames events', async () => {
            await playerNamesPromise;
            expect(playerNamesEvents.length).to.equal(1);
            for (let expectedEvent of expectedPlayerNamesEvents) {
                expect(playerNamesEvents).to.deep.include(expectedEvent);
            }
        });

        it('should process playerKill events', async () => {
            await playerKillPromise;
            expect(playerKillEvents.length).to.equal(4);
            for (let expectedEvent of expectedPlayerKillEvents) {
                expect(playerKillEvents).to.deep.include(expectedEvent);
            }
        });

        after(() => {
            stream.removeAllListeners();
        });
    });

    describe('#read', () => {
        before(() => {
            // Arrange
            playerNamesEvents = [];
            playerKillEvents = [];
            playerNamesPromise = createListenerPromise(stream, 'playernames', onPlayerNames, 1);
            playerKillPromise = createListenerPromise(stream, 'playerKill', onPlayerKill, 4);
            let data: string = '';
            for (let event of events) {
                data += `${event.timestamp},${event.message}\n`;
            }

            // Act
            stream.read(data);
        });

        it('should process playernames events', async () => {
            await playerNamesPromise;
            expect(playerNamesEvents.length).to.equal(1);
            for (let expectedEvent of expectedPlayerNamesEvents) {
                expect(playerNamesEvents).to.deep.include(expectedEvent);
            }
        });

        it('should process playerKill events', async () => {
            await playerKillPromise;
            expect(playerKillEvents.length).to.equal(4);
            for (let expectedEvent of expectedPlayerKillEvents) {
                expect(playerKillEvents).to.deep.include(expectedEvent);
            }
        });

        after(() => {
            stream.removeAllListeners();
        });
    });
});
