import { KQStream, PlayerKill, Character } from '../src/KQStream';

// Change this to the IP address of the Killer Queen cabinet
const KQ_HOST = 'localhost';

const characterNames = {
    [Character.GoldQueen]: 'Gold Queen',
    [Character.BlueQueen]: 'Blue Queen',
    [Character.GoldStripes]: 'Gold Stripes',
    [Character.BlueStripes]: 'Blue Stripes',
    [Character.GoldAbs]: 'Gold Abs',
    [Character.BlueAbs]: 'Blue Abs',
    [Character.GoldSkulls]: 'Gold Skull',
    [Character.BlueSkulls]: 'Blue Skull',
    [Character.GoldChecks]: 'Gold Checks',
    [Character.BlueChecks]: 'Blue Checks'
};

const stream = new KQStream();
stream.on('playerKill', (event: PlayerKill) => {
    const victor = characterNames[event.by];
    const vainquished = characterNames[event.killed];
    console.log(`${victor} killed ${vainquished} at ${event.pos.x},${event.pos.y}`);
});
stream.connect(`ws://${KQ_HOST}:12749`);
