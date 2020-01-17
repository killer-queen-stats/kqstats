export class MetadataError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MetadataValueMustBeFinalError extends MetadataError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DurationMustBeGreaterThanZeroError extends MetadataError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
