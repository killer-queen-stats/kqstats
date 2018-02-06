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

The `KQStream` class processes socket messages from a Killer Queen cabinet. You can set up a callback method for each type of supported event. These callback methods receive data from the event in a deserialized object that can easily be used in other code.

### ```new KQStream([options])```

Creates a new `KQStream object with the specified options:

- `options.log`: a `stream.Writable` object where all messages from the cabinet, appended with a timestamp, will be written

### ```async KQStream#connect(host)```

Connect to the specified `host` string. Should usually follow the format: `ws://[HOST_IP]:12749`.

### ```KQStream#on('playerKill', callback)```

Set the callback for `playerKill` events. `callback` should accept a single parameter of type `PlayerKill`.

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
