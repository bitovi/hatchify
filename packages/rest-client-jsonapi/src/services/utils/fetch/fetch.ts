import type { RequestMetaData } from "@hatchifyjs/rest-client"
import type { JsonApiResource } from "../../jsonapi"

/**
 * Helper function for making fetch requests to a JSON:API backend.
 */
export async function fetchJsonApi<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: { [key: string]: any },
): Promise<{
  data: T
  included?: JsonApiResource[]
  meta?: RequestMetaData
}> {
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify({ data: body }) : undefined,
  })

  if (!response.ok) {
    // todo proper validation
    throw Error("request failed")
  }

  if (response.status === 204) {
    return { data: {} as T }
  }

  return response.json()
}
