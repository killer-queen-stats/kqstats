import { KQStream } from '../src/lib/KQStream';
import { OBSData } from '../src/lib/OBSData';

const KQ_HOST = '192.168.1.100';

const stream = new KQStream();
const _obsData = new OBSData(stream);
stream.connect(`ws://${KQ_HOST}:12749`);
