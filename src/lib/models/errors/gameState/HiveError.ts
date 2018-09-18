class HiveError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

class HiveIsFullError extends HiveError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class HiveMustHaveMoreThanZeroHolesError extends HiveError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class BerryDepositOutOfBoundsError extends HiveError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
