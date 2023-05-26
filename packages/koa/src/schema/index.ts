import type { Hatchify } from ".."
import type { HatchifyModel } from "../types"

export function buildSchemaForModel(
  hatchify: Hatchify,
  modelName: string,
): HatchifyModel {
  return hatchify.models[modelName]
}

// function resolveWildcard(hatchify: Hatchify, path): string {
//     const params = hatchify.getHatchifyURLParamsForRoute(path);
//     if (!params.model) {
//         throw hatchify.createError({ code: "400", title: "Invalid URL Format" });
//     }

//     if (!hatchify.model[params.model]) {
//         throw hatchify.createError({ code: "400", title: "Bad Model Name: " });
//     }

//     return params.model;
// }
