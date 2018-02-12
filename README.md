# kqstats

Get real time statistics from your Killer Queen cabinets!

## Commands

- `npm run build`: Build the `src` folder to `lib`
  - `npm run build:example`: Build the `example` folder to `example/build`
- `npm run clean`: Delete the `lib` folder (can sometimes fix issues with a bad build)
  - `npm run clean:example`: Delete the `example/build` folder
- `npm run test`: Run unit tests in `test` folder
  - Tests are run against code in the `src` folder, not the build in the `lib` folder

## Usage

The `KQStream` class processes socket messages from a Killer Queen cabinet. You can set up a callback method for each type of supported event. These callback methods receive objects that contain event data in a deserialized format.

### ```new KQStream(options?: KQStreamOptions)```

Creates a new `KQStream` object with the specified options:

- `options.log`: a `stream.Writable` object where all messages from the cabinet, appended with a timestamp, will be written

All `options` properties are optional.

### ```async KQStream#connect(host: string)```

Connect to the specified host and processes messages. `host` should usually follow the format: `ws://[HOST_IP]:12749`.

### ```KQStream#read(data: string)```

Reads and processes messages from the `data` string. `data` must be the contents of a CSV file with the following format:

- First value: timestamp in milliseconds
- Second value: message from the cabinet (not wrapped in quotes)

This method simulates messages from a real Killer Queen cabinet. The first message in the `data` string is processed immediately, and processing of subsequent messages is delaed according to each message's timestamp.

### ```KQStream#on('playerKill', callback)```

Set the callback for `playerKill` events. `callback` should accept a single parameter of type `PlayerKill`.

### ```KQStream#on('playernames', callback)```

Set the callback for `playernames` events. `callback` should accept a single parameter of type `PlayerNames`.

## Examples

Simple killfeed:

```ts
import { KQStream, PlayerKill, Character } from '../src/KQStream';

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
stream.connect(`ws://localhost:12749`);
```

Logging all cabinet messages to a file:

```ts
import * as fs from 'fs';
import { KQStream } from '../src/KQStream';

const stream = new KQStream({
    log: fs.createWriteStream('log.txt')
});
stream.connect(`ws://localhost:12749`);
```

See the `example` folder for more usage examples.

## Resources

- [kqdeathmap](https://github.com/arantius/kqdeathmap)
