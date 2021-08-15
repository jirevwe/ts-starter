// import metadata for es7 decorators support
import 'reflect-metadata';

// allow creation of aliases for directories
import 'module-alias/register';

import { startWorker, stopWorker } from './bootstrap';

startWorker();

process.on('SIGINT', async () => await stopWorker());
