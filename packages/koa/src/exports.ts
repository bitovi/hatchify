import type { Middleware } from "koa"

export type { Context, Next } from "koa"
export type {
  ErrorObject,
  JSONAPIDocument,
  JsonApiObject,
  LinksCallback,
  LinksObject,
  LinkObject,
  Meta,
  ResourceObject,
} from "json-api-serializer"

export * from "./koa.js"

export type { PartialAttributeRecord, PartialSchema } from "@hatchifyjs/core"

export {
  DataTypes,
  NotFoundError,
  Op,
  UnexpectedValueError,
} from "@hatchifyjs/node"

export type {
  CreateOptions,
  DatabaseOptions,
  DestroyOptions,
  EverythingFunctions,
  FindOptions,
  HatchifyError,
  HatchifyErrorOptions,
  HatchifyOptions,
  JSONObject,
  ModelAttributes,
  ModelFunctionsCollection,
  ModelValidateOptions,
  ParseFunctions,
  SerializeFunctions,
  SyncOptions,
  Transaction,
  UpdateOptions,
  WhereOptions,
} from "@hatchifyjs/node"

export type KoaMiddleware = Middleware

export type { MiddlewareFunctionsKoa } from "./middleware.js"
