// import metadata for es7 decorators support
import 'reflect-metadata';

// allow creation of aliases for directories
import 'module-alias/register';

import http from 'http';
import { publisher } from '@random-guys/eventbus';
import env from '@app/common/config/env';
import logger from '@app/common/services/logger';
import App from './app';
import DB from './db';

const start = async () => {
  try {
    const app = new App();
    const appServer = app.build();
    const httpServer = http.createServer(appServer);

    await DB.connect();
    logger.message('📦  MongoDB Connected!');

    await publisher.init(env.amqp_url);
    logger.message('🚎  Event Bus Publisher ready!');

    httpServer.listen(env.port);
    httpServer.on('listening', () =>
      logger.message(
        `🚀  ${env.service_name} running in ${env.app_env}. Listening on ` +
          env.port
      )
    );
  } catch (err) {
    logger.error(err, 'Fatal server error');
  }
};

start();

process.once('SIGINT', () => {
  const pubConnection = publisher.getConnection();
  if (pubConnection) pubConnection.close();
});
