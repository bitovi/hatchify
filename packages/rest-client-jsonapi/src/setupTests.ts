import { beforeAll, afterAll, afterEach } from "vitest"
import { server } from "./mocks/server"

beforeAll(() =>
  server.listen({
    onUnhandledRequest: (req, print) => {
      if (req.url.pathname.startsWith("/api/articles")) {
        return
      }

      print.error()
    },
  }),
)
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
