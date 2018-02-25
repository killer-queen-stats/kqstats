/**
 * Writes all messages from the Killer Queen cabinet,
 * appended with a timestamp, to log.txt.
 */

import * as fs from 'fs';
import { KQStream } from '../src/lib/KQStream';

// Change this to the IP address of the Killer Queen cabinet
const KQ_HOST = '192.168.1.100';

const stream = new KQStream({
    log: fs.createWriteStream('log.txt')
});
stream.connect(`ws://${KQ_HOST}:12749`);
