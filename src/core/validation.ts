import * as Joi from 'joi';
import * as Koa from 'koa';

const JOI_OPTIONS: Joi.ValidationOptions = {
  abortEarly: true,
  allowUnknown: false,
  context: Joi.ref(''),
  convert: true,
  presence: 'required',
};

export interface JoiSchema {
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  body?: Joi.ObjectSchema;
}

interface ErrorScheme {
  params?: object;
  query?: object;
  body?: object
}

const validate = (schema: JoiSchema) => {
  if (!schema) {
    schema = {
      query: null,
      body: null,
      params: null,
    };
  }

  return (ctx: Koa.Context, next: Koa.Next) => {
    const errors: ErrorScheme = {};

    if (!Joi.isSchema(schema.params)) {
      schema.params = Joi.object(schema.params || {});
    }

    const { error: paramsError, value: paramsValue } = schema.params.validate(
      ctx.params,
      JOI_OPTIONS,
    );

    if (paramsError) {
      errors.params = cleanupJoiError(paramsError);
    } else {
      ctx.params = paramsValue;
    }

    if (!Joi.isSchema(schema.body)) {
      schema.body = Joi.object(schema.body || {});
    }

    const { error: bodyError, value: bodyValue } = schema.body.validate(
      ctx.request.body,
      JOI_OPTIONS,
    );

    if (bodyError) {
      errors.body = cleanupJoiError(bodyError);
    } else {
      ctx.request.body = bodyValue;
    }

    if (!Joi.isSchema(schema.query)) {
      schema.query = Joi.object(schema.query || {});
    }

    const { error: queryError, value: queryValue } = schema.query.validate(
      ctx.request.query,
      JOI_OPTIONS,
    );

    if (queryError) {
      errors.query = cleanupJoiError(queryError);
    } else {
      ctx.request.query = queryValue;
    }

    if (Object.keys(errors).length) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: errors,
      });
    }

    return next();
  };
};

type ValidationErrorReducerObject = {
  [key: string]: Array<{
    type: string;
    message: string;
  }>;
}

const cleanupJoiError = (
  error: Joi.ValidationError,
) =>
  error.details.reduce<ValidationErrorReducerObject>((resultObj, { message, path, type }) => {
    const joinedPath = path.join('.') || 'value'; 
    if (!resultObj[joinedPath]) {
      resultObj[joinedPath] = [];
    }
    resultObj[joinedPath].push({
      type,
      message,
    });

    return resultObj;
  }, {});

export { validate };