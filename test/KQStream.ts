import { expect } from 'chai';
import { KQCab } from '../src/lib/KQCab';
import { Character, Team, Maiden, GameMap, CabOrientation, VictoryType, CharacterType } from '../src/lib/models/KQStream';
import { GameEvents, KQStream } from '../src/lib/KQStream';

type TestEvents = {
    [K in keyof GameEvents]: string[];
};

type CabEvents = {
    [K in keyof GameEvents]: GameEvents[K][];
};

describe('KQStream', () => {
    const stream = new KQStream();
    const testEvents: TestEvents = {
        playernames: [
            '![k[playernames],v[,,,,,,,,,]]!'
        ],
        playerKill: [
            '![k[playerKill],v[730,860,9,8,Worker]]!',
            '![k[playerKill],v[770,860,9,10,Soldier]]!',
            '![k[playerKill],v[810,860,9,4,Worker]]!',
            '![k[playerKill],v[1071.977,20,3,10,Soldier]]!',
            '![k[playerKill],v[1071.977,20,3,1,Queen]]!'
        ],
        blessMaiden: [
            '![k[blessMaiden],v[960,500,Blue]]!',
            '![k[blessMaiden],v[960,500,Red]]!',
            '![k[blessMaiden],v[1510,860,Red]]!'
        ],
        reserveMaiden: [
            '![k[reserveMaiden],v[1360,260,8]]!',
            '![k[reserveMaiden],v[560,260,10]]!'
        ],
        unreserveMaiden: [
            '![k[unreserveMaiden],v[340,140,,3]]!',
            '![k[unreserveMaiden],v[1580,140,,8]]!'
        ],
        useMaiden: [
            '![k[useMaiden],v[560,260,maiden_wings,4]]!',
            '![k[useMaiden],v[410,860,maiden_speed,4]]!'
        ],
        glance: [
            '![k[glance],v[1,2]]!',
            '![k[glance],v[8,1]]!'
        ],
        carryFood: [
            '![k[carryFood],v[10]]!',
            '![k[carryFood],v[3]]!'
        ],
        gamestart: [
            '![k[gamestart],v[map_day,True,0,False]]!',
            '![k[gamestart],v[map_night,True,0,False]]!',
            '![k[gamestart],v[map_dusk,True,0,False]]!'
        ],
        gameend: [
            '![k[gameend],v[map_day,True,59.73758,False]]!',
            '![k[gameend],v[map_night,True,103.5066,False]]!',
            '![k[gameend],v[map_dusk,True,139.3835,False]]!'
        ],
        victory: [
            '![k[victory],v[Gold,military]]!',
            '![k[victory],v[Blue,economic]]!',
            '![k[victory],v[Blue,snail]]!'
        ],
        spawn: [
            '![k[spawn],v[1,False]]!',
            '![k[spawn],v[3,True]]!'
        ],
        getOnSnail: [
            '![k[getOnSnail: ],v[960,11,7]]!',
            '![k[getOnSnail: ],v[708,11,9]]!'
        ],
        getOffSnail: [
            '![k[getOffSnail: ],v[1135,11,,7]]!',
            '![k[getOffSnail: ],v[708,11,,3]]!'
        ],
        snailEat: [
            '![k[snailEat],v[352,11,9,4]]!',
            '![k[snailEat],v[861,11,7,10]]!'
        ],
        snailEscape: [
            '![k[snailEscape],v[730,371,7]]!',
            '![k[snailEscape],v[609,371,10]]!'
        ],
        berryDeposit: [
            '![k[berryDeposit],v[1083,736,6]]!',
            '![k[berryDeposit],v[867,711,5]]!'
        ],
        berryKickIn: [
            '![k[berryKickIn],v[1699,153,2]]!',
            '![k[berryKickIn],v[1086,765,1]]!'
        ]
    };
    const expectedEvents: CabEvents = {
        playernames: [{}],
        playerKill: [
            {
                pos: {
                    x: 770,
                    y: 860
                },
                killed: Character.BlueChecks,
                by: Character.GoldChecks,
                killedCharType: CharacterType.Soldier
            },
            {
                pos: {
                    x: 770,
                    y: 860
                },
                killed: Character.BlueChecks,
                by: Character.GoldChecks,
                killedCharType: CharacterType.Soldier
            },
            {
                pos: {
                    x: 810,
                    y: 860
                },
                killed: Character.BlueStripes,
                by: Character.GoldChecks,
                killedCharType: CharacterType.Worker
            },
            {
                pos: {
                    x: 1071.977,
                    y: 20
                },
                killed: Character.BlueChecks,
                by: Character.GoldStripes,
                killedCharType: CharacterType.Soldier
            },
            {
                pos: {
                    x: 1071.977,
                    y: 20
                },
                killed: Character.GoldQueen,
                by: Character.GoldStripes,
                killedCharType: CharacterType.Queen
            }
        ],
        blessMaiden: [
            {
                pos: {
                    x: 960,
                    y: 500
                },
                team: Team.Blue
            },
            {
                pos: {
                    x: 960,
                    y: 500
                },
                team: Team.Gold
            },
            {
                pos: {
                    x: 1510,
                    y: 860
                },
                team: Team.Gold
            }
        ],
        reserveMaiden: [
            {
                pos: {
                    x: 1360,
                    y: 260
                },
                character: Character.BlueSkulls
            },
            {
                pos: {
                    x: 560,
                    y: 260
                },
                character: Character.BlueChecks
            }
        ],
        unreserveMaiden: [
            {
                pos: {
                    x: 340,
                    y: 140
                },
                character: Character.GoldStripes
            },
            {
                pos: {
                    x: 1580,
                    y: 140
                },
                character: Character.BlueSkulls
            }
        ],
        useMaiden: [
            {
                pos: {
                    x: 560,
                    y: 260
                },
                type: Maiden.Warrior,
                character: Character.BlueStripes
            },
            {
                pos: {
                    x: 410,
                    y: 860
                },
                type: Maiden.Speed,
                character: Character.BlueStripes
            }
        ],
        glance: [
            {
                attacker: Character.GoldQueen,
                target: Character.BlueQueen
            },
            {
                attacker: Character.BlueSkulls,
                target: Character.GoldQueen
            }
        ],
        carryFood: [
            {
                character: Character.BlueChecks
            },
            {
                character: Character.GoldStripes
            }
        ],
        gamestart: [
            {
                map: GameMap.Day,
                orientation: CabOrientation.GoldOnLeft
            },
            {
                map: GameMap.Night,
                orientation: CabOrientation.GoldOnLeft
            },
            {
                map: GameMap.Dusk,
                orientation: CabOrientation.GoldOnLeft
            }
        ],
        gameend: [
            {
                map: GameMap.Day,
                orientation: CabOrientation.GoldOnLeft,
                duration: 59.73758
            },
            {
                map: GameMap.Night,
                orientation: CabOrientation.GoldOnLeft,
                duration: 103.5066
            },
            {
                map: GameMap.Dusk,
                orientation: CabOrientation.GoldOnLeft,
                duration: 139.3835
            }
        ],
        victory: [
            {
                team: Team.Gold,
                type: VictoryType.Military
            },
            {
                team: Team.Blue,
                type: VictoryType.Econimic
            },
            {
                team: Team.Blue,
                type: VictoryType.Snail
            }
        ],
        spawn: [
            {
                character: Character.GoldQueen,
                isAI: false
            },
            {
                character: Character.GoldStripes,
                isAI: true
            }
        ],
        getOnSnail: [
            {
                pos: {
                    x: 960,
                    y: 11
                },
                character: Character.GoldSkulls
            },
            {
                pos: {
                    x: 708,
                    y: 11
                },
                character: Character.GoldChecks
            }
        ],
        getOffSnail: [
            {
                pos: {
                    x: 1135,
                    y: 11
                },
                character: Character.GoldSkulls
            },
            {
                pos: {
                    x: 708,
                    y: 11
                },
                character: Character.GoldStripes
            }
        ],
        snailEat: [
            {
                pos: {
                    x: 352,
                    y: 11
                },
                rider: Character.GoldChecks,
                eaten: Character.BlueStripes
            },
            {
                pos: {
                    x: 861,
                    y: 11
                },
                rider: Character.GoldSkulls,
                eaten: Character.BlueChecks
            }
        ],
        snailEscape: [
            {
                pos: {
                    x: 730,
                    y: 371
                },
                character: Character.GoldSkulls
            },
            {
                pos: {
                    x: 609,
                    y: 371
                },
                character: Character.BlueChecks
            }
        ],
        berryDeposit: [
            {
                pos: {
                    x: 1083,
                    y: 736
                },
                character: Character.BlueAbs
            },
            {
                pos: {
                    x: 867,
                    y: 711
                },
                character: Character.GoldAbs
            }
        ],
        berryKickIn: [
            {
                pos: {
                    x: 1699,
                    y: 153
                },
                character: Character.BlueQueen
            },
            {
                pos: {
                    x: 1086,
                    y: 765
                },
                character: Character.GoldQueen
            }
        ]
    };

    describe('#connect', () => {
        const receivedEvents = {
            playernames: [],
            playerKill: [],
            blessMaiden: [],
            reserveMaiden: [],
            unreserveMaiden: [],
            useMaiden: [],
            glance: [],
            carryFood: [],
            gamestart: [],
            gameend: [],
            victory: [],
            spawn: [],
            getOnSnail: [],
            getOffSnail: [],
            snailEat: [],
            snailEscape: [],
            berryDeposit: [],
            berryKickIn: [],
        };

        before(async () => {
            const cab = new KQCab();
            await stream.connect(`ws://localhost:${KQCab.DEFAULT_PORT}`);

            for (let k of Object.keys(testEvents)) {
                const key = k as keyof TestEvents;
                const messages = testEvents[key];
                for (let message of messages) {
                    await new Promise<void>((resolve) => {
                        stream.once(key, (arg) => {
                            (receivedEvents[key] as any).push(arg);
                            resolve();
                        });
                        cab.send(message);
                    });
                }
            }
        });

        for (let k of Object.keys(receivedEvents)) {
            const key = k as keyof CabEvents;
            it(`should process ${key} events`, async () => {
                expect(receivedEvents[key].length).to.equal(expectedEvents[key].length);
                for (let expectedEvent of expectedEvents[key]) {
                    expect(receivedEvents[key]).to.deep.include(expectedEvent);
                }
            });
        }

        after(() => {
            stream.removeAllListeners();
        });
    });
});
