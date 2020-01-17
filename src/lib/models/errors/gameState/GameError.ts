export class GameError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class OrientationNotSetError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GatesNotSetError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GateNotFoundError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnknownGateError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GateSetNotDeterministicError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HivesNotSetError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoHivesError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SnailsNotSetError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SnailNotFoundError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnknownSnailError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SnailSetNotDeterministicError extends GameError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
