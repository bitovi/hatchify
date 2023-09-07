import { HatchifyModel } from "../types";

export function definedPlurals(models: HatchifyModel[]) {
  const plurals: Map<string, string> = new Map();
  models.forEach((model) => {
    if (model.pluralName) {
      plurals.set(model.name, model.pluralName);
    }
  })
  return plurals;
}
