// hatchify-app/schemas/todo.ts
import { Schema } from "@hatchifyjs/react";

export const Todo: Schema = {
  name: "Todo",
  attributes: {
    name: "STRING",
    due_date: "DATE",
    importance: "INTEGER"
  },
  belongsTo: [{ target: "User", options: { as: "user" } }], 
};