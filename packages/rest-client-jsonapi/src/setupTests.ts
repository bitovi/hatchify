import { beforeAll, afterAll, afterEach } from "vitest"
import { server } from "./mocks/server.js"

export const testBackendEndpointConfig = {
  api: "api",
  schemaSegment: "articles",
  namespacedSchemaSegment: "feature/articles",
  adminUserNamespaceSegment: "admin/users",
}

beforeAll(() =>
  server.listen({
    onUnhandledRequest: (req, print) => {
      const reqUrl = new URL(req.url)
      if (
        reqUrl.pathname.startsWith(
          `/${testBackendEndpointConfig.api}/${testBackendEndpointConfig.schemaSegment}`,
        ) ||
        reqUrl.pathname.startsWith(
          `/${testBackendEndpointConfig.api}/${testBackendEndpointConfig.namespacedSchemaSegment}`,
        ) ||
        reqUrl.pathname.startsWith(
          `/${testBackendEndpointConfig.api}/${testBackendEndpointConfig.adminUserNamespaceSegment}`,
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
