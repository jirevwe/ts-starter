class RepositoryError extends Error {
  constructor(message) {
    super(message);
  }
}

export class DuplicateModelError extends RepositoryError {
  constructor(message: string) {
    super(message);
  }
}

export class ModelNotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message);
  }
}
