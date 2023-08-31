import { beforeAll, afterAll, afterEach } from "vitest"
import { server } from "./mocks/server"

export const testBackendEndpointConfig = {
  api: "api",
  schema: "articles",
}

beforeAll(() =>
  server.listen({
    onUnhandledRequest: (req, print) => {
      if (
        req.url.pathname.startsWith(
          `/${testBackendEndpointConfig.api}/${testBackendEndpointConfig.schema}`,
        )
      ) {
        return
      }

      print.error()
    },
  }),
)
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
