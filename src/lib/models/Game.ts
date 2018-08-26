export type GameSideType = 'gold' | 'blue' | 'neutral';
export type GameMapType = 'day' | 'night' | 'dusk';

export type GameCoordsType = {
    x: number;
    y: number;
}

export class Game {
    constructor(mapType: GameMapType, blueOnLeft: boolean) {
        super();
        this.mapType:GameMapType = mapType;

        this.players = [];
        this.gates = this.createGateTypes(this.mapType);
        this.hives = Hive.createHives();
        this.snail = this.createSnail(this.mapType);

        // Call these guys left side and right side
        // Since there's no guarantee that gold or blue is on left or right
        if (blueOnLeft) {
            this.leftSide: GameSideType = 'blue';
            this.rightSide: GameSideType = 'gold';
        } else {
            this.leftSide: GameSideType = 'gold';
            this.rightSide: GameSideType = 'blue';
        }
    }

    private createSnail(mapType: GameMapType) {
        // Note all the bonus maps are also "day"
        if (mapType === 'day') {
            return Snail.createDaySnail();
        } else if (mapType === 'night') {
            return Snail.createNightSnail();
        } else if (mapType === 'dusk') {
            return Snail.createDuskSnail();
        }
        else null;
    }
    private createGates(mapType: GameMapType) {
        if (mapType === 'day') {
            return Gate.createDayGates();
        } else if (mapType === 'night') {
            return Gate.createNightGates();
        } else if (mapType === 'dusk') {
            return Gate.createDuskGates();
        }
        return [];
    }
}

export type SnailStateType = {
    coords: GameCoordsType;
    posession: GameSideType;
};

export class Snail {
    static createDaySnail() {
        return new Snail({
            x: 960,
            y: 11,
        });
    }
    static createNightSnail() {
        return new Snail({
            x: 960,
            y: 491,
        });
    }
    static createDuskSnail() {
        return new Snail({
            x: 960,
            y: 11,
        });

    }
    constructor(coords: GameCoordsType) {
        super();

        this.coords: GameGoordsType = coords;
        this.startPosition: GameCoordsType = coords;
        this.posession: GameSideType = 'neutral';
    }

    update(updatePayload: SnailStateType) {
        this.coords = updatePayload.coords;
        this.possession = this.possession;
    }

    deriveSideClosest(): number {
        if (this.coords.x < this.startPosition.x) {
            return -1
        } else if(this.coords.x > this.startPosition.x) {
            return 1;
        }
        return 0;
    }
}

export type GateTypeType = 'speed' | 'warrior';

export type GateStateType {
    gateType: GateTypeType;
    coords: GameCoordsType;
    posession: GameSideType;
}

export class Gate() {
    static createDayGates() {
        return [
            new Gate('warrior', {x: 560, y: 260}),
            new Gate('warrior', {x: 960, y: 500}),
            new Gate('warrior', {x: 1360, y: 260}),
            new Gate('speed', {x: 410, y: 860}),
            new Gate('speed', {x: 1510, y: 860}),
        ];
    }
    static createNightGates() {
        return [
            new Gate('warrior', {x: 700, y: 260}),
            new Gate('warrior', {x: 960, y: 700}),
            new Gate('warrior', {x: 1220, y: 260}),
            new Gate('speed', {x: 170, y: 740}),
            new Gate('speed', {x: 1750, y: 740}),
        ];
    }
    static createDuskGates() {
        return [
            new Gate('warrior', {x: 310, y: 620}),
            new Gate('warrior', {x: 960, y: 140}),
            new Gate('warrior', {x: 1610, y: 620}),
            new Gate('speed', {x: 340, y: 140}),
            new Gate('speed', {x: 1580, y: 140}),
        ];
    }
    constructor(gateType: GateTypeType, coords: GameCoordsType) {
        super();
        this.gateType: GateTypeType = gateType;
        this.coords: GameCoordsType = coords;
        this.posession: GameSideType = neutral;
    }

    changePosession(side: GameSideType) {
        this.posession = side;
    }
}

export class Hive() {
    static createHives() {
        return [
            new Hive('blue'),
            new Hive('gold'),
        ]
    }

    constructor(side: GameSideType) {
        super();
        this.side: GameSideType = side;
        this.emptyHoles: number = 12;
        this.filledHoles: number = 0;
    }

    fillHole() {
        this.emptyHoles--;
        this.filledHoles++;
    }
}
