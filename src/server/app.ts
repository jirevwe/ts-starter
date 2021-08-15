import express, { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import responseTime from 'response-time';
import requestID from 'express-request-id';
import cors from 'cors';
import helmet from 'helmet';
import container from '@app/common/config/ioc';
import loggerMiddleware from './middleware/requestLogger';
import jsend from './middleware/jsend';
import { logResponseBody } from './middleware/logResponseBody';
import { MetricsService } from '@app/server/services';
import env from '@app/common/config/env';

export default class App {
  private server: InversifyExpressServer;

  constructor() {
    this.server = new InversifyExpressServer(container, null, {
      rootPath: env.api_version
    });

    this.registerMiddlewares();
    this.registerHandlers();
  }

  /**
   * Registers middlewares on the application server
   */
  private registerMiddlewares() {
    this.server.setConfig((app: Application) => {
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));

      app.disable('x-powered-by');
      app.use(helmet());
      app.use(cors());
      app.use(responseTime());
      app.use(requestID());

      app.use(loggerMiddleware);
      app.use(logResponseBody);

      app.use(jsend);
    });
  }

  /**
   * Registers utility handlers
   */
  private registerHandlers() {
    this.server.setErrorConfig((app: Application) => {
      app.get('/', (req, res) => {
        res.status(200).json({ status: 'UP' });
      });

      app.get('/metrics', MetricsService.send);

      app.use((req, res, next) => {
        res.status(404).send("Whoops! Route doesn't exist.");
      });
    });
  }

  /**
   * Applies all routes and configuration to the server, returning the express application server.
   */
  build() {
    return this.server.build();
  }
}
