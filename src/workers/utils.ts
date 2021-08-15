import logger from '@app/common/services/logger';
import amqp from 'amqplib';

/**
 * Checks if an AMQP message is `null` which indicates a consumer cancel notification from the server. If it is the process is exited with an error code of 1. See https://github.com/squaremo/amqp.node/issues/176 for more information on the consumer cancel notification
 * @param message AMQP message
 */
export const checkConsumerCancelNotification = (
  message: amqp.ConsumeMessage
) => {
  if (message === null) {
    logger.message('Consumer cancelled by server. Exiting process');
    process.exit(1);
  }
};
