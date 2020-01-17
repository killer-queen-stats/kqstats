export class PlayerError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneCanNotDepositBerryWhileOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WarriorCanNotDepositBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneDoesNotHaveBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneCanNotKickInBerryWithoutHoldingBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneCanNotKickInBerryWhileOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PlayerIsAlreadyHumanError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WarriorCanNotBecomeSpeedError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneIsAlreadySpeedError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WarriorIsAlreadyWarriorError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WarriorCanNotRideSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneIsAlreadyOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneIsAlreadyOffSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WarriorCanNotHoldBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneCanNotBeginHoldingBerryWhileOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DroneAlreadyHasBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
