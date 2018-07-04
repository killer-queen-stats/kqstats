import * as fs from 'fs';
import * as socket_io from 'socket.io';
import { GameStats, KQStat } from '../lib/GameStats';
import { KQCab } from '../lib/KQCab';
import { KQStream, KQStreamOptions } from '../lib/KQStream';

async function main() {
    if (process.argv.length !== 4 || ['-c', '-r'].indexOf(process.argv[2]) === -1) {
        throw new Error('Incorrect usage!');
    }
    
    const options: KQStreamOptions = {};
    if (process.env.ENV === 'development') {
        options.log = process.stdout;
    }
    
    const stream = new KQStream(options);
    const gameStats = new GameStats(stream);
    gameStats.start();
    
    let cab;
    let address;
    
    if (process.argv[2] === '-r') {
        cab = new KQCab();
        address = 'ws://localhost:12749';
    } else if (process.argv[2] === '-c') {
        address = process.argv[3];
    }
        
    await stream.connect(address as string);
    
    if (process.argv[2] === '-r') {
        (cab as KQCab).read(fs.readFileSync(process.argv[3], 'utf8'));
    }
    
    const io = socket_io(8000);
    io.on('connection', (socket) => {
        const changeListener = (data: KQStat) => {
            socket.emit('stat', data);
        };
        gameStats.on('change', changeListener);
        socket.on('disconnect', () => {
            gameStats.removeListener('change', changeListener);
        });
        gameStats.trigger('change');
    });
}

main().catch((err) => {
    setTimeout(() => {
        throw err;
    });
});
