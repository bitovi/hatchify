import { HatchifySymbolModel } from "../../types"
import type {
  HatchifyModelCollection,
  SequelizeModelsCollection,
} from "../../types"

export function buildHatchifyModelObject(
  models: SequelizeModelsCollection,
): HatchifyModelCollection {
  return Object.entries(models).reduce(
    (acc, [name, model]) => ({ ...acc, [name]: model[HatchifySymbolModel] }),
    {},
  )
}
