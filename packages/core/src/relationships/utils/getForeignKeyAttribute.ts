import type { FinalAttributeOptions } from "../../assembler/types.js"
import {
  boolean,
  dateonly,
  datetime,
  enumerate,
  integer,
  number,
  string,
  text,
  uuid,
} from "../../dataTypes/index.js"

const dataTypes = {
  boolean,
  dateonly,
  datetime,
  enumerate,
  integer,
  number,
  string,
  text,
  uuid,
}

export function getForeignKeyAttribute(
  attribute: FinalAttributeOptions,
  required?: boolean,
): FinalAttributeOptions {
  const dataType = attribute.name.split("(")[0] as keyof typeof dataTypes

  if (dataType === "enumerate") {
    return enumerate({
      ui: { hidden: true },
      values: attribute.control.values,
      required,
    }).finalize()
  }

  return dataTypes[dataType]({ ui: { hidden: true }, required }).finalize()
}
