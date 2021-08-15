import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variables required for all environments (development, test, staging, production)
 */
const requiredVariables = [
  'port',
  'amqp_url',
  'redis_url',
  'gateman_key',
  'nip_service_url',
  'nip_service_api_version'
];

/**
 * Environment variables required for both staging and production
 */
const productionAndStagingVariables = ['mongodb_url', 'redis_password'];

/**
 * Requires MongoDB and Redis credentials in production and staging, else uses Redis and MongoDB connection string directly
 * in dev or any other environment
 */
if (['production', 'staging'].includes(process.env.NODE_ENV))
  requiredVariables.push(...productionAndStagingVariables);
else requiredVariables.push('mongodb_url');

const env = {
  port: Number(process.env.PORT),
  worker_port: process.env.WORKER_PORT,
  api_version: process.env.API_VERSION || '/api/v1',
  salt_rounds: Number(process.env.SALT_ROUNDS) || 10,

  amqp_url: process.env.AMQP_URL,
  redis_url: process.env.REDIS_URL,
  mongodb_url: process.env.MONGODB_URL,

  app_env: process.env.NODE_ENV || 'development',
  service_name: process.env.SERVICE_NAME || 'getequity-template',
  gateman_key: process.env.GATEMAN_KEY,

  redis_password: process.env.REDIS_PASSWORD,

  nip_service_url: process.env.NIP_SERVICE_URL,
  nip_service_api_version: process.env.NIP_SERVICE_API_VERSION,

  android_build_number: process.env.ANDROID_BUILD_NUMBER,
  ios_build_number: process.env.IOS_BUILD_NUMBER
};

const missingVariables = requiredVariables.reduce(
  (acc, varName) => (!env[varName] ? acc.concat(varName.toUpperCase()) : acc),
  []
);

if (!!missingVariables.length)
  throw new Error(
    `The following required variables are missing: ${missingVariables}}`
  );

export default env;
