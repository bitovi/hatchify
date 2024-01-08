# Using PostgreSQL

This guide is a continuation of Hatchify's [Getting Started Guide](../../README.md#project-setup) and will teach you how to set PostgreSQL as your database. You can configure your Hatchify backend to use any of the databases supported by [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor), but this tutorial will focus on PostgreSQL.

There are two primary steps we must perform:

1. Install PostgreSQL
2. Create a PostgreSQL database instance
3. Update the Getting Started Guide app to use PostgreSQL

> **Note:** the ✏️ icon indicates when to follow along!

## Install PostgreSQL

There are many different ways to install PostgreSQL (brew, choco, downloading the installer for their website). In order to simplify this tutorial, we will be using Docker to get PostgreSQL. We will then create a `hatchyify_app` database.

✏️ Perform the following steps to install PostgreSQL:

1. If you don't have Docker installed on your computer yet, download it from [Docker's official website](https://www.docker.com/products/docker-desktop/).

2. To create and run PostgreSQL database, run the following command:

   ```bash
   docker run --name postgres-container -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres
   ```

   This installs the official PostgreSQL image from [docker hub](https://hub.docker.com/_/postgres). Note that it configured the following:

   - `POSTGRES_USER=postgres`
   - `POSTGRES_PASSWORD=postgres`

   This also runs PostgreSQL on port 5432.

To check that it worked, run the command:

```bash
docker ps -a
```

You should see your container details, and the status should be "Up". You can stop your container with the command: `docker stop ${containerId}` and start it again with the command: `docker start ${containerId}`.

## Create a Database

We need to create a `hatchify_app` database inside PostgreSQL. We will
use [DBeaver](https://dbeaver.io/download/), to create the database.

✏️ Perform the following steps to create the `hatchify_app` database:

1. Download and run [DBeaver](https://dbeaver.io/download/).

2. Configure a PostgreSQL connection. The following is what needs to be specified to connect to the PostgreSQL in docker:

![image](../attachments/add-postgres.png)

**Click** the "Test Connection" button to test the connection. If successful, click **Finish** and go onto the next step.

If the connection is not successful, make sure you aren't running a
conflicting PostgreSQL instance (`lsof -i tcp:5432`).

For more information on creating a connection, [this tutorial](https://dbeaver.com/2022/03/03/how-to-create-database-connection-in-dbeaver/) shows how to create a connection in DBeaver.

3. Select "Create New Database" on the PostgreSQL connection's _Databases_ folder.

   ![DBeaver_23_1_3](https://github.com/bitovi/hatchify/assets/78602/be362599-1378-4344-a1dc-b2cf3cb158fb)

4. Enter `hatchify_app` and click "OK".

   ![image](https://github.com/bitovi/hatchify/assets/78602/f1c95ae6-a877-4284-ba40-046bd566fcaa)

## Update the Getting Started Guide app to use PostgreSQL

Finally, we need to change our app to use the PostgreSQL database
we just created. As we are dealing with potentially sensitive
database passwords, we are also going to change the app to load
database configuration from an environment file. Read more about
the benefits of storing config in the environment [here](https://12factor.net/config).

✏️ Perform the following steps to connect the Getting Started Guide app to the `hatchify_app` database:

1. Remove SQLite:

   ```bash
   npm uninstall sqlite3
   ```

2. Install PostgreSQL' package and [dotenv](https://www.npmjs.com/package/dotenv):

   ```bash
   npm install pg dotenv
   ```

   [dotenv](https://www.npmjs.com/package/dotenv) will load our
   configuration.

3. Install PostgreSQL' types package:

   ```bash
   npm install -D @types/pg
   ```

4. Update your `.env` file with the following content:

   ```bash
   DB_URI=postgres://postgres:postgres@localhost:5432/hatchify_app
   ```

5. Your server will restart automatically

> **Note:** the new PostgreSQL db we just created is empty, so you'll need to seed it just like we did in the [getting started guide](../../README.md#seeding-data)

#### The following options are allowed within the db options object:

| Property          | Type                                   | Default                    | Details                                                                                                                     |
| ----------------- | -------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| uri               | string                                 | sqlite://localhost/:memory | The database URI / connection string of the relational database. Ex. `postgres://user:password@host:port/database?ssl=true` |
| logging           | (sql: string, timing?: number) => void | undefined                  | A function that gets executed every time Sequelize would log something.                                                     |
| additionalOptions | object                                 | undefined                  | An object of additional options, which are passed directly to the connection library.                                       |
