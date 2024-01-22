# Model Sync

This guide is a continuation of Hatchify's [Getting Started Guide](../../README.md#project-setup) and will teach you how to automatically sync your schemas with your database. If your database is created externally to Hatchify, you do not need to worry about it. Otherwise, Hatchify makes it simple by offering 3 syncing options:

```ts
hatchedKoa.modelSync()
```

- This creates the table if it does not exist (and does nothing if it already exists)
- Postgres: Namespaces (Postgres Schemas) are handled manually

```ts
hatchedKoa.modelSync({ alter: true })
```

- This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
- Postgres: Namespaces (Postgres Schemas) are created

```ts
hatchedKoa.modelSync({ force: true })
```

- This creates the table, dropping it first if it already existed
- Postgres: Namespaces (Postgres Schemas) and their tables are dropped and recreated
