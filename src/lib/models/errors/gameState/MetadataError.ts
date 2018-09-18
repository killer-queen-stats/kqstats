class MetadataError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

class MetadataValueMustBeFinalError extends MetadataError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
