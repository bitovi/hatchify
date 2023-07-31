# Using Postgres

This guide is a continuation of Hatchify's [getting started guide](../../README.md#project-setup) and will teach you how to set Postgres as your database. You can configure your Hatchify backend to use any of the databases supported by [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor), but this tutorial will focus on Postgres.

> Note: the ✏️ icon indicates when to follow along!
 ## ✏️ Perform the following steps:
  
### Install Postgres: 

You will usually need to install Postgres before you use it in your project, but that process may be hard: there are many different ways to install Postgres (brew, choco, downloading the installer for their website). In order to simplify this tutorial, we will be using Docker to get Postgres.

1. If you don't have Docker installed on your computer yet, you can download it from [Docker's official website](https://www.docker.com/products/docker-desktop/).
  
2. After installing Docker, you can get the official Postgres image from [docker hub](https://hub.docker.com/_/postgres). To get a Postgres instance running, in your terminal, run the command: 
    
    ``` bash
    docker run --name postgres-container -p 5432:5432 -e POSTGRES_PASSWORD=example_password -e POSTGRES_USER=example_user -d postgres
    ```
    
3. To check that it worked, run the command: 

    ``` bash
    docker ps -a
    ```
    
You should see your container details, and the status should be "Up". You can stop your container with the command: `docker stop ${containerId}` and start it again with the command: `docker start ${containerId}`.
 
### Create a database: 

There are different options for creating a Postgres database; in fact, if you've run the Docker command above, you'll already have a database called "postgres", but if you want to create a new one, a good option is DBeaver:  

 -   `DBeaver` - DBeaver is a cross-platform database tool; you can install it from the [official website](https://dbeaver.io/download/) and create a connection to Postgres as exemplified in [this tutorial](https://dbeaver.com/2022/03/03/how-to-create-database-connection-in-dbeaver/) (make sure you use the username and password that we set above, i.e. `example_user` and `example_password`). After your connection is set, right-click in your connection, hover over create and select "database" to create a new database. For this tutorial, we created a database called "todos".
  
### Configure Hatchify's constructor: 

1.  Remove SQLite:

    ``` bash
    npm uninstall sqlite3
    ```
2.  Install Postgres' package:

    ``` bash
    npm install pg
    ```
3.  Install Postgres' types package:

    ``` bash
    npm install -D @types/pg
    ```

    After that, we will need to pass the database configurations to Hatchify's constructor. Since database credentials are sensitive information, we'll be using an env file in this tutorial to store our credentials.

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
    DB_NAME=todos
    ```

6. Install the dotenv package in your project with the command: 

    ```bash
    npm install dotenv
    ```

7. Edit your Hatchify's server (`backend/index.ts`) to use your newly created database:


```bash
// hatchify-app/backend/index.ts
import Koa from "koa"
import cors from "@koa/cors"
import { hatchifyKoa } from "@hatchifyjs/koa"
import dotenv from "dotenv";
import { Todo } from "../schemas/Todo"
import { User } from "../schemas/User"

dotenv.config();

const app = new Koa()
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const hatchedKoa = hatchifyKoa([Todo, User], {
  prefix: "/api",
  database: {
    dialect: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD, 
    database: DB_NAME,
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

8. Restart your server: 

    ```bash
    npm run dev:backend
    ```
    
> Note: the new Postgres db we just created is empty, so you'll need to seed it just like we did in the [getting started guide](../../README.md#seeding-data)

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
