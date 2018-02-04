"use strict";
/**
 * Many thanks to Tony for his awesome work on kqdeathmap:
 * https://github.com/arantius/kqdeathmap
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var websocket = require("websocket");
var Character;
(function (Character) {
    Character[Character["GoldQueen"] = 1] = "GoldQueen";
    Character[Character["BlueQueen"] = 2] = "BlueQueen";
    Character[Character["GoldStripes"] = 3] = "GoldStripes";
    Character[Character["BlueStripes"] = 4] = "BlueStripes";
    Character[Character["GoldAbs"] = 5] = "GoldAbs";
    Character[Character["BlueAbs"] = 6] = "BlueAbs";
    Character[Character["GoldSkulls"] = 7] = "GoldSkulls";
    Character[Character["BlueSkulls"] = 8] = "BlueSkulls";
    Character[Character["GoldChecks"] = 9] = "GoldChecks";
    Character[Character["BlueChecks"] = 10] = "BlueChecks";
})(Character = exports.Character || (exports.Character = {}));
var KQStream = /** @class */ (function () {
    function KQStream() {
    }
    KQStream.prototype.connect = function (host) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.client = new websocket.client();
                        _this.client.on('connectFailed', function (err) {
                            reject(err);
                        });
                        _this.client.on('connect', function (connection) {
                            connection.on('message', function (data) {
                                _this.processMessage(data);
                            });
                            resolve();
                        });
                        _this.client.connect(host);
                    })];
            });
        });
    };
    KQStream.prototype.processMessage = function (data) {
        var dataArray = data.binaryData.toString().match(/!\[k\[(.*?)\],v\[(.*)?\]\]!/);
        if (!dataArray) {
            console.warn('Could not parse data', data.utf8Data);
            return;
        }
        var _ = dataArray[0], key = dataArray[1], value = dataArray[2];
        switch (key) {
            case 'alive':
                this.sendMessage('im alive', null);
            case 'playerKill':
                var _a = value.split(','), x = _a[0], y = _a[1], by = _a[2], killed = _a[3];
                var playerKill = {
                    pos: {
                        x: Number(x),
                        y: Number(y)
                    },
                    killed: Number(killed),
                    by: Number(by)
                };
                if (this.onPlayerKill) {
                    this.onPlayerKill(playerKill);
                }
                break;
        }
    };
    KQStream.prototype.sendMessage = function (key, value) {
        var valueString = JSON.stringify(value);
        var message = "![k[" + key + "],v[" + valueString + "]]!";
        var buffer = Buffer.from(message, 'utf8');
        this.connection.send(buffer);
    };
    KQStream.prototype.on = function (eventType, callback) {
        switch (eventType) {
            case 'playerKill':
                this.onPlayerKill = callback;
                break;
        }
    };
    return KQStream;
}());
exports.KQStream = KQStream;
//# sourceMappingURL=KQStream.js.map