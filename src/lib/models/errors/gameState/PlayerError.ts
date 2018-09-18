class PlayerError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneCanNotDepositBerryWhileOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class WarriorCanNotDepositBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneDoesNotHaveBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneCanNotKickInBerryWithoutHoldingBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneCanNotKickInBerryWhileOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class PlayerIsAlreadyHumanError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class WarriorCanNotBecomeSpeedError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneIsAlreadySpeedError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class WarriorIsAlreadyWarriorError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class WarriorCanNotRideSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneIsAlreadyOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneIsAlreadyOffSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class WarriorCanNotHoldBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneCanNotBeginHoldingBerryWhileOnSnailError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class DroneAlreadyHasBerryError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
