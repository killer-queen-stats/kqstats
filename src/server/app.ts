import * as fs from 'fs';
import { Netmask } from 'netmask';
import * as os from 'os';
import * as portscanner from 'portscanner';
import * as socket_io from 'socket.io';
import { GameStats, KQStat } from '../lib/GameStats';
import { KQCab } from '../lib/KQCab';
import { KQStream, KQStreamOptions } from '../lib/KQStream';

function getLocalIpAddresses(): string[] {
    const res: string[] = [];
    const ifaces = os.networkInterfaces();
    for (let name of Object.keys(ifaces)) {
        const iface = ifaces[name];
        for (let info of iface)  {
            if (info.family === 'IPv4' && !info.internal) {
                const block = new Netmask(`${info.address}/24`);
                block.forEach((ip) => {
                    res.push(ip);
                });
            }
        }
    }
    return res;
}

async function getCandidateIps(ips: string[], port: number): Promise<string[]> {
    const res: string[] = [];
    const promises = ips.map(async (ip) => {
        try {
            const status = await portscanner.checkPortStatus(port, ip, {
                timeout: 5000
            });
            if (status === 'open') {
                res.push(ip);
            }
        } catch {
            return;
        }
    });
    await Promise.all(promises);
    return res;
}

async function main() {
    if (
        !(process.argv.length === 4 || process.argv.length === 2) ||
        (process.argv.length === 4 && ['-c', '-r'].indexOf(process.argv[2]) === -1)
    ) {
        throw new Error('Incorrect usage!');
    }

    if (process.argv.length === 2) {
        process.argv[2] = '-c';
        const localIps = getLocalIpAddresses();
        const candidateIps = await getCandidateIps(localIps, 12749);
        if (candidateIps.length === 0) {
            throw new Error('Could not find a Killer Queen cabinet on the local network');
        }
        process.argv[3] = `ws://${candidateIps[0]}:12749`;
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
