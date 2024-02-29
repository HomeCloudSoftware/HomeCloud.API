import * as Router from '@koa/router';
import * as Koa from 'koa';

import installUsersRouter from './users';

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
  
  app.use(router.routes()).use(router.allowedMethods());
};