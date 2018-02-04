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

`KQStream` supports the following events:

- `playerKill`

An example of a simple killfeed:

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

See the `example` folder for more usage examples.

## Resources

- [kqdeathmap](https://github.com/arantius/kqdeathmap)
