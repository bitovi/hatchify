/**
 * Helper function for making fetch requests to a JSON:API backend.
 */
export async function fetchJsonApi<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: { [key: string]: any },
): // todo support `included` (relationships) property
Promise<{ data: { data: T; included?: T } }> {
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify({ data: body }) : undefined,
  })

  if (!response.ok) {
    // todo proper validation
    throw Error("request failed")
  }

  if (response.status === 204) {
    return { data: { data: {} as T } }
  }

  return response.json()
}
