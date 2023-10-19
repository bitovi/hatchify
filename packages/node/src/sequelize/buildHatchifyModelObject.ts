import type { SequelizeModelsCollection } from "../types"

export function buildHatchifyModelObject(
  models: SequelizeModelsCollection,
): SequelizeModelsCollection {
  return {
    ...models,
  }
}
