import type {Schema} from "@hatchifyjs/react-ui"

export const Document: Schema = {
  name: "Document",
  attributes: {
    id: {
      type: "string",
      primaryKey: true,
      allowNull: false,
    },
    title: "string",
    date: "date",
    url: "string",
  },
  hasOne: [
    {
      target: "category",
      options: { through: "category__document", as: "category" },
    },
    {
      target: "user",
      options: { through: "user__document", as: "uploadedBy" },
    },
    {
      target: "fileType",
      options: { through: "fileType__document", as: "fileType" },
    },
  ],
  displayField: "title",
  jsonApiField: "document",
}

export const Category: Schema = {
  name: "Category",
  attributes: {
    id: {
      type: "string",
      primaryKey: true,
      allowNull: false,
    },
    name: "string",
  },
  displayField: "name",
  jsonApiField: "category",
}

export const User: Schema = {
  name: "User",
  attributes: {
    id: {
      type: "string",
      primaryKey: true,
      allowNull: false,
    },
    username: "string",
  },
  displayField: "username",
  jsonApiField: "user",
}

export const FileType: Schema = {
  name: "FileType",
  attributes: {
    id: {
      type: "string",
      primaryKey: true,
      allowNull: false,
    },
    name: "string",
    mimeType: "string",
  },
  displayField: "name",
  jsonApiField: "fileType",
}
