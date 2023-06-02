import type { DefaultContext, DefaultState, Middleware } from "koa"
import type Koa from "koa"

export type KoaMiddleware = Middleware

export type HatchifyApplication = Koa<DefaultState, DefaultContext>
