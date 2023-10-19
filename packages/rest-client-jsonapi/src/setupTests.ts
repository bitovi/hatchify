import { beforeAll, afterAll, afterEach } from "vitest"
import { server } from "./mocks/server"

export const testBackendEndpointConfig = {
  api: "api",
  schemaSegment: "articles",
  namespacedSchemaSegment: "feature/articles",
}

beforeAll(() =>
  server.listen({
    onUnhandledRequest: (req, print) => {
      if (
        req.url.pathname.startsWith(
          `/${testBackendEndpointConfig.api}/${testBackendEndpointConfig.schemaSegment}`,
        ) ||
        req.url.pathname.startsWith(
          `/${testBackendEndpointConfig.api}/${testBackendEndpointConfig.namespacedSchemaSegment}`,
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
