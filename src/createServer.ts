import * as Koa from 'koa';
import * as config from 'config';

import { initializeLogger, getLogger } from './core/logging';
import { installMiddleware } from './core/installMiddleware';
import { initializeData, shutdownData } from './data';
import installRoutes from './routes';

const LOG_LEVEL: string = config.get('log.level');
const LOG_DISABLED: boolean = config.get('log.disabled');
const NODE_ENV: string = config.get('env');


export async function createServer() {
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: {
      NODE_ENV,
    },
  });

  await initializeData();

  const logger = getLogger();
  const app: Koa = new Koa();

  installMiddleware(app);
  installRoutes(app);

  return {
    getApp(): Koa {
      return app;
    },
    
    start(): Promise<void> {
      return new Promise<void>((resolve) => {
        const port: number = config.get('port');
        app.listen(port, () => {
          logger.info(`🚀 Server listening on http://localhost:${port}`);
          resolve();
        });
      });
    },

    async stop(): Promise<void> {
      app.removeAllListeners();
      await shutdownData();
      getLogger().info('Goodbye! 👋');
    },
  };
}