import express, { Request, Response } from 'express';
import http from 'http';
import env from '@app/common/config/env';
import logger from '@app/common/services/logger';
import { subscriber } from '@random-guys/eventbus';
import redis from '@app/common/services/redis';
import db from '@app/server/db';
import updateUserAccount from './updateUserAccount';

let httpServer: http.Server;
const app = express();

/**
 * Starts the worker
 */
export const startWorker = async () => {
  try {
    if (!env.worker_port)
      throw new Error('Worker http port not specified. Exiting...');

    await db.connect();
    logger.message('📦  MongoDB Connected!');

    await subscriber.init(env.amqp_url);

    const subscriberConnection = subscriber.getConnection();
    subscriberConnection.on('error', (err: Error) => {
      logger.error(err);
      process.exit(1);
    });

    // Attach handlers
    await subscriber.on(
      'events',
      'user.updated',
      'UPDATE_USER_ACCOUNT_QUEUE',
      updateUserAccount,
      10
    );

    // Start simple server for k8s health check
    app.get('/', (req: Request, res: Response) => {
      res.status(200).json({ status: 'UP' });
    });
    httpServer = app.listen(env.worker_port);

    logger.message(
      `📇  getequity-template-worker ready!. Health check on port ${env.worker_port}`
    );
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

/**
 * Stops the worker
 */
export const stopWorker = async () => {
  try {
    await subscriber.getConnection().close();
    await db.disconnect();
    await redis.quit();
    if (httpServer) httpServer.close();
  } catch (err) {
    logger.error(err, 'An error occured while stopping Contacts worker');
    process.exit(1);
  }
};
