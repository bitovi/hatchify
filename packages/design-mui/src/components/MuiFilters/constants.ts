import type { FilterTypes } from "@hatchifyjs/rest-client"

export type FilterableControls = (typeof filterableControlTypes)[number]

export type Operators =
  | "contains"
  | "icontains"
  | "istarts"
  | "iends"
  | FilterTypes

export interface Option {
  operator: Operators
  text: string
}

export type OptionsByFilterableControls = {
  [key in FilterableControls]: Option[]
}

export const filterableControlTypes = [
  "String",
  "Number",
  "Datetime",
  "Dateonly",
  "enum",
] as const

export const operatorOptionsByType: OptionsByFilterableControls = {
  String: [
    { operator: "contains", text: "contains (case sensitive)" },
    { operator: "icontains", text: "contains" },
    { operator: "istarts", text: "starts with" },
    { operator: "iends", text: "ends with" },
    { operator: "$eq", text: "equals" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
    { operator: "$in", text: "is any of" },
  ],
  Dateonly: [
    { operator: "$eq", text: "is" },
    { operator: "$gt", text: "is after" },
    { operator: "$gte", text: "is on or after" },
    { operator: "$lt", text: "is before" },
    { operator: "$lte", text: "is on or before" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
  Datetime: [
    { operator: "$eq", text: "is" },
    { operator: "$gt", text: "is after" },
    { operator: "$gte", text: "is on or after" },
    { operator: "$lt", text: "is before" },
    { operator: "$lte", text: "is on or before" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
  ],
  enum: [
    { operator: "$eq", text: "is" },
    { operator: "$ne", text: "is not" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
    { operator: "$in", text: "is any of" },
    { operator: "$nin", text: "is not any of" },
  ],
  Number: [
    { operator: "$eq", text: "=" },
    { operator: "$ne", text: "!=" },
    { operator: "$gt", text: ">" },
    { operator: "$gte", text: ">=" },
    { operator: "$lt", text: "<" },
    { operator: "$lte", text: "<=" },
    { operator: "empty", text: "is empty" },
    { operator: "nempty", text: "is not empty" },
    { operator: "$in", text: "is any of" },
  ],
}
