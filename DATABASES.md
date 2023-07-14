# Alternative Database Configuration

You can quickly configure your Hatchify backend to use any of the databases supported by [Sequelize](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor). Depending on your choice of database, you may need to install the drivers and create a database to connect to. In order to simplify this process, we will use Docker.

## Using a Postgres database

In order to configure and use a postgres database, follow the steps below:

#### 1. Postgres' installation: 

-   `Docker` -  There are many different ways to install postgres (brew, choco, downloading the installer for their website), but we choose Docker in this tutorial for its simplicity.
    1. If you don't have docker installed in your computer yet, you can download it from [Dockers official website](https://www.docker.com/products/docker-desktop/).
    2. After installing Docker, you can get postgres official image from [docker hub](https://hub.docker.com/_/postgres). To get a postgres instance, run the command: 
    `docker run --name some-postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres` 
    3. To check that it worked, run the command: `docker ps -a`. You should see your container details and the status should
    be "Up". 
 
#### 2. Create a database: 

There are different options for creating a postgres database; in fact, if you've run the Docker command above, you'll already have a database called "postgres", but if you want to create a new one, a good option is dbeaver:  

 -   `dbeaver` - Dbeaver is a crossplatform database tool, you can install it from the [official website](https://dbeaver.io/download/) and create a connection to postgres as exemplified [this tutorial](https://dbeaver.com/2022/03/03/how-to-create-database-connection-in-dbeaver/). After your connection is set, right-click in your connection, hover over create and select "database" to create a new database.
  
#### 3. Configure Hatchify to use your database: 

If you followed the getting-started guide and installed sqlite, you may remove it with `npm uninstall sqlite3` and install postgres's package with `npm install pg`, to get the types for the postgres
package run `npm install -D @types/pg`.

After that, simply pass the database configurations to Hatchify's constructor: 

```bash
const hatchedKoa = hatchifyKoa([Todo, User], {
  prefix: "/api",
  database: {
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    username: "example_user",
    password: "example_password",
  }
})
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