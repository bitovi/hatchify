import { getList as dataSourceGetList } from "source-jsonapi"
import type { Record, QueryList } from "source-jsonapi"
import { insert } from "../store"

export const getList = async (
  resource: string,
  query: QueryList,
): Promise<Record[]> => {
  const response = await dataSourceGetList(
    // @todo pull from schema
    { baseUrl: "http://api.example.com", resource },
    query,
  )

  insert(resource, response.data)

  return response.data
}
