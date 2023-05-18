import type { Record } from "./data"

export type Unsubscribe = () => void

export type Subscription = (data: Record[]) => void
