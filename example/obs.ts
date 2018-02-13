import * as path from 'path';
import * as fs from 'fs';
import { KQStream } from '../src/KQStream';
import { OBSData } from '../src/OBSData';

const KQ_HOST = '192.168.1.100';

const stream = new KQStream();
const obsData = new OBSData(stream);
stream.connect(`ws://${KQ_HOST}:12749`);
