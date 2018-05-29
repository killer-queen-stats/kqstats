import * as http from 'http';
import * as moment from 'moment';
import * as websocket from 'websocket';

interface Client {
    connection: websocket.connection;
    isAlive: boolean;
}

/**
 * Mock Killer Queen cabinet for unit testing.
 * Creates a server that can be connected to using `KQStream#connect`.
 * Use `KQCab#send` to send messages to connected clients.
 * 
 * ## Example
 * 
 * ```ts
 * const cab = new KQCab(); // Listens on port 12749
 * const stream = new KQStream();
 * stream.connect('ws://localhost:12749');
 * 
 * const otherCab = new KQCab(); // Error -- Port 12749 already in use
 * const otherCab = new KQCab(12750); // OK -- Port 12750 not in use
 * ```
 * 
 * ## Assumptions
 * 
 * - Any message that the cab receives is an indicator that the connection
 *   is still alive, regardless of format.
 * - The cab sends an `alive` message to all connections at the same time,
 *   instead of creating a new 5 second interval for each connection.
 * - If a client does not respond to the `alive` message within 5 seconds,
 *   the connection is closed. (This may not use the right `reasonCode`.)
 */
export class KQCab {
    static readonly DEFAULT_PORT = 12749;
    static readonly ALIVE_INTERVAL_MS = 5000;

    private static cabs: KQCab[] = [];

    private httpServer: http.Server;
    private server: websocket.server;
    private clients: Client[];
    private aliveTimer: NodeJS.Timer;

    /**
     * Destroys all `KQCab` objects that have been instantiated.
     */
    static async destroyAll(): Promise<void[]> {
        const cabs = KQCab.cabs.slice();
        const calls: Promise<void>[] = [];
        for (let cab of cabs) {
            calls.push(cab.destroy());
        }
        return Promise.all(calls);
    }

    /**
     * Returns a find method that finds a `Client` object with a matching connection.
     * For use with `Array#find`, `Array#findIndex`, and comparable methods.
     * 
     * @param connection The connection to find in a client
     */
    private static findClient(connection: websocket.connection) {
        return (elem: Client) => {
            return elem.connection === connection;
        };
    }

    /**
     * Returns a `websocket.server` that accepts connections
     * on the specified port.
     * 
     * @param port The port to accept connections on
     */
    private static createServer(port: number): [http.Server, websocket.server] {
        const httpServer = http.createServer((request, response) => {
            response.writeHead(404);
            response.end();
        });
        httpServer.listen(port);
        const wsServer: websocket.server = new websocket.server({
            httpServer: httpServer,
            autoAcceptConnections: true
        });
        wsServer.on('request', (request) => {
            request.accept('echo-protocol');
        });
        return [httpServer, wsServer];
    }

    /**
     * Creates a server using the specified port.
     * 
     * @param port The port for the server to listen for connections. Default: 12749
     */
    constructor(port: number = KQCab.DEFAULT_PORT) {
        [this.httpServer, this.server] = KQCab.createServer(port);
        this.clients = [];
        this.server.on('connect', (connection) => {
            const client = {
                connection: connection,
                isAlive: true
            };
            this.clients.push(client);
            connection.on('close', () => {
                this.disconnect(connection);
            });
            connection.on('message', (message) => {
                const thisClient = this.clients.find(KQCab.findClient(connection)) as Client;
                thisClient.isAlive = true;
            });
        });
        this.aliveTimer = setInterval(this.isAlive.bind(this) as (...args: any[]) => void, 5000);
        KQCab.cabs.push(this);
    }

    /**
     * Sends a raw message to all clients.
     * 
     * @param message The raw message to send
     */
    send(message: string): void {
        for (let client of this.clients) {
            client.connection.sendUTF(message);
        }
    }

    /**
     * Destroys the server, freeing the port that was in use.
     * 
     * Calling this method renders the `KQCab` object unusable.
     * The object should then be disposed of.
     */
    async destroy(): Promise<void> {
        return new Promise<void>((resolve) => {
            clearInterval(this.aliveTimer);
            this.server.shutDown();
            this.httpServer.close(resolve);
            const i = KQCab.cabs.findIndex((elem) => {
                return elem === this;
            });
            KQCab.cabs.splice(i, 1);
        });
    }

    /**
     * Sends an `alive` message to all active clients and indicates
     * that none of them have yet responded. If `Client.isAlive`
     * indicates that the client did not respond to the last
     * `alive` message, the client is disconnected.
     */
    private isAlive(): void {
        const clients = this.clients.slice();
        for (let client of clients) {
            if (client.isAlive) {
                client.isAlive = false;
                const now = moment().format('h:mm:ss A');
                client.connection.sendUTF(`![k[alive],v[${now}]]!`);
            } else {
                this.disconnect(client.connection);
            }
        }
    }

    /**
     * Closes a connection and removes the client from `this.clients`.
     * 
     * @param connection The connection to close and remove
     */
    private disconnect(connection: websocket.connection): void {
        connection.close();
        const i = this.clients.findIndex(KQCab.findClient(connection));
        if (i !== -1) {
            this.clients.splice(i, 1);
        }
    }
}
