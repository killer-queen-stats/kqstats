# kqstats

Get real time statistics from your Killer Queen cabinets!

## Overview

This project consists of a Node.js server and React web app that allow you to display real-time statistics from Killer Queen games.

The web app can be integrated into your Twitch streams using the [OBS BrowserSource plugin](https://obsproject.com/forum/resources/browser-plugin.115/), which comes bundled with the latest version of OBS. See [Usage](#usage) for more information on how to set this up.

Right now the web app only displays kills and deaths for every player. More statistics will be added pending updates to Killer Queen itself.

This project also contains TypeScript classes in `src/lib` that are used by the web app, and that you can use in your own projects as well!

## Usage

### Running the web app

First, make sure you have the following software installed:

- [Node.js](https://nodejs.org/en/)

Next, [download](https://github.com/KevinSnyderCodes/kqstats/archive/master.zip) or clone this repository to your computer.

Then, using the command line, navigate to the repository folder and run the following commands:

```bash
npm install
```

Connect your computer to same network that the Killer Queen cabinet is on. Then get the local IP address of your cabinet. This IP address usually follows the format `192.168.X.X` or `10.0.X.X`.

You can find the IP address in Killer Queen's settings menu (accessed by pressing F6 on the cabinet's keyboard on the settings button behind the coin door). Navigate to "INTERNET SETUP" and you should see it listed on the left.

If you don't know or can't find the IP address, you can use [port scanning software](https://www.google.com/search?q=port+scanner+software) to find it. Scan for addresses with port `12749` open. You will probably find only one IP address with that port open, and it will be the Killer Queen cabinet.

Finally, run the following command from the repository folder, replacing `[IP_ADDRESS]` with the IP address of the cabinet:

```bash
npm run start -- -c ws://[IP_ADDRESS]:12749
```

A new page should open in your web browser. If it doesn't, navigate to [http://localhost:3000](http://localhost:3000).

### Displaying the killboard in your stream

[Open Broadcast Software](https://obsproject.com/), a popular and free software for streaming on Twitch, lets you overlay webpages in your stream. This is how we will display the killboard.

First, follow the [steps above](#running-the-web-app) to get the web app running.

There are three different killboards:

- [Full](#http://localhost:3000/killboard)
- [Blue team](#http://localhost:3000/killboard/blue)
- [Gold team](#http://localhost:3000/killboard/gold)

We're going to display blue team's killboard:

1. In OBS, under the "Sources" section, click the + button
2. Select "BrowserSource"
3. Give your source a name and click "OK"
4. Put in the following values, leaving all others the same:
  - URL: `http://localhost:3000/killboard/blue`
  - Width: `1280`
  - Height: `122`
5. Click OK

The killboard should now appear in your scene. You can move and resize it as you see fit.

## Commands

- `npm run start`: Run the server and web app. Expects one of the following arguments:
  - `-c ws://[IP_ADDRESS]:12749`: Connect to a cab
    - _Example_: `npm run start -- -c ws://192.168.0.2:12749`
  - `-r [PATH_TO_SOCKET_MESSAGE_FILE]`: Read socket messages from a file to simulate a Killer Queen cabinet. You'll find example files in `example/socket_messages`.
    - _Example_: `npm run start -- -r example/socket_messages/non_tournament_mode_games.txt`
- `npm run start:debug`: Same as `npm run start`, but outputs all raw messages from the cab to the console.
- `npm run build`: Build all TypeScript files to `build` folder
  - Useful for compiling and using the classes in `src/lib`
- `npm run clean`: Delete the `build` folder
  - Can sometimes resolve build issues
- `npm run test`: Run unit tests in `test` folder
  - Tests are run against code in the `src` folder, not the build in the `lib` folder

Other npm scripts in `package.json` are not supported at this time and may cause undesired behavior.

## Classes

### KQStream

The `KQStream` class is an [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) that processes socket messages from a Killer Queen cabinet. You can set up a callback method for each type of supported event. These callback methods receive objects that contain event data in a deserialized format.

#### ```new KQStream(options?: KQStreamOptions)```

Creates a new `KQStream` object with the specified options:

- `options.log`: a `stream.Writable` object where all messages from the cabinet, appended with a timestamp, will be written

All `options` properties are optional.

#### ```async KQStream#connect(host: string)```

Connect to the specified host and processes messages. `host` should usually follow the format: `ws://[HOST_IP]:12749`.

#### ```KQStream#read(data: string)```

Reads and processes messages from the `data` string. `data` must be the contents of a CSV file with the following format:

- First value: timestamp in milliseconds
- Second value: message from the cabinet (not wrapped in quotes)

This method simulates messages from a real Killer Queen cabinet. The first message in the `data` string is processed immediately, and processing of subsequent messages is delaed according to each message's timestamp.

#### ```KQStream#on('playerKill', callback)```

Set the callback for `playerKill` events. `callback` should accept a single parameter of type `PlayerKill`.

#### ```KQStream#on('playernames', callback)```

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
