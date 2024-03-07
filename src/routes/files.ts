import * as Router from '@koa/router';
import * as Koa from 'koa';
import * as Joi from 'joi';

import FileService, { FileCreate } from '../service/files';
import { validate } from '../core/validation';
import { UpdateFile } from '../controllers/File';

const getAllFiles = async (ctx: Koa.Context): Promise<void> => {
  ctx.status = 200;
  ctx.body = await FileService.getAll();
};

const getFileById = async (ctx: Koa.Context): Promise<void> => {
  ctx.status = 200;
  ctx.body = await FileService.getById(ctx.params.id);
};

getFileById.validationScheme = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
};

const createFile = async (ctx: Koa.Context): Promise<void> => {
  const data = <FileCreate> ctx.request.body;

  const newFile = await FileService.create(data);

  ctx.status = 201;
  ctx.body = newFile;
};

createFile.validationScheme = {
  body: Joi.object<FileCreate>({
    name: Joi.string().required(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
    type: Joi.string().required(),
    size: Joi.number().required(),
    userId: Joi.string().required(),
    folderId: Joi.number().required(),
  }),
};

const updateFile = async (ctx: Koa.Context): Promise<void> => {
  const data = <UpdateFile> ctx.request.body;

  const updatedFile = await FileService.update(ctx.params.id, data);
  
  ctx.status = 200;
  ctx.body = updatedFile;
};

updateFile.validationScheme = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
  body: Joi.object<UpdateFile>({
    name: Joi.string().optional(),
    url: Joi.string().optional(),
    folderId: Joi.number().optional(),
  }),
};

const deleteById = async (ctx: Koa.Context): Promise<void> => {
  await FileService.deleteById(ctx.params.id);

  ctx.status = 204;
};

deleteById.validationScheme = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
};

export default (app: Router<Koa.DefaultState, Koa.DefaultContext>) => {
  const router = new Router({ prefix: '/files' });

  router.get('/', getAllFiles);
  router.get('/:id', validate(getFileById.validationScheme), getFileById);
  router.post('/', validate(createFile.validationScheme), createFile);
  router.put('/:id', validate(updateFile.validationScheme), updateFile);
  router.delete('/:id', validate(deleteById.validationScheme), deleteById);

  app.use(router.routes()).use(router.allowedMethods());
};