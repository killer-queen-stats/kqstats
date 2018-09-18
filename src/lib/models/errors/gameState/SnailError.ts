class SnailError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

class SnailHasRiderError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class SnailDoesNotHaveRiderError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class SnailIsEatingError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class SnailIsNotEatingError extends SnailError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
