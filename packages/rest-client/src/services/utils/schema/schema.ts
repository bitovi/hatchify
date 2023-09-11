import type { Schema as OldSchema } from "@hatchifyjs/hatchify-core"
import type { Schema, AttributeObject } from "../../types"

/**
 * The current backend schema attribute types are sequelize datatypes. This function
 * converts them to the types we use in the frontend.
 * https://sequelize.org/docs/v7/other-topics/other-data-types/
 */
export function transformDataType(dataType: string): string {
  const type = dataType.toLowerCase()

  if (
    type.includes("boolean") ||
    type.includes("tinyint(1)") ||
    type.includes("bit")
  ) {
    return "boolean"
  }

  if (
    type.includes("int") ||
    type.includes("float") ||
    type.includes("double") ||
    type.includes("real") ||
    type.includes("decimal")
  ) {
    return "number"
  }

  if (type.includes("json")) {
    return "object"
  }

  if (type.includes("date") || type.includes("time") || type.includes("now")) {
    return "date"
  }

  if (type.includes("enum")) {
    return "enum"
  }

  // varchar, ...text, uuid, enum, ...
  return "string"
}

/**
 * Transforms a legacy (sequelize based) schema into a new (shared hatchify) schema.
 */
export function transformSchema(schema: OldSchema): Schema {
  const resolved: Schema = {
    name: schema.name,
    displayAttribute: Object.keys(schema.attributes)[0],
    attributes: {},
    pluralName: schema.pluralName,
  }

  for (const [key, value] of Object.entries(schema.attributes)) {
    let stringValue: string
    let allowNull = true

    if (typeof value === "string") {
      stringValue = value
    } else {
      stringValue = (value as AttributeObject).type as string

      allowNull =
        (typeof (value as AttributeObject).allowNull === "undefined" ||
          (value as AttributeObject).allowNull) ??
        false
    }

    /* values exists in enums types only. There's a bit of type narrowing here since value is either string,
     an object, or an object that contains a values key.
    */
    resolved.attributes[key] = {
      type: transformDataType(stringValue),
      allowNull,
      ...(typeof value !== "string" &&
        "values" in value && { values: value.values }),
    }
  }

  if (
    schema.belongsTo ||
    schema.belongsToMany ||
    schema.hasOne ||
    schema.hasMany
  ) {
    resolved.relationships = {}
  }

  if (schema.belongsTo && resolved.relationships) {
    for (const belongsTo of schema.belongsTo) {
      resolved.relationships[belongsTo.options.as] = {
        type: "one",
        schema: belongsTo.target,
      }
    }
  }

  if (schema.belongsToMany && resolved.relationships) {
    for (const belongsToMany of schema.belongsToMany) {
      resolved.relationships[belongsToMany.options.as] = {
        type: "many",
        schema: belongsToMany.target,
      }
    }
  }

  if (schema.hasOne && resolved.relationships) {
    for (const hasOne of schema.hasOne) {
      resolved.relationships[hasOne.options.as] = {
        type: "one",
        schema: hasOne.target,
      }
    }
  }

  if (schema.hasMany && resolved.relationships) {
    for (const hasMany of schema.hasMany) {
      resolved.relationships[hasMany.options.as] = {
        type: "many",
        schema: hasMany.target,
      }
    }
  }

  return resolved
}
