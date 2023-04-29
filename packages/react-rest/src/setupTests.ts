import { beforeAll, afterAll, afterEach } from "vitest"
import { server } from "@shared/mocks/handlers"

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
