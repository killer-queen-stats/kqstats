"use strict";
exports.__esModule = true;
var KQStream_1 = require("../src/KQStream");
// Change this to the IP address of the Killer Queen cabinet
var KQ_HOST = 'localhost';
var characterNames = (_a = {},
    _a[KQStream_1.Character.GoldQueen] = 'Gold Queen',
    _a[KQStream_1.Character.BlueQueen] = 'Blue Queen',
    _a[KQStream_1.Character.GoldStripes] = 'Gold Stripes',
    _a[KQStream_1.Character.BlueStripes] = 'Blue Stripes',
    _a[KQStream_1.Character.GoldAbs] = 'Gold Abs',
    _a[KQStream_1.Character.BlueAbs] = 'Blue Abs',
    _a[KQStream_1.Character.GoldSkulls] = 'Gold Skull',
    _a[KQStream_1.Character.BlueSkulls] = 'Blue Skull',
    _a[KQStream_1.Character.GoldChecks] = 'Gold Checks',
    _a[KQStream_1.Character.BlueChecks] = 'Blue Checks',
    _a);
var stream = new KQStream_1.KQStream();
stream.on('playerKill', function (event) {
    var victor = characterNames[event.by];
    var vainquished = characterNames[event.killed];
    console.log(victor + " killed " + vainquished + " at " + event.pos.x + "," + event.pos.y);
});
stream.connect("ws://" + KQ_HOST + ":12749");
var _a;
//# sourceMappingURL=killfeed.js.map