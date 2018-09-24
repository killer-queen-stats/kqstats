import * as fs from 'fs';
import { Netmask } from 'netmask';
import * as os from 'os';
import * as portscanner from 'portscanner';
import * as socket_io from 'socket.io';
import { GameStats, KQStat } from '../lib/GameStats';
import { KQCab } from '../lib/KQCab';
import { KQStream, KQStreamOptions } from '../lib/KQStream';
import { GameManager } from '../lib/GameManager';
import { Team } from '../lib/models/KQStream';
import { Hive } from '../lib/models/Hive';

const WAIT_SCAN_S = 10;
const WAIT_CONNECT_S = 10;

function getLocalIps(): string[] {
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

async function filterIpsByOpenPort(ips: string[], port: number): Promise<string[]> {
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

async function getCandidateIps(): Promise<string[]> {
    const localIps = getLocalIps();
    return await filterIpsByOpenPort(localIps, 12749);
}

async function getConnectionIp(): Promise<string> {
    console.log('Scanning for candidate IPs on local network...');
    const candidateIps = await getCandidateIps();
    console.log(`Found ${candidateIps.length} candidate IPs`);
    if (candidateIps.length === 0) {
        console.log(`Waiting ${WAIT_SCAN_S} seconds to rescan...`);
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve(getConnectionIp());
            }, WAIT_SCAN_S * 1000);
        });
    } else {
        console.log(`Using first IP found: ${candidateIps[0]}`);
        return candidateIps[0];
    }
}

async function connect(stream: KQStream, address: string) {
    if (address === undefined) {
        const ip = await getConnectionIp();
        address = `ws://${ip}:12749`;
    }
    console.log(`Connecting to ${address}...`);
    try {
        await stream.connect(address);
    } catch (error) {
        console.log(`Connection failed, waiting ${WAIT_CONNECT_S} seconds...`);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve(connect(stream, address));
            }, WAIT_CONNECT_S * 1000);
        });
    }
    console.log('Connected!');
}

async function main() {
    if (
        !(process.argv.length === 4 || process.argv.length === 2) ||
        (process.argv.length === 4 && ['-c', '-r'].indexOf(process.argv[2]) === -1)
    ) {
        throw new Error('Incorrect usage!');
    }
    
    const options: KQStreamOptions = {};
    if (process.env.ENV === 'development') {
        options.log = process.stdout;
    }
    
    const stream = new KQStream(options);
    const gameManager = new GameManager(stream);
    let prevInterval: NodeJS.Timer;
    gameManager.on('game', (game) => {
        clearInterval(prevInterval);
        prevInterval = setInterval(() => {
            if (
                game.hives !== undefined &&
                game.hives[Team.Blue] !== undefined
            ) {
                const hiveBlue = game.hives[Team.Blue] as Hive;
                const hiveGold = game.hives[Team.Gold] as Hive;
                console.log(hiveGold.berryDeposits, hiveBlue.berryDeposits);
            }
        }, 1000);
    });
    
    // const io = socket_io(8000);
    // io.on('connection', (socket) => {
    //     const changeListener = (data: KQStat) => {
    //         socket.emit('stat', data);
    //     };
    //     gameStats.on('change', changeListener);
    //     socket.on('disconnect', () => {
    //         gameStats.removeListener('change', changeListener);
    //     });
    //     gameStats.trigger('change');
    // });

    if (process.argv.length === 2) {
        process.argv[2] = '-c';
    }
    
    if (process.argv[2] === '-r') {
        const cab = new KQCab();
        const address = 'ws://localhost:12749';
        await stream.connect(address);
        cab.read(fs.readFileSync(process.argv[3], 'utf8'));
    } else if (process.argv[2] === '-c') {
        const address = process.argv[3];
        stream.on('connectionError', (data) => {
            if (!data.connected) {
                console.log('Lost connection!');
                // gameStats.start();
                connect(stream, address);
            }
        });
        connect(stream, address);
    }
}

main().catch((err) => {
    setTimeout(() => {
        throw err;
    });
});
