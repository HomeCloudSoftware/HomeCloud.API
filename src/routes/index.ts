import * as Router from '@koa/router';
import * as Koa from 'koa';

import installUsersRouter from './users';
import installFoldersRouter from './folders';
import installFilesRouter from './files';

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
export default (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  const router = new Router({
    prefix: '/api',
  });

  installUsersRouter(router);
  installFoldersRouter(router);
  installFilesRouter(router);
  
  app.use(router.routes()).use(router.allowedMethods());
};