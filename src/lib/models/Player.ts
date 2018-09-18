import { Character as CharacterEnum } from './KQStream';

type Kill = {
    victim: CharacterEnum
};

type Death = {
    killer: CharacterEnum
};

type PlayerOptions = {
    character: CharacterEnum
};

export class Player {
    private _character: CharacterEnum;
    get character(): CharacterEnum {
        return this._character;
    }
    // private _kills: Kill[];
    // get kills(): Kill[] {
    //     return this._kills;
    // }
    // private _deaths: Death[];
    // get deaths(): Death[] {
    //     return this._deaths;
    // }
    private _berryDeposits: number;
    get berryDeposits(): number {
        return this._berryDeposits;
    }
    private _berryKickIns: number;
    get berryKickIns(): number {
        return this._berryKickIns;
    }
    get berries(): number {
        return this._berryDeposits + this._berryKickIns;
    }
    private _isHuman: boolean;
    get isHuman(): boolean {
        return this._isHuman;
    }
    private _isSpeed: boolean;
    get isSpeed(): boolean {
        return this._isSpeed;
    }
    private _isWarrior: boolean;
    get isWarrior(): boolean {
        return this._isWarrior;
    }
    private _onSnail: boolean;
    get onSnail(): boolean {
        return this._onSnail;
    }
    private _hasBerry: boolean;
    get hasBerry(): boolean {
        return this._hasBerry;
    }

    constructor(options: PlayerOptions) {
        this._character = options.character;
        // this._kills = [];
        // this._deaths = [];
        this._berryDeposits = 0;
        this._berryKickIns = 0;
        this._isHuman = true;
        this.resetState();
    }

    kill() {
        this.resetState();
    }
    depositBerry() {
        if (this._isWarrior) {
            throw new WarriorCanNotDepositBerryError();
        } else if (this._onSnail) {
            throw new DroneCanNotDepositBerryWhileOnSnailError();
        } else if (!this._hasBerry) {
            throw new DroneDoesNotHaveBerryError();
        }
        this._berryDeposits++;
        this._hasBerry = false;
    }
    kickInBerry() {
        if (!this._isWarrior) {
            if (!this._hasBerry) {
                throw new DroneCanNotKickInBerryWithoutHoldingBerryError();
            } else if (this._onSnail) {
                throw new DroneCanNotKickInBerryWhileOnSnailError();
            }
        }
        this._berryKickIns++;
    }
    becomeHuman() {
        if (this._isHuman) {
            throw new PlayerIsAlreadyHumanError();
        }
        this.resetState();
        this._isHuman = true;
    }
    becomeSpeed() {
        if (this._isWarrior) {
            throw new WarriorCanNotBecomeSpeedError();
        } else if (!this._hasBerry) {
            throw new DroneDoesNotHaveBerryError();
        } else if (this._isSpeed) {
            throw new DroneIsAlreadySpeedError();
        }
        this._isSpeed = true;
        this._hasBerry = false;
    }
    becomeWarrior() {
        if (this._isWarrior) {
            throw new WarriorIsAlreadyWarriorError();
        } else if (!this._hasBerry) {
            throw new DroneDoesNotHaveBerryError();
        }
        this._isWarrior = true;
        this._hasBerry = false;
    }
    getOnSnail() {
        if (this._isWarrior) {
            throw new WarriorCanNotRideSnailError();
        } else if (this._onSnail) {
            throw new DroneIsAlreadyOnSnailError();
        }
        this._onSnail = true;
    }
    getOffSnail() {
        if (this._isWarrior) {
            throw new WarriorCanNotRideSnailError();
        } else if (!this._onSnail) {
            throw new DroneIsAlreadyOffSnailError();
        }
        this._onSnail = false;
    }
    holdBerry() {
        if (this._isWarrior) {
            throw new WarriorCanNotHoldBerryError();
        } else if (this._onSnail) {
            throw new DroneCanNotBeginHoldingBerryWhileOnSnailError();
        } else if (this._hasBerry) {
            throw new DroneAlreadyHasBerryError();
        }
        this._hasBerry = true;
    }

    private resetState() {
        this._isSpeed = false;
        this._isWarrior = false;
        this._onSnail = false;
        this._hasBerry = false;
    }
}
