import type { Source, Record, QueryList } from "../types"
import { insert } from "../store"

export const getList = async (
  dataSource: Source,
  resource: string,
  query: QueryList,
): Promise<Record[]> => {
  const response = await dataSource.getList(resource, query)

  insert(resource, response.data)

  return response.data
}
