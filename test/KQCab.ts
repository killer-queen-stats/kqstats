import { expect } from 'chai';
import * as moment from 'moment';
import * as portscanner from 'portscanner';
import * as sinon from 'sinon';
import * as sleep from 'sleep-promise';
import * as websocket from 'websocket';
import { KQCab } from '../src/lib/KQCab';
import { KQStream } from '../src/lib/KQStream';

const NUM_ALIVE_INTERVALS = 10;
const NUM_CABS = 3;
const NUM_CONNECTIONS = 3;
const NUM_MESSAGES = 3;
const OTHER_PORT = 12345;
const WAIT_AFTER_MESSAGE_SEND_MS = 2;

interface CreateConnectionOptions {
    port?: number;
    keepAlive?: boolean;
    onMessage?: (message: string) => void;
}

async function createConnection(
    options?: CreateConnectionOptions
): Promise<websocket.connection> {
    const defaultOptions: CreateConnectionOptions = {
        port: KQCab.DEFAULT_PORT,
        keepAlive: true
    };
    const _options = Object.assign(defaultOptions, options);
    return new Promise<websocket.connection>((resolve, reject) => {
        const client = new websocket.client();
        client.on('connectFailed', (err) => {
            reject(err);
        });
        client.on('connect', (connection) => {
            connection.on('message', async (data) => {
                if (_options.keepAlive) {
                    connection.sendUTF('');
                    /**
                     * Originally we would sleep for 0 milliseconds,
                     * but this caused tests to fail randomly. Waiting
                     * for 2 milliseconds is the shortest amount of time
                     * that causes the tests to pass on each run.
                     */
                    await sleep(WAIT_AFTER_MESSAGE_SEND_MS, {
                        useCachedSetTimeout: true
                    });
                }
                if (data !== undefined && data.utf8Data !== undefined) {
                    const message = data.utf8Data.toString();
                    if (_options.onMessage !== undefined) {
                        _options.onMessage(message);
                    }
                }
            });
            resolve(connection);
        });
        client.connect(`ws://localhost:${_options.port}`);
    });
}

async function createConnections(n: number, options?: CreateConnectionOptions): Promise<websocket.connection[]> {
    const calls = [];
    for (let i = 0; i < n; i++) {
        calls.push(createConnection(options));
    }
    return Promise.all(calls);
}

describe('KQCab', () => {
    let clock: sinon.SinonFakeTimers;

    before(() => {
        clock = sinon.useFakeTimers();
    });

    describe('#constructor', () => {
        it('should create a server on the specified port', async () => {
            const cab = new KQCab(OTHER_PORT);
            const status = await portscanner.checkPortStatus(OTHER_PORT);
            expect(status).to.equal('open');
        });
        it('should create a server on port 12749 if no port is specified', async () => {
            const cab = new KQCab();
            const status = await portscanner.checkPortStatus(KQCab.DEFAULT_PORT);
            expect(status).to.equal('open');
        });
        it('should not allow another server to be created on the same port', (done) => {
            const cab = new KQCab();
            const otherCab = new KQCab();
            (otherCab as any).httpServer.once('error', (err: any) => {
                expect(err.code).to.equal('EADDRINUSE');
                done();
            });
        });
    });
    describe('#send', () => {
        const TEST_MESSAGE = 'test message';

        it('should send a raw message to all clients', async () => {
            const cab = new KQCab();
            const connectionPromises: Promise<websocket.connection>[] = [];
            const messagePromises: Promise<string>[] = [];
            for (let i = 0; i < NUM_CONNECTIONS; i++) {
                const messagePromise = new Promise<string>((resolve) => {
                    const connectionPromise = createConnection({
                        onMessage: (message: string) => {
                            resolve(message);
                        }
                    });
                    connectionPromises.push(connectionPromise);
                });
                messagePromises.push(messagePromise);
            }
            await Promise.all(connectionPromises);
            cab.send(TEST_MESSAGE);
            const messages = await Promise.all(messagePromises);
            expect(messages.length).to.equal(NUM_CONNECTIONS);
            for (let message of messages) {
                expect(message).to.equal(TEST_MESSAGE);
            }
        });
    });
    describe('#destroy', () => {
        it('should close all connections', async () => {
            const cab = new KQCab();
            const connections = await createConnections(NUM_CONNECTIONS);
            const promises: Promise<void>[] = [];
            for (let connection of connections) {
                const promise = new Promise<void>((resolve) => {
                    connection.on('close', () => {
                        resolve();
                    });
                });
                promises.push(promise);
            }
            await cab.destroy();
            expect(promises.length).to.equal(NUM_CONNECTIONS);
            await Promise.all(promises);
        });
        it('should free up the port used by the KQCab instance', async () => {
            const cab = new KQCab();
            await cab.destroy();
            const status = await portscanner.checkPortStatus(KQCab.DEFAULT_PORT);
            expect(status).to.equal('closed');
        });
    });
    describe('#destroyAll', () => {
        it('should call #destroy on all instances of KQCab', async () => {
            const spies: sinon.SinonSpy[] = [];
            for (let i = 0; i < NUM_CABS; i++) {
                const cab = new KQCab(OTHER_PORT + i);
                const spy = sinon.spy(cab, 'destroy');
                spies.push(spy);
            }
            await KQCab.destroyAll();
            for (let spy of spies) {
                expect(spy.calledOnce).to.be.true;
                spy.restore();
            }
        });
    });
    it('should allow connections from clients', () => {
        const cab = new KQCab();
        expect(async () => {
            await createConnection();
        }).to.not.throw();
    });
    it('should allow connections from KQStream', () => {
        const cab = new KQCab();
        const stream = new KQStream();
        expect(async () => {
            await stream.connect(`ws://localhost:${KQCab.DEFAULT_PORT}`);
        }).to.not.throw();
    });
    it('should send alive messages with the correct format', async () => {
        return new Promise<void>(async (resolve, reject) => {
            const cab = new KQCab();
            const connection = await createConnection({
                onMessage: (message: string) => {
                    const now = moment().format('h:mm:ss A');
                    const expected = `![k[alive],v[${now}]]!`;
                    expect(message).to.equal(expected);
                    resolve();
                }
            });
            connection.on('close', reject);
            clock.tick(KQCab.ALIVE_INTERVAL_MS);
        });
    });
    /**
     * This test is not entirely accurate. After responding
     * to an alive message, our connection halts operations for
     * `WAIT_AFTER_MESSAGE_SEND_MS` milliseconds(1). This offsets
     * the intended `clock.tick()` by `WAIT_AFTER_MESSAGE_SEND_MS`
     * milliseconds. If this happens enough times, we will receive
     * two or more alive messages in one `clock.tick()`, which
     * gives us an incorrect `diff` value (i.e. 10000).
     * 
     * This test will pass as long as:
     * 
     * ```
     * WAIT_AFTER_MESSAGE_SEND_MS * NUM_ALIVE_INTERVALS < KQCab.ALIVE_INTERVAL_MS
     * ```
     * 
     * 1. Halting occurs in `createConnection()`
     */
    it('should send an alive message every 5 seconds', () => {
        return new Promise<void>(async (resolve) => {
            let lastMessage: moment.Moment;
            let count = 0;
            const cab = new KQCab();
            const connection = await createConnection({
                onMessage: async (message: string) => {
                    expect(message.indexOf('![k[alive]')).to.equal(0);
                    const now = moment();
                    if (lastMessage !== undefined) {
                        const diff = now.diff(lastMessage, 'ms');
                        expect(diff).to.be.closeTo(5000, 1000);
                    }
                    lastMessage = now;
                    if (++count === NUM_ALIVE_INTERVALS) {
                        resolve();
                    }
                    clock.tick(KQCab.ALIVE_INTERVAL_MS);
                }
            });
            clock.tick(KQCab.ALIVE_INTERVAL_MS);
        });
    });
    it('should send an alive message to all clients', async () => {
        const cab = new KQCab();
        const connectionPromises: Promise<websocket.connection>[] = [];
        const messagePromises: Promise<string>[] = [];
        for (let i = 0; i < NUM_CONNECTIONS; i++) {
            const messagePromise = new Promise<string>((resolve) => {
                const connectionPromise = createConnection({
                    onMessage: async (message: string) => {
                        resolve(message);
                    }
                });
                connectionPromises.push(connectionPromise);
            });
            messagePromises.push(messagePromise);
        }
        await Promise.all(connectionPromises);
        clock.tick(KQCab.ALIVE_INTERVAL_MS);
        const messages = await Promise.all(messagePromises);
        expect(messages.length).to.equal(NUM_CONNECTIONS);
        for (let message of messages) {
            expect(message.indexOf('![k[alive]')).to.equal(0);
        }
    });
    it('should disconnect a client if a message is not received between alive messages', () => {
        return new Promise<void>(async (resolve) => {
            const cab = new KQCab();
            const connection = await createConnection();
            connection.on('close', resolve);
            clock.tick(KQCab.ALIVE_INTERVAL_MS * 2);
        });
    });

    afterEach(async () => {
        await KQCab.destroyAll();
    });

    after(() => {
        clock.restore();
    });
});
