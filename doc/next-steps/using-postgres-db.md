# Using Postgres

This guide is a continuation of Hatchify's [Getting Started Guide](../../README.md#project-setup) and will teach you how to set Postgres as your database. You can configure your Hatchify backend to use any of the databases supported by [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor), but this tutorial will focus on Postgres.

There are two primary steps we must perform:

1. Install Postgres
2. Create a Postgres database instance
3. Update the Getting Started Guide app to use Postgres

> **Note:** the ✏️ icon indicates when to follow along!

## Install Postgres

There are many different ways to install Postgres (brew, choco, downloading the installer for their website). In order to simplify this tutorial, we will be using Docker to get Postgres. We will
then create a `hatchyify-app` database.

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


## Create a Database

We need to create a `hatchify_app` database inside postgres. We will
use [DBeaver](https://dbeaver.io/download/), to create the database.

✏️ Perform the following steps to create the `hatchify_app` database:

1. Download and run [DBeaver](https://dbeaver.io/download/).

2. Configure a postgres connection. The following is what needs to be specified to connect to the Postgres in docker:

  ![image](https://github.com/bitovi/hatchify/assets/78602/73768ab0-dbd0-4a41-9da3-c373850a2be3)

  __Click__ the "Test Connection" button to test the connection. If successful, click __Finish__ and go onto the next step.

  If the connection is not successful, make sure you aren't running a
  conflicting Postgres instance (`lsof -i tcp:5432`).  

  For more information on creating a connection, [this tutorial](https://dbeaver.com/2022/03/03/how-to-create-database-connection-in-dbeaver/) shows how to create a connection in DBeaver.

3. Select "Create New Database" on the postgres connection's _Databases_ folder.

   ![DBeaver_23_1_3](https://github.com/bitovi/hatchify/assets/78602/be362599-1378-4344-a1dc-b2cf3cb158fb)

4. Enter `hatchify_app` and click "OK".

   ![image](https://github.com/bitovi/hatchify/assets/78602/f1c95ae6-a877-4284-ba40-046bd566fcaa)

## Update the Getting Started Guide app to use Postgres

Finally, we need to change our app to use the Postgres database
we just created. As we are dealing with potentially sensitive
database passwords, we are also going to change the app to load
database configuration from an environment file. Read more about
the benefits of storing config in the environment [here](https://12factor.net/config).

✏️ Perform the following steps to connect the Getting Started Guide app to the `hatchify_app` database:

1.  Remove SQLite:

    ``` bash
    npm uninstall sqlite3
    ```
2.  Install Postgres' package and [dotenv](https://www.npmjs.com/package/dotenv):

    ``` bash
    npm install pg dotenv
    ```

    [dotenv](https://www.npmjs.com/package/dotenv) will load our
    configuration.

3.  Install Postgres' types package:

    ``` bash
    npm install -D @types/pg
    ```

4. Run the following command in the root directory of your project to create a new .env file to store your credentials:

  ``` bash
  echo > .env
  ```

5. Fill your .env file with the following content:

  ```bash
  DB_HOST=localhost
  DB_PORT=5432
  DB_USERNAME=example_user
  DB_PASSWORD=example_password
  DB_NAME=hatchify_app
  ```

6. Edit your Hatchify app's server (`backend/index.ts`) to use your newly created database:

  ```js
  // hatchify-app/backend/index.ts
  import Koa from "koa"
  import cors from "@koa/cors"
  import { hatchifyKoa } from "@hatchifyjs/koa"
  import { Todo } from "../schemas/Todo"
  import { User } from "../schemas/User"

  import dotenv from "dotenv"; // 👀
  dotenv.config();             // 👀

  const app = new Koa()

  const hatchedKoa = hatchifyKoa([Todo, User], {
    prefix: "/api",
    database: {
      dialect: "postgres",               // 👀
      host: process.env.DB_HOST,         // 👀
      port: Number(process.env.DB_PORT), // 👀
      username: process.env.DB_USERNAME, // 👀
      password: process.env.DB_PASSWORD, // 👀
      database: process.env.DB_NAME,     // 👀
    },
  })

  app.use(cors())
  app.use(hatchedKoa.middleware.allModels.all);
  (async () => {
    await hatchedKoa.createDatabase()

    app.listen(3000, () => {
      console.log("Started on port 3000")
    })
  })()
  ```  

7. Restart your server:

    ```bash
    npm run dev:backend
    ```



> **Note:** the new Postgres db we just created is empty, so you'll need to seed it just like we did in the [getting started guide](../../README.md#seeding-data)

#### The following options are allowed within the db options object:

| Property | Type   | Default   | Details                                                            |
| -------- | ------ | --------- | ------------------------------------------------------------------ |
| host     | string | localhost | The host of the relational database                                |
| port     | number | null      | The port of the relational database                                |
| username | string | null      | The username which is used to authenticate against the database    |
| password | string | null      | The password which is used to authenticate against the database    |
| dialect  | string | null      | One of the following: mysql, postgres, sqlite, db2, mariadb, mssql |
| storage  | string | :memory:  | For sqlite dialect only, specifies the file storage location       |

For more complete references see the Sequelize documentation [for the instance constructor](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)
