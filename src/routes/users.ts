import * as Router from '@koa/router';
import * as Koa from 'koa';
import * as Joi from 'joi';
import { Role } from '@prisma/client';

import UserService from '../service/users';
import { validate } from '../core/validation';

type UserRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  profilePic: string;
  role: Role;
}

const getAllUsers = async (ctx: Koa.Context): Promise<void> => {
  ctx.status = 200;
  ctx.body = await UserService.getAll();
};

const getUserById = async (ctx: Koa.Context): Promise<void> =>  {
  ctx.status = 200;
  ctx.body = UserService.getById(ctx.params.id);
};

getUserById.validateScheme = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

const createUser = async (ctx: Koa.Context): Promise<void> => {
  const data = <UserRequest> ctx.request.body;
  const newUser = await UserService.create({
    ...data,
    role: JSON.parse(data.role),
    profilePic: 'def',
  });

  ctx.status = 201;
  ctx.body = newUser;
};

createUser.validationScheme = {
  body: Joi.object<UserRequest>({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

const updateUser = async (ctx: Koa.Context): Promise<void> => {
  const data = <UserRequest> ctx.request.body;

  const updatedUser = await UserService.update(ctx.params.id, data);

  ctx.status = 200;
  ctx.body = updatedUser;
};

updateUser.validationScheme = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object<UserRequest>({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    profilePic: Joi.string().required(),
  }),
};

const deleteById = async (ctx: Koa.Context) => {
  await UserService.deleteById(ctx.params.id);

  ctx.status = 204;
};

deleteById.validationScheme = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

export default (app: Router<Koa.DefaultState, Koa.DefaultContext>) => {
  const router = new Router({ prefix: '/users' });

  router.get('/', getAllUsers);
  router.get('/:id', validate(getUserById.validateScheme), getUserById);
  router.post('/', validate(createUser.validationScheme), createUser);
  router.put('/:id', validate(updateUser.validationScheme), updateUser);
  router.delete('/:id', validate(deleteById.validationScheme), deleteById);

  app.use(router.routes()).use(router.allowedMethods());
};