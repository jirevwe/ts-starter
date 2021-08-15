import { Request, Response, NextFunction } from 'express';

/**
 * Monkey patches the `res.send` method and stores the response body in `res.body` so it can be picked up by Bunyan
 */
export const logResponseBody = function(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const send = res.send;

  res.send = function(body?: any) {
    const _body = body instanceof Buffer ? body.toString() : body;
    res.body = _body;
    return send.call(this, body);
  };
  next();
};
