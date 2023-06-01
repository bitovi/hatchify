import type { JsonApiResource } from "../../jsonapi"

/**
 * Helper function for making fetch requests to a JSON:API backend.
 */
export async function fetchJsonApi(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: { [key: string]: any },
): // todo support `included` (relationships) property
Promise<{ data: JsonApiResource }> {
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify({ data: body }) : undefined,
  })

  if (!response.ok) {
    // todo proper validation
    throw Error("request failed")
  }

  if (response.status === 204) {
    return { data: {} as JsonApiResource }
  }

  return response.json()
}
