import type { DataSource, Record, QueryList } from "source-jsonapi"
import { insert } from "../store"

export const getList = async (
  dataSource: DataSource,
  resource: string,
  query: QueryList,
): Promise<Record[]> => {
  const response = await dataSource.getList(resource, query)

  insert(resource, response.data)

  return response.data
}
