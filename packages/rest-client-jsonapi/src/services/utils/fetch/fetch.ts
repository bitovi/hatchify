import type { RequestMetaData } from "@hatchifyjs/rest-client"
import type { JsonApiResource } from "../../jsonapi/index.js"

/**
 * Helper function for making fetch requests to a JSON:API backend.
 */
export async function fetchJsonApi<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: { [key: string]: any },
  fetchOptions?: RequestInit,
): Promise<{
  data: T
  included?: JsonApiResource[]
  meta?: RequestMetaData
}> {
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify({ data: body }) : undefined,
    headers: {
      ...fetchOptions?.headers,
      "Content-Type": "application/vnd.api+json", // This will override any Content-Type in fetchOptions
    },
    ...fetchOptions,
  })

  if (!response.ok) {
    const json = await response.json()
    return Promise.reject(json?.errors || "Unknown error")
  }

  if (response.status === 204) {
    return { data: {} as T }
  }

  return response.json()
}
