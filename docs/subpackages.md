# Subpackages

Hatchify is built as a monorepo of multiple packages so you can choose which ones you want for your project.

## Packages

### [Core](../packages/core/README.md) 🛑

Hatchify's schemas and shared types.

### [Create](../packages/create/README.md)

Create a new Hatchify-based project.

### [Design Material UI](../packages/design-mui/README.md) 🛑

Material UI implementation on of Hatcify's React components.

### [Express](../packages/express/README.md) 🛑

Middleware and helper functions to integrate Hatchify into an [Express](https://expressjs.com/) server. It is implemented as a tiny wrapped around the [Hatchify Node package](#node-).

### [Koa](../packages/koa/README.md)

Middleware and helper functions to integrate Hatchify into a [Koa](https://koajs.com/) server. It is implemented as a tiny wrapped around the [Hatchify Node package](#node-).

### [Node](../packages/node/README.md) 🛑

Middleware and helper functions to integrate Hatchify into any Node server.

### [React](../packages/react/README.md) 🛑

Entry point for apps wanting Hatchify's React components and hooks.

### [React JSON:API](../packages/react-jsonapi/README.md) 🛑

Entry point for apps wanting Hatchify's data fetching.

### [React Rest](../packages/react-rest/README.md)

Adds React-specific data fetching (hooks) on top of the [Rest Client](#rest-client-) functions.

### [React UI](../packages/react-ui/README.md) 🛑

React components that tie together `design-*` components with [React Rest](#react-rest) data-fetching.

### [Rest Client](../packages/rest-client/README.md) 🛑

Data-fetching functions that are not framework-specific.

### [Rest Client JSON:API](../packages/rest-client-jsonapi/README.md) 🛑

Responsible for making network requests to a JSON:API-compliant backend.

## Package Dependencies

```mermaid
  flowchart BT
    A[core] --> B[node]
    B --> C[express]
    B --> D[koa]
    A --> E[rest-client]
    E --> F[rest-client-jsonapi]
    E --> G[react-rest]
    G --> H[react-ui]
    E --> H
    H --> I[design-mui]
    I --> J[react]
    F --> J
    H --> J
    A --> K[create]
    C --> K
    D --> K
    J --> K
    L[sequelize-create-with-associations] --> B
    M[sequelize-querystring-parser] --> B
    N[querystring-parser] --> M
```
