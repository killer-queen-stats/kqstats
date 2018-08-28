import { expect } from 'chai';
import { KQCab } from '../src/lib/KQCab';
import { Character, Team, Maiden, GameMap, CabOrientation, VictoryType } from '../src/lib/models/KQStream';
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
            '![k[playerKill],v[730,860,9,8]]!',
            '![k[playerKill],v[770,860,9,10]]!',
            '![k[playerKill],v[810,860,9,4]]!',
            '![k[playerKill],v[1071.977,20,3,10]]!'
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
                by: Character.GoldChecks
            },
            {
                pos: {
                    x: 770,
                    y: 860
                },
                killed: Character.BlueChecks,
                by: Character.GoldChecks
            },
            {
                pos: {
                    x: 810,
                    y: 860
                },
                killed: Character.BlueStripes,
                by: Character.GoldChecks
            },
            {
                pos: {
                    x: 1071.977,
                    y: 20
                },
                killed: Character.BlueChecks,
                by: Character.GoldStripes
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
                orientation: CabOrientation.GoldBlue
            },
            {
                map: GameMap.Night,
                orientation: CabOrientation.GoldBlue
            },
            {
                map: GameMap.Dusk,
                orientation: CabOrientation.GoldBlue
            }
        ],
        gameend: [
            {
                map: GameMap.Day,
                orientation: CabOrientation.GoldBlue,
                duration: 59.73758
            },
            {
                map: GameMap.Night,
                orientation: CabOrientation.GoldBlue,
                duration: 103.5066
            },
            {
                map: GameMap.Dusk,
                orientation: CabOrientation.GoldBlue,
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

    let receivedEvents: CabEvents;

    describe('#connect', () => {
        before(async () => {
            receivedEvents = {
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

        it('should process playernames events', async () => {
            expect(receivedEvents.playernames.length).to.equal(1);
            for (let expectedEvent of expectedEvents.playernames) {
                expect(receivedEvents.playernames).to.deep.include(expectedEvent);
            }
        });

        it('should process playerKill events', async () => {
            expect(receivedEvents.playerKill.length).to.equal(4);
            for (let expectedEvent of expectedEvents.playerKill) {
                expect(receivedEvents.playerKill).to.deep.include(expectedEvent);
            }
        });

        it('should process blessMaiden events', async () => {
            expect(receivedEvents.blessMaiden.length).to.equal(3);
            for (let expectedEvent of expectedEvents.blessMaiden) {
                expect(receivedEvents.blessMaiden).to.deep.include(expectedEvent);
            }
        });

        it('should process reserveMaiden events', async () => {
            expect(receivedEvents.reserveMaiden.length).to.equal(2);
            for (let expectedEvent of expectedEvents.reserveMaiden) {
                expect(receivedEvents.reserveMaiden).to.deep.include(expectedEvent);
            }
        });

        it('should process unreserveMaiden events', async () => {
            expect(receivedEvents.unreserveMaiden.length).to.equal(2);
            for (let expectedEvent of expectedEvents.unreserveMaiden) {
                expect(receivedEvents.unreserveMaiden).to.deep.include(expectedEvent);
            }
        });

        it('should process useMaiden events', async () => {
            expect(receivedEvents.useMaiden.length).to.equal(2);
            for (let expectedEvent of expectedEvents.useMaiden) {
                expect(receivedEvents.useMaiden).to.deep.include(expectedEvent);
            }
        });

        it('should process glance events', async () => {
            expect(receivedEvents.glance.length).to.equal(2);
            for (let expectedEvent of expectedEvents.glance) {
                expect(receivedEvents.glance).to.deep.include(expectedEvent);
            }
        });
        
        it('should process carryFood events', async () => {
            expect(receivedEvents.carryFood.length).to.equal(2);
            for (let expectedEvent of expectedEvents.carryFood) {
                expect(receivedEvents.carryFood).to.deep.include(expectedEvent);
            }
        });

        it('should process gamestart events', async () => {
            expect(receivedEvents.gamestart.length).to.equal(3);
            for (let expectedEvent of expectedEvents.gamestart) {
                expect(receivedEvents.gamestart).to.deep.include(expectedEvent);
            }
        });

        it('should process gameend events', async () => {
            expect(receivedEvents.gameend.length).to.equal(3);
            for (let expectedEvent of expectedEvents.gameend) {
                expect(receivedEvents.gameend).to.deep.include(expectedEvent);
            }
        });

        it('should process victory events', async () => {
            expect(receivedEvents.victory.length).to.equal(3);
            for (let expectedEvent of expectedEvents.victory) {
                expect(receivedEvents.victory).to.deep.include(expectedEvent);
            }
        });

        it('should process spawn events', async () => {
            expect(receivedEvents.spawn.length).to.equal(2);
            for (let expectedEvent of expectedEvents.spawn) {
                expect(receivedEvents.spawn).to.deep.include(expectedEvent);
            }
        });

        it('should process getOnSnail events', async () => {
            expect(receivedEvents.getOnSnail.length).to.equal(2);
            for (let expectedEvent of expectedEvents.getOnSnail) {
                expect(receivedEvents.getOnSnail).to.deep.include(expectedEvent);
            }
        });

        it('should process getOffSnail events', async () => {
            expect(receivedEvents.getOffSnail.length).to.equal(2);
            for (let expectedEvent of expectedEvents.getOffSnail) {
                expect(receivedEvents.getOffSnail).to.deep.include(expectedEvent);
            }
        });

        it('should process snailEat events', async () => {
            expect(receivedEvents.snailEat.length).to.equal(2);
            for (let expectedEvent of expectedEvents.snailEat) {
                expect(receivedEvents.snailEat).to.deep.include(expectedEvent);
            }
        });

        it('should process snailEscape events', async () => {
            expect(receivedEvents.snailEscape.length).to.equal(2);
            for (let expectedEvent of expectedEvents.snailEscape) {
                expect(receivedEvents.snailEscape).to.deep.include(expectedEvent);
            }
        });

        it('should process berryDeposit events', async () => {
            expect(receivedEvents.berryDeposit.length).to.equal(2);
            for (let expectedEvent of expectedEvents.berryDeposit) {
                expect(receivedEvents.berryDeposit).to.deep.include(expectedEvent);
            }
        });

        it('should process berryKickIn events', async () => {
            expect(receivedEvents.berryKickIn.length).to.equal(2);
            for (let expectedEvent of expectedEvents.berryKickIn) {
                expect(receivedEvents.berryKickIn).to.deep.include(expectedEvent);
            }
        });

        after(() => {
            stream.removeAllListeners();
        });
    });
});
