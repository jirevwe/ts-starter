import JsendContract from 'jsend';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

class JSendMiddleware implements JsendContract {
  constructor(private readonly res: Response) {}

  success(data: any, code: number = HttpStatus.OK) {
    this.res.status(code).json({
      status: 'success',
      data
    });
  }

  fail(data: any) {
    this.res.status(HttpStatus.EXPECTATION_FAILED).json({
      status: 'fail',
      data
    });
  }

  error(data: any, message: string, code: number, error_code?: number) {
    const httpCode = code || HttpStatus.BAD_REQUEST;
    this.res.status(httpCode).json({
      status: 'error',
      data,
      message,
      code: httpCode,
      error_code
    });
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  res.jSend = new JSendMiddleware(res);
  next();
};
