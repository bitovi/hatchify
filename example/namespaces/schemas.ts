import { belongsTo, hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Article = {
  name: "Article",
  displayAttribute: "author",
  attributes: {
    author: string({ required: true }),
    tag: string({ required: true }),
  },
} satisfies PartialSchema

export const Feature_Article = {
  name: "Article",
  namespace: "Feature",
  displayAttribute: "author",
  attributes: {
    author: string({ required: true }),
    tag: string({ required: true }),
  },
  relationships: {
    adminUser: belongsTo("Admin_User"),
  },
} satisfies PartialSchema

export const Admin_User = {
  name: "User",
  namespace: "Admin",
  attributes: {
    name: string(),
  },
  relationships: {
    articles: hasMany("Feature_Article"),
  },
} satisfies PartialSchema
