import type { Hatchify } from ".."
import type { JSONObject } from "../types"

/**
 * Provides a set of exported functions, per Model, that
 * takes data, usually some database/model record, and
 * converts it into JSON:API response format
 */
export interface DeserializeFunctions {
  /**
   * Takes a Model instance and converts it into a
   * JSON:API serialized response that can be returned
   * to the caller
   *
   * In most normal use cases this can come directly from the
   * output of a Model query operation.
   *
   * @returns {JSONObject}
   */
  create: (data: unknown, options?: any) => Promise<JSONObject>
  update: (data: unknown, options?: any) => Promise<JSONObject>
}

export function buildDeserializerForModel(
  hatchify: Hatchify,
  modelName: string,
): DeserializeFunctions {
  return {
    create: async (data: any) => {
      try {
        return hatchify.serializer.deserialize(modelName, data)
      } catch (err) {
        return data
      }
    },

    update: async (data: any) => {
      try {
        return hatchify.serializer.deserialize(modelName, data)
      } catch (err) {
        return data
      }
    },
  }
}
