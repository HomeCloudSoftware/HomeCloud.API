import * as Router from '@koa/router';
import * as Koa from 'koa';
import * as Joi from 'joi';

import FolderService, { FolderCreate } from '../service/folders';
import { validate } from '../core/validation';
import { UpdateFolder } from '../controllers/Folder';


const getAllFolders = async (ctx: Koa.Context): Promise<void> => {
  ctx.status = 200;
  ctx.body = await FolderService.getAll();
};

const getFolderById = async (ctx: Koa.Context): Promise<void> => {
  ctx.status = 200;
  ctx.body = FolderService.getById(ctx.params.id);
};

getFolderById.validationScheme = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
};

const createFolder = async (ctx: Koa.Context): Promise<void> => {
  const data = <FolderCreate> ctx.request.body;

  const newFolder = await FolderService.create(data);

  ctx.status = 201;
  ctx.body = newFolder;
};

createFolder.validationScheme = {
  body: Joi.object<FolderCreate>({
    name: Joi.string().required(),
    size: Joi.number().required(),
    userId: Joi.string().required(),
  }),
};

const updateFolder = async (ctx: Koa.Context): Promise<void> => {
  const data = <UpdateFolder> ctx.request.body;

  const updatedFolder = await FolderService.update(ctx.params.id, data);

  ctx.status = 200;
  ctx.body = updatedFolder;
};

updateFolder.validationScheme = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
  body: Joi.object<UpdateFolder>({
    name: Joi.string().optional(),
    url: Joi.string().optional(),
    size: Joi.number().optional(),
  }),
};

const deleteById = async (ctx: Koa.Context): Promise<void> => {
  await FolderService.deleteById(ctx.params.id);

  ctx.status = 204;
};

deleteById.validationScheme = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
};

export default (app: Router<Koa.DefaultState, Koa.DefaultContext>) => {
  const router = new Router({ prefix: '/folders' });

  router.get('/', getAllFolders);
  router.get('/:id', validate(getFolderById.validationScheme), getFolderById);
  router.post('/', validate(createFolder.validationScheme), createFolder);
  router.put('/:id', validate(updateFolder.validationScheme), updateFolder);
  router.delete('/:id', validate(deleteById.validationScheme), deleteById);

  app.use(router.routes()).use(router.allowedMethods());
};