import { Scaffold } from "..";
import { ScaffoldModel } from "../types";

export function buildSchemaForModel(
  scaffold: Scaffold,
  modelName: string
): ScaffoldModel {
  return scaffold.models[modelName];
}

// function resolveWildcard(scaffold: Scaffold, path): string {
//     const params = scaffold.getScaffoldURLParamsForRoute(path);
//     if (!params.model) {
//         throw scaffold.createError({ code: "400", title: "Invalid URL Format" });
//     }

//     if (!scaffold.model[params.model]) {
//         throw scaffold.createError({ code: "400", title: "Bad Model Name: " });
//     }

//     return params.model;
// }
