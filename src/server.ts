import * as Koa from 'koa';

import config from './config';
import logger from './utils/logging';

const app = new Koa();

app.use(logger);

app.listen(config.port);

console.log(`Server running on port ${config.port}`);