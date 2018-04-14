import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as socket_io from 'socket.io';
import { KQStream, KQStreamOptions } from '../lib/KQStream';
import { GameStats } from '../lib/GameStats';

if (process.argv.length !== 4) {
    throw new Error('Incorrect usage!');
}

const options: KQStreamOptions = {};
if (process.env.ENV === 'development') {
    options.log = process.stdout;
}

const stream = new KQStream(options);
const gameStats = new GameStats(stream);
gameStats.start();

if (process.argv[2] === '-r') {
    stream.read(fs.readFileSync(process.argv[3], 'utf8'));
} else if (process.argv[2] === '-c') {
    stream.connect(process.argv[3]).catch((error) => {
        // Such a hack, but it will throw the error
        // and stop execution of server and client,
        // as desired.
        setTimeout(() => {
            throw error;
        });
    });
} else {
    throw new Error('Invalid argument!');
}

const io = socket_io(8000);
io.on('connection', (socket) => {
    const id = gameStats.on('change', (data) => {
        socket.emit('stat', data);
    });
    socket.on('disconnect', () => {
        gameStats.off('change', id);
    });
    gameStats.trigger('change');
});
