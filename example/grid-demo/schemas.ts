import {
  string,
  dateonly,
  datetime,
  enumerate,
  PartialSchema,
  integer,
  text,
  boolean,
  uuid,
  belongsTo,
  hasMany,
} from "@hatchifyjs/core";

export const Document: PartialSchema = {
  name: "Document",
  attributes: {
    name: string(),
    dueDate: dateonly(),
    importance: integer(),
    lastUpdated: datetime(),
    notes: text(),
    complete: boolean(),
    uuid: uuid(),
    status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
  },
  relationships: {
    uploadedBy: belongsTo("User"),
  },
};

export const User: PartialSchema = {
  name: "User",
  attributes: {
    name: string(),
  },
  relationships: {
    documents: hasMany("Document"),
  },
};
