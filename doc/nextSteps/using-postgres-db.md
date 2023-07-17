# Using Postgres

You can quickly configure your Hatchify backend to use any of the databases supported by [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor). Depending on your choice of database, you may need to install the drivers and create a database to connect to. In order to simplify this process, we will use Docker.
 
In order to configure and use a Postgres database, follow the steps below:

#### 1. Install Postgres: 

 There are many different ways to install Postgres (brew, choco, downloading the installer for their website), but we choose Docker in this tutorial for its simplicity.
    1. If you don't have docker installed in your computer yet, you can download it from [Dockers official website](https://www.docker.com/products/docker-desktop/).
    2. After installing Docker, you can get Postgres official image from [docker hub](https://hub.docker.com/_/postgres). To get a Postgres instance, run the command: 
    `docker run --name postgres-container -p 5432:5432 -e POSTGRES_PASSWORD=example_password -e POSTGRES_USER=example_user -d postgres`. If you do not have postgres image locally yet, docker will download it.
    3. To check that it worked, run the command: `docker ps -a`. You should see your container details and the status should
    be "Up". 
 
#### 2. Create a database: 

There are different options for creating a Postgres database; in fact, if you've run the Docker command above, you'll already have a database called "postgres", but if you want to create a new one, a good option is dbeaver:  

 -   `dbeaver` - Dbeaver is a crossplatform database tool, you can install it from the [official website](https://dbeaver.io/download/) and create a connection to Postgres as exemplified [this tutorial](https://dbeaver.com/2022/03/03/how-to-create-database-connection-in-dbeaver/). After your connection is set, right-click in your connection, hover over create and select "database" to create a new database.
  
#### 3. Configure Hatchify to use your database: 

If you followed the getting-started guide and installed sqlite, you may remove it with `npm uninstall sqlite3` and install Postgres' package with `npm install pg`, to get the types for the Postgres package run `npm install -D @types/pg`.

After that, simply pass the database configurations to Hatchify's constructor. Since database credentials are sensitive information, we'll be using an env file in this tutorial to store ours. In the root directory, run: ``echo > .env``. This command will create a new file for you, fill it with your credentials:

```bash
HOST=localhost
PORT=5432
USERNAME=example_user
PASSWORD=example_password
```

In order to use those variables, install the dotenv package in your project:  ``npm install dotenv``, then, edit your Hatchify's constructor (located at `backend/index.ts`) to look like this:


```bash
const hatchedKoa = hatchifyKoa([Todo, User], {
  prefix: '/api',
  database: {
    dialect: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
  },
});
```  

The following options are allowed within the db options object:

| Property | Type   | Default   | Details                                                            |
| -------- | ------ | --------- | ------------------------------------------------------------------ |
| host     | string | localhost | The host of the relational database                                |
| port     | number | null      | The port of the relational database                                |
| username | string | null      | The username which is used to authenticate against the database    |
| password | string | null      | The password which is used to authenticate against the database    |
| dialect  | string | null      | One of the following: mysql, postgres, sqlite, db2, mariadb, mssql |
| storage  | string | :memory:  | For sqlite dialect only, specifies the file storage location       |

For a more complete references see the Sequelize documentation [for the instance constructor](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)