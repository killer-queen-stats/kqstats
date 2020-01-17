export class HiveError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HiveIsFullError extends HiveError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HiveMustHaveMoreThanZeroHolesError extends HiveError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BerryDepositOutOfBoundsError extends HiveError {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
