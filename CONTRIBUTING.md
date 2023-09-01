# Introduction

We are happy to see that you might be interested in contributing to Hatchify! There is no need to ask for permission to contribute. For example, anyone can open issues and propose changes to the source code (via Pull Requests). Here are some ways people can contribute:

- Opening well-written bug reports (via [New Issue](https://github.com/bitovi/hatchify/issues/new/choose))
- Opening well-written feature requests (via [New Issue](https://github.com/bitovi/hatchify/issues/new/choose))
- Proposing improvements to the documentation (via [New Issue](https://github.com/bitovi/hatchify/issues/new/choose))
- Opening Pull Requests to fix bugs or make other improvements
- Reviewing (i.e. commenting on) open Pull Requests, to help their creators improve it if needed and allow maintainers to take less time looking into them
- Helping to clarify issues opened by others, commenting and asking for clarification
- Helping people in our [public Discord community](https://discord.gg/J7ejFsZnJ4)

Hatchify is strongly moved by contributions from people like you. All maintainers also work on their free time here.

## Opening Issues

Issues are always very welcome - after all, they are a big part of making Hatchify better. An issue usually describes a bug, feature request, or documentation improvement request.

If you open an issue, try to be as clear as possible. Don't assume that the maintainers will immediately understand the problem. Write your issue in a way that new contributors can also help (add links to helpful resources when applicable).

Learn to use [GitHub flavored markdown](https://help.github.com/articles/github-flavored-markdown) to write an issue that is nice to read.

### Opening an issue to report a bug

It is essential that you provide an [SSCCE](http://sscce.org/)/[MCVE](https://stackoverflow.com/help/minimal-reproducible-example) for your issue. Tell us what is the actual (incorrect) behavior and what should have happened (do not expect the maintainers to know what should happen!). Make sure you checked the bug persists in the latest Hatchify version.

If you can even provide a Pull Request with a failing test (unit test or integration test), that is great! The bug will likely be fixed much faster in this case.

You can also create and execute your SSCCE locally: see [Section 5](https://github.com/bitovi/hatchify/blob/main/CONTRIBUTING.md#running-an-sscce).

### Opening an issue to request a new feature

We're more than happy to accept feature requests! Before we get into how you can bring these to our attention, let's talk about our process for evaluating feature requests:

- A feature request can have three states - _approved_, _pending_ and _rejected_.
  - _Approved_ feature requests are accepted by maintainers as a valuable addition to Hatchify, and are ready to be worked on by anyone.
  - _Rejected_ feature requests were considered not applicable to be a part of the Hatchify. This can change, so feel free to comment on a rejected feature request providing a good reasoning and clarification on why it should be reconsidered.
  - _Pending_ feature requests are waiting to be looked at by maintainers. They may or may not need clarification. Contributors can still submit pull requests implementing a pending feature request, if they want, at their own risk of having the feature request rejected (and the pull request closed without being merged).

Please be sure to communicate the following:

1. What problem your feature request aims to solve OR what aspect of the Hatchify workflow it aims to improve.

2. Under what conditions are you anticipating this feature to be most beneficial?

3. Why does it make sense that Hatchify should integrate this feature?

If we don't approve your feature request, we'll provide you with our reasoning before closing it out. Some common reasons for denial may include (but are not limited to):

- Something too similar to already exists within Hatchify
- This feature seems out of scope of what Hatchify exists to accomplish

We don't want to deny feature requests that could potentially make our users lives easier, so please be sure to clearly communicate your goals within your request!

### Opening an issue to request improvements to the documentation

Please state clearly what is missing/unclear/confusing in the documentation. If you have a rough idea of what should be written, please provide a suggestion within the issue.

## Opening a Pull Request

A Pull Request is a request for maintainers to "pull" a specific change in code (or documentation) from your copy ("fork") into the repository.

Anyone can open a Pull Request, there is no need to ask for permission. Maintainers will look at your pull request and tell you if anything else must be done before it can be merged.

The target of the Pull Request should be the `main` branch.

If you started to work on something but didn't finish it yet, you can open a draft pull request if you want (by choosing the "draft" option). Maintainers will know that it's not ready to be reviewed yet.

A pull request should mention in its description one or more issues that is addresses. If your pull request does not address any existing issue, explain in its description what it is doing - you are also welcome to write an issue first, and then mention this new issue in the PR description.

If your pull request implements a new feature, it's better if the feature was already explicitly approved by a maintainer, otherwise you are taking the risk of having the feature request rejected later and your pull request closed without merge.

Once you open a pull request, our automated checks will run (they take a few minutes). Make sure they are all passing. If they're not, make new commits to your branch fixing that, and the pull request will pick them up automatically and rerun our automated checks.

Note: if you believe a test failed but is completely unrelated to your changes, it could be a rare situation of a _flaky test_ that is not your fault, and if it's indeed the case, and everything else passed, a maintainer will ignore the _flaky test_ and merge your pull request, so don't worry.

A pull request that fixes a bug or implements a new feature must add at least one automated test that:

- Passes
- Would not pass if executed without your implementation

## How to prepare a development environment for Hatchify

### 0. Requirements

Most operating systems provide all the needed tools (including Windows, Linux and MacOS):

- Mandatory:

  - [Node.js](http://nodejs.org). **Currently only version 18 is working**
  - [Git](https://git-scm.com/)

- Optional (recommended):

  - [Docker](https://docs.docker.com/get-docker/) and [Docker Compose Plugin](https://docs.docker.com/compose/install/)
    - It is not mandatory because you can easily locally run tests against SQLite without it.
    - It is practically mandatory if you want to locally run tests against any other database engine (MySQL, MariaDB, Postgres,Db2 and MSSQL), unless you happen to have the engine installed and are willing to make some manual configuration.
  - [Visual Studio Code](https://code.visualstudio.com/)
    - [EditorConfig extension](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
      - Also run `npm install --global editorconfig` (or `yarn global add editorconfig`) to make sure this extension will work properly
    - [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### 1. Clone the repository

Clone the repository (if you haven't already) via `git clone https://github.com/bitovi/hatchify`. If you plan on submitting a pull request, you can create a fork by clicking the _fork_ button and clone it instead with `git clone https://github.com/your-github-username/hatchify`, or add your fork as an upstream on the already cloned repo with `git remote add upstream https://github.com/your-github-username/hatchify`.

### 2. Install the Node.js dependencies

Run `npm ci` within the cloned repository folder.

### 3. Prepare local databases to run tests

#### 3.1. With SQLite (required)

No further configuration is required to test Hatchify against a SQLite database. However, if your feature relies on column type constraints from the database, SQLite does not check these by default. Instead, use validations on your models' columns:

```ts
// hatchify-app/schemas/Todo.ts
export const Todo = {
  name: "Todo",
  attributes: {
    name: "STRING",
    due_date: {
      type: "DATE",
      validate: {
        isDate: true,
      },
    },
    importance: {
      type: "INTEGER",
      validate: {
        isInt: true,
      },
    },
  },
  belongsTo: [{ target: "User", options: { as: "user" } }], // 👀
}
```

A list of all validations that can be used in an attribute's type configuration can be found [here](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/).

#### 3.2 With Postgres (required)

##### Install Postgres

✏️ Perform the following steps to install Postgres:

1. If you don't have Docker installed on your computer yet, download it from [Docker's official website](https://www.docker.com/products/docker-desktop/).

   ```bash
   docker pull postgres
   ```

2. To create and run Postgres database, run the following command:

   ``` bash
   docker run --name postgres-container -p 5432:5432 -e POSTGRES_PASSWORD=example_password -e POSTGRES_USER=example_user -d postgres
   ```

   This installs the official Postgres image from [docker hub](https://hub.docker.com/_/postgres). Note that it configured the following:

   - `POSTGRES_PASSWORD=example_password`
   - `POSTGRES_USER=example_user`

   This also runs Postgres on port 5432.

To check that it worked, run the command:

``` bash
docker ps -a
```

You should see your container details, and the status should be "Up". You can stop your container with the command: `docker stop ${containerId}` and start it again with the command: `docker start ${containerId}`.


##### Create a Database

We need to create a `postgres` database inside postgres. We will
use [DBeaver](https://dbeaver.io/download/), to create the database.

✏️ Perform the following steps to create the `postgres` database:

1. Download and run [DBeaver](https://dbeaver.io/download/).

2. Configure a postgres connection. The following is what needs to be specified to connect to the Postgres in docker:

  ![image](https://github.com/bitovi/hatchify/assets/78602/73768ab0-dbd0-4a41-9da3-c373850a2be3)

  __Click__ the "Test Connection" button to test the connection. If successful, click __Finish__ and go onto the next step.

  If the connection is not successful, make sure you aren't running a
  conflicting Postgres instance (`lsof -i tcp:5432`).  

  For more information on creating a connection, [this tutorial](https://dbeaver.com/2022/03/03/how-to-create-database-connection-in-dbeaver/) shows how to create a connection in DBeaver.

3. Select "Create New Database" on the postgres connection's _Databases_ folder.

   ![DBeaver_23_1_3](https://github.com/bitovi/hatchify/assets/78602/be362599-1378-4344-a1dc-b2cf3cb158fb)

4. Enter `postgres` and click "OK".

   ![image](https://github.com/bitovi/hatchify/assets/78602/f1c95ae6-a877-4284-ba40-046bd566fcaa)

##### Create a .env file with your environment variables

1. Run the following command in the root directory of your project to create a new .env file to store your credentials:

   ``` bash
   echo > .env
   ```

2. Fill your .env file with the following content:

   ```bash
   PG_DB_HOST=localhost
   PG_DB_PORT=5432
   PG_DB_USERNAME=example_user
   PG_DB_PASSWORD=example_password
   PG_DB_NAME=postgres
   ```

#### 3.3. With a database engine in a Docker container (recommended)

If you have Docker installed, use any of the following commands to start fresh local databases of the dialect of your choice:

- For PostgreSQL

  ```bash
  docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
  ```

- For MySQL
  ```bash
  docker run --name mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
  ```

_Note:_ if you're using Windows, make sure you run these from Git Bash (or another MinGW environment), since these commands will execute bash scripts. Recall that [it's very easy to include Git Bash as your default integrated terminal on Visual Studio Code](https://code.visualstudio.com/docs/editor/integrated-terminal).

Each of these commands will start a Docker container with the corresponding database, ready to run Hatchify tests (or an SSCCE).

You can run `docker stop my_container` to stop the servers once you're done.

##### Hint for Postgres

You can also easily start a local [pgadmin4](https://www.pgadmin.org/docs/pgadmin4/latest/) instance at `localhost:8888` to inspect the contents of the test Postgres database as follows:

```bash
docker run -d --name pgadmin4 -p 8888:80 -e 'PGADMIN_DEFAULT_EMAIL=test@example.com' -e 'PGADMIN_DEFAULT_PASSWORD=hatchify_test' dpage/pgadmin4
```

### 4. Running tests

Hatchify is a monorepo and uses `nx` to run scripts in each of the packages. The syntax for the commands is: `npx nx` followed by the package name. For example:

```bash
npx nx test @hatchifyjs/koa
```

For more information about using `nx` commands, use the [NX Documentation](https://nx.dev/reference/commands).

Before starting any work, try to run the tests locally in order to be sure your setup is fine. Start by running the SQLite tests:

```bash
npx nx test @hatchifyjs/koa
```

Then, if you want to run tests for another package, you can run all tests in parallel:

```bash
npx nx run-many -t test
```

or individually:

- `npx nx test @hatchifyjs/design-mui`
- `npx nx test @hatchifyjs/express`
- `npx nx test @hatchifyjs/hatchify-core`
- `npx nx test @hatchifyjs/koa`
- `npx nx test @hatchifyjs/node`
- `npx nx test @hatchifyjs/react`
- `npx nx test @hatchifyjs/react-jsonapi`
- `npx nx test @hatchifyjs/react-rest`
- `npx nx test @hatchifyjs/react-ui`
- `npx nx test @hatchifyjs/rest-client`
- `npx nx test @hatchifyjs/rest-client-jsonapi`

You can also run the Playwright E2E tests:

```bash
npx playwright install
npx playwright test
```

#### 4.1. Testing aginst a Hatchify app

After creating an app like the example in [the getting started guide](./README.md), you can test it against your hatchify changes by changing the package dependency references to packages in your Hatchify development directory.

```json
// hatchify-app/package.json
// assuming hatchify and the hatchify-app are in sibling folders:
{
  // ...
  "dependencies": {
    "@hatchifyjs/koa": "file:../hatchify/packages/koa",
    "@hatchifyjs/react": "file:../hatchify/packages/react"
    // ...
  }
  // ...
}
```

### 5. Commit your modifications

We squash all commits into a single one when we merge your PR.
That means you don't have to follow any convention in your commit messages,
but you will need to follow the [Conventional Commits Conventions](https://www.conventionalcommits.org/en/v1.0.0/) when writing the title of your PR.

We will then use the title of your PR as the message of the Squash Commit. It will then be used to automatically generate a changelog and calculate the next [semver](https://semver.org/) version number.

We use a simple conventional commits convention:

- The allowed commit types are: `docs`, `feat`, `fix`, `meta`.

Example:

```
feat: support specifying a custom name for enums
```

Happy hacking and thank you for contributing.

## Coding guidelines

We use ESLint and Prettier to enforce coding guidelines. You can run it like this:

```bash
npx nx eslint @hatchifyjs/koa
```

```bash
.
├── CONTRIBUTING.md                             # This file
├── README.md                                   # Getting started guide, currently in https://bitovi.atlassian.net/l/cp/BAsHxXaC
├── example                                     # An example app created by following the guide above and used by Playwright
│   ├── hatchify-app
│   │   ├── backend
│   │   │   └── index.ts
│   │   ├── frontend
│   │   │   ├── App.css
│   │   │   ├── App.tsx
│   │   │   ├── assets
│   │   │   ├── index.css
│   │   │   ├── main.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── public
│   │   │   └── vite.svg
│   │   ├── schemas
│   │   │   ├── todo.ts
│   │   │   └── user.ts
│   │   ├── tsconfig.backend.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── index.ts
│   ├── react-mui-demo
│   │   ├── index.html
│   │   ├── mockServiceWorker.js
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── App2.tsx
│   │   │   ├── components
│   │   │   ├── index.css
│   │   │   ├── main.tsx
│   │   │   ├── mocks
│   │   │   ├── pages
│   │   │   ├── schemas
│   │   │   ├── types
│   │   │   └── vite-env.d.ts
│   │   └── tsconfig.json
│   └── react-rest
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── public
│       │   ├── mockServiceWorker.js
│       │   └── vite.svg
│       ├── src
│       │   ├── App.css
│       │   ├── App.tsx
│       │   ├── assets
│       │   ├── index.css
│       │   ├── main.tsx
│       │   ├── mocks
│       │   └── vite-env.d.ts
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
├── example.sqlite                              # Your local SQLite database data file
├── nx.json                                     # NX configuration (Package-Based Repo)
├── package-lock.json
├── package.json
├── packages
│   ├── design-mui                              # @hatchifyjs/design-mui; Material UI implementation on of Hatcify's React components
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── components                      # Material UI components which implement interfaces provided by `react-ui`
│   │   │   ├── design-mui.ts
│   │   │   ├── presentation
│   │   │   └── services
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── express                                 # @hatchifyjs/express; Hatchify for Express, a wrapper around @hatchifyjs/node
│   │   ├── JSONAPI.md                          # Documentation around JSON:API
│   │   ├── LICENSE.md
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── NAMING.md
│   │   │   ├── attributes.spec.ts
│   │   │   ├── custom.spec.ts
│   │   │   ├── exports.ts                      # Exports to be used by the Express package users
│   │   │   ├── express.ts                      # @hatchifyjs/express entry point
│   │   │   ├── jsonapi.spec.ts
│   │   │   ├── middleware                      # The actual source code of this package which is a wrapper around @hatchifyjs/node
│   │   │   ├── relationships.spec.ts           # "E2E" tests for our Express implementation
│   │   │   ├── schema.spec.ts
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   ├── hatchify-core                           # @hatchifyjs/hatchify-core; Hatchify's schemas
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── hatchify-core.ts
│   │   │   ├── types                           # The "new schema"
│   │   │   └── vite-env.d.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── koa                                     # @hatchifyjs/koa; Hatchify for Koa, a wrapper around @hatchifyjs/node
│   │   ├── JSONAPI.md                          # Documentation around JSON:API
│   │   ├── LICENSE.md
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── NAMING.md
│   │   │   ├── attributes.spec.ts
│   │   │   ├── custom.spec.ts
│   │   │   ├── error-codes.spec.ts             # "E2E" tests for our Koa implementation
│   │   │   ├── exports.ts                      # Exports to be used by the Koa package users
│   │   │   ├── jsonapi.spec.ts
│   │   │   ├── koa.ts                          # @hatchifyjs/koa entry point
│   │   │   ├── middleware                      # The actual source code of this package which is a wrapper around @hatchifyjs/node
│   │   │   ├── relationships.spec.ts           # "E2E" tests for our Koa implementation
│   │   │   ├── schema.spec.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.tsbuildinfo
│   │   └── typedoc.json
│   ├── node                                    # @hatchifyjs/node; Hatchify's backend core
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── error                           # Error types and handlers
│   │   │   ├── everything                      # Combines `parse`, `model`, and `serialize`
│   │   │   ├── exports.ts                      # Exports to be used by the Express and Koa packages
│   │   │   ├── internals.spec.ts               # The only unit tests we have so far
│   │   │   ├── middleware                      # Middleware generators to wrap CRUD operations
│   │   │   ├── node.ts                         # @hatchifyjs/node entry point
│   │   │   ├── parse                           # Request body parsing
│   │   │   ├── schema                          # A utility function to return the Hatchify schema for a model by its name
│   │   │   ├── sequelize                       # Utilities around the Sequelize ORM
│   │   │   ├── serialize                       # Utilities for serializing/deserializing requests and responses
│   │   │   └── types                           # Exported types, basically what we call the "old schema"
│   │   ├── tsconfig.json
│   │   └── tsconfig.tsbuildinfo
│   ├── react                                   # @hatchifyjs/react; Entry point for apps wanting Hatchify's React components and hooks
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── react.test.ts
│   │   │   └── react.tsx                       # Re-exports from `hatchify-core`, `react-ui`, `design-mui`, and `rest-client-jsonapi`
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── react-jsonapi                           # @hatchifyjs/react-jsonapi; Entry point for apps wanting Hatchify's data fetching
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── react-jsonapi.test.ts
│   │   │   └── react-jsonapi.tsx               # Provides a new function to create an instance of `react-rest` using `rest-client-jsonapi`
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── react-rest                              # @hatchifyjs/react-rest; Adds React-specific data fetching (hooks) on top of the `rest-client` functions
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── react-rest.ts
│   │   │   ├── services                        # Contains React data-fetching hooks
│   │   │   └── vite-env.d.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── react-ui                                # @hatchifyjs/react-ui; React components that tie together `design-*` components with `react-rest` data-fetching
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── components                      # Components that pull design components from "presentation context" and implement `react-rest`
│   │   │   ├── hatchifyReact                   # Function that returns an instance of a Hatchify React "app"
│   │   │   ├── presentation                    # Types used across `react-ui` and `design-*` packages
│   │   │   ├── react-ui.ts
│   │   │   ├── services                        # Helper functions for translating schemas to component props
│   │   │   └── services-legacy                 # Legacy helper functions for components that have not integrated with `react-rest`
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── rest-client                             # @hatchifyjs/rest-client; Data-fetching functions that are not framework-specific
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── rest-client.ts
│   │   │   ├── services                        # Contains promise-based data-fetching functions, in-memory store implementation, and functions to subscribe to the store
│   │   │   └── vite-env.d.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── rest-client-jsonapi                     # @hatchifyjs/rest-client-jsonapi; Responsible for making network requests to a JSON:API-compliant backend
│       ├── package.json
│       ├── src
│       │   ├── mocks
│       │   ├── rest-client-jsonapi.ts
│       │   ├── services                        # Contains CRUD functions for interacting with a backend
│       │   ├── setupTests.ts
│       │   └── vite-env.d.ts
│       ├── tsconfig.json
│       └── vite.config.ts
├── playwright.config.ts
├── scripts
│   ├── check-packages.ts
│   └── lib
│       └── packages.ts
├── tests
│   ├── getting-started-hatchify-app.spec.ts
│   └── getting-started-react-rest.spec.ts
└── tsconfig.json
```
