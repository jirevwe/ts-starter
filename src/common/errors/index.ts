import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';

export class ControllerError extends Error {
  code: number;
  error_code: number;
  constructor(message: string, code?: number, error_code?: number) {
    super(message);
    this.code = code || 400;
    this.error_code = error_code || 0; // special error codes which clients can read and react to.
  }
}

/**
 * Generic HTTP Bad Request Error
 * Sets the HTTP status code to 400 `Bad Request` when request is not properly formatted.
 */
export class ActionNotAllowedError extends ControllerError {
  constructor(message: string) {
    super(message);
    this.code = BAD_REQUEST;
  }
}

/**
 * Generic HTTP Not Found error
 * Sets the HTTP status code to 404 `Not Found` when a queried item is not found.
 */
export class NotFoundError extends ControllerError {
  constructor(message: string) {
    super(message, NOT_FOUND);
  }
}

export class InvalidSecretKeyError extends ControllerError {
  constructor() {
    const errorMessage = `the secret key provided doesn't exist`;
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 702;
  }
}

export class MissingAuthHeaderError extends ControllerError {
  constructor() {
    const errorMessage = `authorization header not found`;
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 703;
  }
}

export class InvalidAuthSchemeError extends ControllerError {
  constructor() {
    const errorMessage = `invalid authentication scheme`;
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 704;
  }
}

export class AccountNotFoundError extends ControllerError {
  constructor(id: string) {
    const errorMessage = `account with id: (${id}) does not exist`;
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 706;
  }
}

export class PinNotSetError extends ControllerError {
  constructor() {
    const errorMessage =
      'Your transaction PIN has not been set, please set it first';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 310;
  }
}

export class AccountExistsError extends ControllerError {
  constructor() {
    const errorMessage = 'A user with matching details exists';
    super(errorMessage);

    this.code = BAD_REQUEST;
    this.error_code = 301;
  }
}

export class LoginAuthenticationError extends ControllerError {
  constructor() {
    const errorMessage = 'Incorrect phone number or password supplied';
    super(errorMessage);

    this.code = UNAUTHORIZED;
    this.error_code = 306;
  }
}
