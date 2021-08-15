import { IOC_TYPES } from '@app/common/config/ioc-types';
import { LoginAuthenticationError } from '@app/common/errors';
import { IUserRepository, LoginDTO, SignupDTO } from '@app/data/user';
import gateman from '@app/server/gateman';
import validator from '@app/server/middleware/validator';
import { login, signup } from '@app/server/validators/user.validator';
import { publisher } from '@random-guys/eventbus';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestBody,
  response
} from 'inversify-express-utils';
import { validateBuildNumber } from '../middleware/validateBuildNumber';
import { BaseController } from './base';

@controller('/users')
export default class UserController extends BaseController {
  @inject(IOC_TYPES.AccountRepository)
  userRepo: IUserRepository;

  /**
   * Gets an authenticated user's profile
   */
  @httpGet('/', gateman.guard('user'))
  async getUser(@request() req: Request, @response() res: Response) {
    try {
      const user = await this.userRepo.byID(req.user, '+transaction_pin');
      this.handleSuccess(req, res, user);
    } catch (err) {
      this.handleError(req, res, err);
    }
  }

  /**
   * Creates a user account and makes a call to the wallet
   * service to create a wallet for the user.
   */
  @httpPost('/', validator(signup))
  async signup(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: SignupDTO
  ) {
    try {
      const user = await this.userRepo.createAccount(body);

      const token = await gateman.createSession({ id: user._id });

      const data = { user, token };

      this.handleSuccess(req, res, data);
    } catch (err) {
      this.handleError(req, res, err);
    }
  }

  /**
   * Logs the user in using their phone number and password
   */
  @httpPost('/login', validateBuildNumber, validator(login))
  async login(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: LoginDTO
  ) {
    try {
      const user = await this.userRepo.byQuery(
        { phone_number: body.phone_number },
        '+password +transaction_pin'
      );

      const isPasswordValid = await user.isPasswordValid(body.password);
      if (!isPasswordValid) throw new LoginAuthenticationError();

      const token = await gateman.createSession({ id: user._id });
      this.handleSuccess(req, res, { user, token });
    } catch (err) {
      this.handleError(req, res, err);
    }
  }

  @httpPut('/', gateman.guard(), validateBuildNumber)
  async update(@request() req: Request, @response() res: Response) {
    try {
      const status = await publisher.emit('events', 'user.updated', {
        id: req.user
      });
      this.handleSuccess(req, res, status);
    } catch (err) {
      this.handleError(req, res, err);
    }
  }
}
