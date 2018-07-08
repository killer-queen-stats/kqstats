import * as fs from 'fs';
import * as path from 'path';
import { KQCab } from '../src/lib/KQCab';

const cab = new KQCab();
const filepath = path.join(__dirname, 'socket_messages', 'non_tournament_mode_games.txt');
const data = fs.readFileSync(filepath, 'utf8');
cab.read(data);

// Send playernames on keypress
const stdin = process.stdin;
stdin.setRawMode!(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', (char) => {
  if (char === '\u0003') {
    process.exit();
  }
  cab.send('![k[playernames],v[,,,,,,,,,]]!');
});
