export class SnailError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SnailHasRiderError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SnailDoesNotHaveRiderError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SnailIsEatingError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class SnailIsNotEatingError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
