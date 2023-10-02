# API Documentation

This page links to all the other API documentation. This is like a big cheat sheet.

<pre>
export const Todo: <a href="./naming.md">PartialSchema</a> = {
  name: "Todo",
  attributes: {
    name: string({ required: true }),
    dueDate: datetime(),
    importance: integer(),
    complete: boolean({ default: false }),
  },
  relationships: {
    user: belongsTo(),
  },
}
</pre>

