class GateError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

class SamePossessionError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class PossessionMismatchError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class GateCanNotBecomeNeutralError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class GateOccupiedError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class GateNotOccupiedError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class CharacterMismatchError extends GateError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
