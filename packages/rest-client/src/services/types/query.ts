export type Include = string[]

export type Fields = string[]

export type Selector =
  | { include: Include; fields?: undefined }
  | { fields: Fields; include?: undefined }
  | { include?: undefined; fields?: undefined }

export type QueryList = Selector & {
  fields?: string[]
  page?: { size: number; number: number }
  sort?: { [key: string]: "asc" | "desc" }
  filter?: { [key: string]: { [filter: string]: string } }
}

export type QueryOne = Selector & { id: string; fields?: string[] }
