import type { Source, Record, QueryList } from "../types"
import { convertResourceToRecord, insert } from "../store"

export const getList = async (
  dataSource: Source,
  schema: string,
  query: QueryList,
): Promise<Record[]> => {
  const response = await dataSource.getList(schema, query)

  insert(schema, response.data)

  return response.data.map(convertResourceToRecord)
}
