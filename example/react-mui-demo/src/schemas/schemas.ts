export const Category = {
  name: "Category",
  attributes: {
    name: "string",
  },
}

export const Document = {
  name: "Document",
  attributes: {
    title: "string",
    date: "date",
    url: "string",
  },
  hasOne: [
    {
      target: "Category",
      options: { as: "category" },
    },
  ],
}
