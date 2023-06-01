import type { DefaultState, DefaultContext, Middleware } from "koa"
import type Koa from "koa"

export type KoaMiddleware = Middleware

export type HatchifyApplication = Koa<DefaultState, DefaultContext>
