import { expect } from 'chai';
import * as http from 'http';
import * as websocket from 'websocket';
import { KQStream, KQEventCallback, PlayerKill, Character } from '../src/KQStream';
import { getCiphers } from 'crypto';

const KQ_PORT = 12749;

async function sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

async function getConnection(server: websocket.server): Promise<websocket.connection> {
    return new Promise<websocket.connection>((resolve, reject) => {
        server.on('connect', (connection) => {
            resolve(connection);
        });
        server.on('request', (request) => {
            const connection = request.accept('echo-protocol');
        });
    });
}

function createServer(): websocket.server {
    const httpServer = http.createServer((request, response) => {
        response.writeHead(404);
        response.end();
    });
    httpServer.listen(KQ_PORT);
    const wsServer: websocket.server = new websocket.server({
        httpServer: httpServer,
        autoAcceptConnections: true
    });
    return wsServer;
}

describe('KQStream', () => {
    const messages: string[] = [
        '![k[playerKill],v[730,860,9,8]]!',
        '![k[playerKill],v[770,860,9,10]]!',
        '![k[playerKill],v[810,860,9,4]]!',
        '![k[playerKill],v[1071.977,20,3,10]]!'
    ];
    const kqstream = new KQStream();

    let connection: websocket.connection;

    before(async () => {
        const server = createServer();
        const [_, conn] = await Promise.all([
            kqstream.connect(`ws://localhost:${KQ_PORT}`),
            getConnection(server)
        ]);
        connection = conn;
    });

    it('should process playerKill events', async () => {
        const expectedEvents: PlayerKill[] = [{
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
        const playerKillEvents: PlayerKill[] = [];
        const onPlayerKill = (event: PlayerKill): void => {
            playerKillEvents.push(event);
        };
        kqstream.on('playerKill', onPlayerKill);
        for (let message of messages) {
            const buffer = Buffer.from(message, 'utf8');
            connection.send(buffer);
        }
        await sleep(1000);
        expect(playerKillEvents.length).to.equal(4);
        for (let expectedEvent of expectedEvents) {
            expect(playerKillEvents).to.deep.include(expectedEvent);
        }
    });
});
