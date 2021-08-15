import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';
import { ValidationError, ObjectSchema } from 'joi';
import logger from '@app/common/services/logger';
import { MetricsService } from '@app/server/services';

const parseError = (error: ValidationError) => {
  const parsedError = error.details.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.context.key]: curr.message
    }),
    {}
  );
  return parsedError;
};

const validate = (data: any, schema: ObjectSchema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (!error)
    return {
      err: null,
      value: value
    };

  return {
    err: parseError(error),
    value: null
  };
};

type ValidatorContext = 'body' | 'query';

export default (schema: ObjectSchema, context: ValidatorContext = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { err, value } = validate(req[context], schema);

    if (!err) {
      req[context] = value;
      return next();
    }

    res.jSend.error(
      err,
      'One or more validation errors occured',
      HttpStatus.UNPROCESSABLE_ENTITY
    );

    logger.logAPIError(req, res, err);
    MetricsService.record(req, res);
  };
};
