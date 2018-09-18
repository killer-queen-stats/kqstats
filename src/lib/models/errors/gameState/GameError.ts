class GameError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

class GateNotFoundError extends PlayerError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class HiveNotFoundError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class SnailNotFoundError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
