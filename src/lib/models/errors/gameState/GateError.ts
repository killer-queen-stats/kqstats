export class GateError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SamePossessionError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PossessionMismatchError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GateCanNotBecomeNeutralError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GateOccupiedError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class GateNotOccupiedError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CharacterMismatchError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
