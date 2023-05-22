import type {
  FlatRecord,
  Primitive,
  Relationship,
} from "../../presentation/interfaces"
import type { FormState } from "../../components/HatchifyForm"
// import type { Schema } from "@hatchifyjs/data-core"
import * as schemas from "./schemas" // TODO this is hardcoded schemas, we will need to update this file to consume the schemas, instead of importing it
import type { Schema } from "./schemas" //TODO update to the right schema
import type { FormFieldValueType, HatchifyFormField } from "../formFields"

export const API_BASE_URL = "https://dummy.data/api"

interface JsonApiAttributes {
  [field: string]: Primitive
}

interface JsonApiIncluded {
  type: string
  id: string
  attributes: JsonApiAttributes
}

interface JsonApiRecord {
  type: string
  id: string
  attributes: JsonApiAttributes
  relationships?: {
    [key: string]: {
      data: Array<{ type: string; id: string }> | { type: string; id: string }
    }
  }
}

interface JsonApiResponse {
  data: JsonApiRecord[] | JsonApiRecord
  included?: JsonApiIncluded[]
  jsonapi: { version: string }
  links: { [key: string]: string }
}

interface FlatIncluded {
  [key: string]: {
    [id: string]: { [field: string]: Primitive }
  }
}

/**
 * return schema.displayField for a schema where schemaKey matches
 * schema.jsonApiield
 */
export function getDisplayValueKeyForSchema(schemaKey: string): string {
  const schemaEntries = Object.values(schemas)

  for (let i = 0; i < schemaEntries.length; i++) {
    if (schemaEntries[i].jsonApiField === schemaKey) {
      return schemaEntries[i].displayField
    }
  }

  return ""
}

/**
 * convert included from:
 * { included: [
 *  { type: 'skills', id: 'skill-id-1', attributes: { name: 'Skill 1' } },
 *  { type: 'skills', id: 'skill-id-2', attributes: { name: 'Skill 2' } },
 *  { type: 'projects', id: 'project-id-1', attributes: { name: 'Project 1' } },
 * ] }
 * to:
 * {
 *  skills: {
 *    'skill-id-1': { name: 'Skill 1' },
 *    'skill-id-2': { name: 'Skill 2' },
 *  },
 *  projects: {
 *    'projects-id-1': { name: 'Project 1' }
 *  }
 * }
 */
function getFlattenedIncluded(included?: JsonApiIncluded[]): FlatIncluded {
  if (!included) return {}

  return included.reduce(
    (acc: FlatIncluded, next) => ({
      ...acc,
      [next.type]: {
        ...acc[next.type],
        [next.id]: next.attributes,
      },
    }),
    {},
  )
}

/**
 * convert data.data from:
 * { id: '', type: '', attributes: {...}, relationships: { skills: [{}]} }
 * to:
 * { id, ...attributes, skills: []}
 */
export function getFlatRecords(data: JsonApiResponse): FlatRecord[] {
  const flatIncluded = getFlattenedIncluded(data?.included)
  const records = Array.isArray(data.data) ? data.data : [data.data]

  return records.map((record: JsonApiRecord) => {
    const flatRecord: FlatRecord = {
      ...record.attributes,
      id: record.id,
    }

    const relationships = Object.entries(record.relationships || {})

    for (let i = 0; i < relationships.length; i++) {
      const [key, relationship] = relationships[i]
      const displayValueKey = getDisplayValueKeyForSchema(key)

      if (Array.isArray(relationship.data)) {
        flatRecord[key] = relationship.data.map((related) => ({
          ...flatIncluded[key][related.id],
          id: related.id,
          label: flatIncluded[key][related.id][displayValueKey],
        })) as Relationship[]
      } else {
        flatRecord[key] = {
          ...flatIncluded[key][relationship.data.id],
          id: relationship.data.id,
          label: flatIncluded[key][relationship.data.id][displayValueKey],
        } as Relationship
      }
    }

    return flatRecord
  })
}

export async function createOne(
  schema: Schema,
  formFields: HatchifyFormField[],
  formState: FormState,
): Promise<void> {
  const url = `${API_BASE_URL}/${schema.name.toLowerCase()}s`

  // json api specific formatting
  const data: {
    relationships: {
      [key: string]: { data: Array<{ type: string; id: string }> }
    }
    attributes: { [key: string]: FormFieldValueType | null }
    type: string
  } = {
    relationships: {},
    attributes: {},
    type: schema.name.toLowerCase(),
  }

  for (let i = 0; i < formFields.length; i++) {
    const field = formFields[i]

    if (field.attributeSchema.type === "relationship") {
      data.relationships = {
        ...data.relationships,
        [field.key]: {
          data: (formState[field.key] as string[]).map((id) => ({
            type: field.key,
            id,
          })),
        },
      }
    } else {
      data.attributes[field.key] = formState[field.key] || null
    }
  }

  const body = {
    jsonapi: { version: "1.0" },
    data: data,
  }

  const raw = await fetch(url, {
    method: "post",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(body),
  })

  await raw.json()
  // @todo store response in cache
}

export function getOne(
  schema: Schema,
  id: string | number,
): { read: () => FlatRecord } {
  let url = `${API_BASE_URL}/${schema.name.toLowerCase()}s/${id}`

  const includes = [...(schema?.hasMany || []), ...(schema?.hasOne || [])]
    ?.map((relationship) => relationship.target.toLowerCase())
    .join("&")

  if (includes) {
    url = `${url}?include=${includes}`
  }

  const promise = fetch(url)
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      return getFlatRecords(res)[0]
    })

  return wrapPromise<FlatRecord>(promise)
}

export function getMany(schema: Schema): { read: () => FlatRecord[] } {
  let url = `${API_BASE_URL}/${schema.name.toLowerCase()}s`

  const includes = [...(schema?.hasMany || []), ...(schema?.hasOne || [])]
    ?.map((relationship) => relationship.target.toLowerCase())
    .join("&")

  if (includes) {
    url = `${url}?include=${includes}`
  }

  const promise = fetch(url)
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      return getFlatRecords(res)
    })

  return wrapPromise<FlatRecord[]>(promise)
}

function wrapPromise<T>(promise: Promise<T>) {
  let status = "pending"
  let response: T

  const suspender = promise.then(
    (res) => {
      status = "success"
      response = res
    },
    (err) => {
      status = "error"
      response = err
    },
  )

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender
      case "error":
        throw response
      default:
        return response
    }
  }

  return { read }
}
