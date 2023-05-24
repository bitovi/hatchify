# About Scaffold

Scaffold is a web application framework designed to accelerate the development of new, or enhancement of existing, CRUD applications. If all you need is a simple CRUD application Scaffold can provide you with a fully functional system straight from your database schema. If you have more specialized requirements Scaffold makes it easy to customize every part of the application to meet your needs.

Scaffold enables you to make changes to your database schema and customize app behavior independently. When using code generation tools you have to write your schema and then generate your code, but once you start making customizations you cant re-run the generator without losing your customizations.

Scaffold is NOT code generation, its a system of modular and hierarchial libraries that can be consumed piecemeal to use as much or as little of Scaffolds abilities as you require.

# Quick Start Guide

Create a new Koa + Scaffold project. You can use `npm init` to create a new nodejs project.

```bash
npm init
```

Install Scaffold along with the Koa web framework into your newly defined project

```bash
npm i koa @bitovi/scaffold
```

Create an `index.js` file containing the following 'Hello World' example code

```typescript
import Koa from "koa";
import path from "path";
import { Scaffold, DataTypes } from "@bitovi/scaffold";

const User = {
  name: "User",
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  },
};

const app = new Koa();
const scaffold = new Scaffold([User], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "example.sqlite"),
  },
});

app.use(scaffold.middleware.allModels.all);

app.use(async (ctx) => {
  ctx.body = "Hello From Koa";
});

app.listen(3000, () => {
  console.log("Started on port 3000");
});
```

Run the example using `node index.js` to see it in action! At this point you can created an entire application that can perform CRUD operations to a persistant sqlite database for our example `User` model.

```bash
node index.js
```

To check that things are working correctly you can try the following URLs:

- http://localhost:3000/api/scaffold/
  - This is a test URL that will show the loaded Scaffold endpoints
  - You should see a GET, PUT, POST and DELETE endpoints for the User model
- http://localhost:3000/test
  - This is a URL that is NOT being handled by Scaffold
  - You should see 'Hello From Koa' as this endpoint hits the default non-CRUD handler

Thats it! You have a basic CRUD application up and running. For more examples and detailed usage of what you can do with Scaffold, take a look at the more complete 'Getting Started Tutorial' below.

Have more questions? Check out our Slack!

[![Join our Slack](https://img.shields.io/badge/slack-join%20chat-611f69.svg)](https://www.bitovi.com/community/slack?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# How It Works

A project using Scaffold is generally made up of a few different parts, the backend service layer, the frontend display layer, and a database schema layer. Scaffold builds on top of the popular Koa web framework and can be added to any Koa app via Middleware.

Scaffold, using your database schema files, can inject REST endpoints into the Koa application providing CRUD operations, data validation, authentication tools, and more with zero configuration. Unlike many other tools all of this processing is done at runtime and does not require any code generators to function.

The first part is a Koa Application, Koa is a robust web framework for creating web applications and APIs in a modern, expressive, way focusing on async Middleware functions.

Scaffold can be integrated into any Koa Application as Middleware.

# Getting Started Tutorial

Create a new Koa + Scaffold project. You can use `npm init` to create a new nodejs project.

```bash
npm init
```

Install Scaffold along with the Koa web framework into your newly defined project

```bash
npm i koa @bitovi/scaffold
```

Create an `index.js` file containing the following 'Hello World' example code

```typescript
import Koa from "koa";
import path from "path";
import { Scaffold, DataTypes } from "@bitovi/scaffold";

const User = {
  name: "User",
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  },
};

const app = new Koa();
const scaffold = new Scaffold([User], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "example.sqlite"),
  },
});

app.use(scaffold.middleware.allModels.all);

app.use(async (ctx) => {
  ctx.body = "Hello From Koa";
});

app.listen(3000, () => {
  console.log("Started on port 3000");
});
```

At this point you have created a Koa application with Scaffold connected as Middleware. In this above example we are configuring Scaffold to use sqlite as a database and to store any of our data in the `example.sqlite` file.

The most important step in working with Scaffold is creating Models that define the data within your application. Lets take a look at this example `Models.js` file containing two different exported Models:

```typescript
import { DataTypes } from "@bitovi/scaffold/types";

export const Player = {
  name: "Player",
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  },
  belongsTo: [{ target: "Team" }],
};

export const Team = {
  name: "Team",
  attributes: {
    name: DataTypes.STRING,
  },
  hasMany: [{ target: "Player", options: { as: "players" } }],
};
```

This is pretty simple!

The only things you are required to provide are a `name` for your model and the `attributes` that will be held within it. These attributes will map into columns inside your database table. If you have written ORM models before, specifically Sequelize, this should look pretty familiar to you. Scaffold uses Sequelize, a Node.js and TypeScript compatible ORM, under the hood to talk to your database.

Now that we have a Schema defined, we can update our application code accordingly:

```typescript
import Koa from "koa";
import path from "path";
import { Scaffold, DataTypes } from "@bitovi/scaffold";
import { Player, Team } from "./Models";

const app = new Koa();
const scaffold = new Scaffold([Player, Team], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "example.sqlite"),
  },
});

app.use(scaffold.middleware.allModels.all);

app.use(async (ctx) => {
  ctx.body = "Hello From Koa";
});

app.listen(3000, () => {
  console.log("Started on port 3000");
});
```

In the above example, if we run our application, Scaffold will create CRUD application endpoints for our newly imported `Player` and `Team` models automatically. If you try any other URLs you will get back the default 'Hello From Koa' response.

If you create additional schema files you can simply import them the same way, passing them into the array in the Scaffold constructor. This step will take care of not only adding your schema files, but also validating them against each other, setting up relationships, and configuring the behavior of the frontend components for you.

Next we can start up the Scaffold to see everything in action.

```
node index.js
```

You can use a REST Client to experiment with some of the following endpoints to see them in action:

- GET http://localhost:3000/api/Players
- POST http://localhost:3000/api/Players

Now that we have our basic application up and running we can start looking at how to make changes and further develop our example

One of the first things that we might want to explore is how we can add (or remove) fields from our Models and see how this is reflected in the CRUD endpoints.

Taking the same models as before, now we want to add a new field for the Players. Maybe now we also want to include their position on the team. If we use these models to describe a Football team we could create an ENUM field of positions:

```typescript
import { DataTypes } from "@bitovi/scaffold/types";

export const Player = {
  name: "Player",
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    position: DataTypes.ENUM([
      "quarterback",
      "offensive_lineman",
      "running_back",
      "fullback",
      wide_receiver,
    ]),
  },
  belongsTo: [{ target: "Team" }],
};

export const Team = {
  name: "Team",
  attributes: {
    name: DataTypes.STRING,
  },
  hasMany: [{ target: "Player", options: { as: "players" } }],
};
```

Now that we have this new field defined within our model we can start the Scaffold application again.

```
node index.js
```

You can use a REST Client to experiment with some of the following endpoints to see them in action:

- GET http://localhost:3000/api/Players
- POST http://localhost:3000/api/Players

# Project Customization

While Scaffold gives you a lot of power out of the box many applications, especially as they grow in complexity, need to apply custom rules and logic to their CRUD operations. Scaffold is prepared for this as well, allowing you to easily and flexibly override any of the default behavior to fit your needs. Even though you have customized the solution you can still use many of the Scaffold helper functions and features to accelerate even your custom workflow development.

For example, if you had a new `User` model that needed special authorization rules you can quickly add this functionality yourself while still retaining all the other benefits of the Scaffold system.

Lets take a look at our same sample application again, but this time make a few customizations

```typescript
import Koa from "koa";
import KoaRouter from "@koa/router";
import path from "path";
import { Scaffold } from "@bitovi/scaffold";
import { Player, Team, User } from "./Models";

const app = new Koa();
const router = new KoaRouter();

const scaffold = new Scaffold([Player, Team, User], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "example.sqlite"),
  },
});

router.get("/User", async (ctx, next) => {
  if (ctx.headers.authorization !== "custom-value") {
    ctx.throw(401, "Bad Auth Token");
  }
  ctx.body = await scaffold.everything.User.findAll(ctx.query);
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(scaffold.middleware.allModels.all);

app.use(async (ctx) => {
  ctx.body = "Hello From Koa";
});

app.listen(3000, () => {
  console.log("Started on port 3000");
});
```

From this example you can see a few of the functions that Scaffold exports for you. These model functions, along with more generic helpers, allow you to manipulate models, format data, and parse incoming request params with ease.

# Alternative Database Configuration

The main Scaffold constructor can, optionally, take a database parameter that can be used to configure a large variety of relational database connections.

This example shows how to use a sqlite local file storage

```typescript
const scaffold = new Scaffold([Player, Team, User], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "example.sqlite"),
  },
});
```

This example shows how to use a postgresql database

```typescript
const scaffold = new Scaffold([Player, Team, User], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    username: "example_user",
    password: "example_password",
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

# Additional Endpoints

Because Scaffold goes hand in hand with the Koa web framework adding additional routes is very easy and flexible. You can start by adding Koa Router with npm i @koa/router to your project.

```
npm i @koa/router
```

Simply hook this into your existing Koa instance

```typescript
import Koa from "koa";
import KoaRouter from "@koa/router";

const app = new Koa();
const router = new KoaRouter();

router.get("/custom-route", async (ctx) => {
  ctx.body = "Hello Koa Router";
});

app.use(router.routes());
app.use(router.allowedMethods());
```

Within your custom route you can still take advantage of many Scaffold functions using the provided exports. These exported functions allow you to access:

- Scaffold Models
- Model Validation Rules
- JSON:API Serializers

Here is a more complete example using many of the Scaffold built in helpers to perform some report generation across many database tables

```typescript
import Koa from "koa";
import KoaRouter from "@koa/router";
import path from "path";
import { Scaffold, Op } from "@bitovi/scaffold";
import { Player, Team, User } from "./Models";

const app = new Koa();
const router = new KoaRouter();

const scaffold = new Scaffold([Player, Team, User], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "example.sqlite"),
  },
});

router.get("/generate-report", async (ctx) => {
  const requestedStartDate = ctx.params.startDate;

  const users = await scaffold.model.UserModel.findAndCountAll({
    where: {
      startDate: {
        [Op.gt]: requestedStartDate,
      },
    },
  });

  const teams = await scaffold.model.TeamModel.findAndCountAll();

  const usersResult = await scaffold.serialize.UserModel.findAndCountAll(users);
  const teamsResult = await scaffold.serialize.TeamModel.findAndCountAll(teams);

  ctx.body = { users: usersResult, teams: teamsResult };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(scaffold.middleware.allModels.all);

app.listen(3000, () => {
  console.log("Started on port 3000");
});
```

# API Endpoint Enhancement

One common need when building expressive REST APIs is the ability to create friendly aliases for certain things. Lets look at an example creating a special query param value that gets mapped into a different value.

We will create a query parameter alias that takes the string `today` and turns it into the current date/time stamp. Take a look at the following code block:

```typescript
import Koa from "koa";
import KoaRouter from "@koa/router";
import path from "path";
import { Scaffold } from "@bitovi/scaffold";
import { Player, Team, User } from "./Models";

const app = new Koa();
const router = new KoaRouter();

const scaffold = new Scaffold([Player, Team, User], {
  name: "Scaffold Demo",
  prefix: "/api",
  db: {
    dialect: "sqlite",
    storage: path.join(__dirname, "example.sqlite"),
  },
});

router.get(
  "/users",
  async (ctx, next) => {
    if (ctx.params.startDate && ctx.params.startDate === "today ") {
      const today = new Date();
      ctx.params.startDate = today;
    }

    if (ctx.params.startDate && ctx.params.startDate === "yesterday ") {
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      ctx.params.startDate = yesterday;
    }
    await next();
  },
  scaffold.middleware.User.findAll
);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(scaffold.middleware.allModels.all);

app.listen(3000, () => {
  console.log("Started on port 3000");
});
```

In this example if we see the string ‘today’ or ‘yesterday’ as our stateDate query parameter we can override the value to replace it with a proper JavaScript Date object.

# Application Data Validation

One of the most important things when building CRUD applications is data integrity. Scaffold can help here as well by providing easy hooks to provide validation logic. These functions are extremely helpful when trying to compare between values within your model when creating or updateing a record.

For an example, if we created an Employee model that describes someone working at a company, we might want to know the first name, last name, as well as their start date, and end date of employment.

An important validation here would be to verify that we don't create (or update) a user to have an end_date that is before their start date!

```typescript
export const Employee = {
  name: "Employee",
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
  },
  validation: {
    startDateBeforeEndDate() {
      if (
        this.start_date &&
        this.end_date &&
        this.start_date <= this.end_date
      ) {
        throw new Error("START_DATE_MUST_BE_BEFORE_END_DATE");
      }
    },
  },
};
```

# Advanced Data Validation

Lets take a look at doing more complicated data validation using Scaffold. In the example below we have two Models, Assignment and Employee. In this situation we have employees that we need to assign work to, but an employee can only be on one assignment at a time.

At create time, how can we verify that the employee is not already working on a project? In other words, the start and end date for an assignment cannot have any overlap for the same employee.

In order to achieve this we can start by creating an override for the Assignment ‘create’ function. Our new behavior should do the following:

- Check that the incoming body is, generally, valid to create an Assignment. If not, we can error and return early
- Start a transaction so we can be sure that the data for this create stays in sync with our validation
- Do the actual date overlap check, this is a series of database queries
  - If we do have overlap, rollback the transaction and error
  - If we do not have overlap, allow assignment creation

The following example code shows one way of tackling this problem:

```typescript
import Koa from "koa";
import KoaRouter from "@koa/router";
import path from "path";
import {
  Scaffold,
  Op,
} from "@bitovi/scaffold";
import { Assignment, Employee } from "./Models"

const app = new Koa();
const router = new KoaRouter();

const scaffold = new Scaffold([Assignment, Employee], {
    name: "Scaffold Demo",
    prefix: "/api",
    db: {
        dialect: 'sqlite',
        storage: path.join(__dirname, 'example.sqlite')
    }
});


router.post('/Assignment', await (ctx, next) => {
  if (!scaffold.validate.Assignment.create(ctx)) {
    ctx.throw('bad')
  }

  const { start_date, end_date, employee_id } = ctx.body;

  // Get a transaction
  const check_overlap = scaffold.useTransaction()

  let assignmentsForEmployee = [];
      assignmentsForEmployee = await scaffold.models.Assignment.findAll({
        where: {
            employee_id: employee_id
        }
      }, {transaction: check_overlap});

      assignmentsForEmployee = await scaffold.models.Assignment.findAll({
        where: {
            employee_id: employee_id,
            [Op.and]: {
                start_date: {
                    [Op.gt]: start_date
                },
                end_date: {
                    [Op.lt]: end_date
                }
            }
        }
      }, {transaction: check_overlap})

      if (assignmentsForEmployee.length > 0) {
        await check_overlap.rollback()
        ctx.throw(409, "EMPLOYEE_ALREADY_ASSIGNED");
      }

    const assignment = await scaffold.everything.Assignment.create(ctx.query, {
      transaction: check_overlap
    });
    await check_overlap.commit();

    ctx.body = assignment
    ctx.status = 201;
})

app.use(router.routes());
app.use(router.allowedMethods());
app.use(scaffold.middleware.allModels.all);

app.listen(3000, () => {
    console.log("Started on port 3000");
});

```

# Model Relationships

Scaffold can help you define and build complex relationships between different models within your application. In our previous examples we have used Players and Teams to briefly describe a relationship. Lets take a look at that example again:

```typescript
import { DataTypes } from "@bitovi/scaffold/types";

export const Player = {
  name: "Player",
  attributes: {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  },
  belongsTo: [{ target: "Team" }],
};

export const Team = {
  name: "Team",
  attributes: {
    name: DataTypes.STRING,
  },
  hasMany: [{ target: "Player", options: { as: "players" } }],
};
```

We can see that the `Player` has a `belongsTo` property that names `Team` as the target. Similarially, the `Team` contains a `hasMany` property that names `Player` as the target. Given this description we can reason that a Team can have many players and each Player can belong to a single Team.

For another example lets look at `Movies` and `Actors`. Unlike `Players` and `Teams` an Actor CAN be in more than one Movie and a Movie can contain many Actors. How could we describe this sort of relationship?

```typescript
import { DataTypes } from "@bitovi/scaffold/types";

export const Actor = {
  name: "Actor",
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
  },
  belongsToMany: [{ target: "Movie", options: { through: "ActorMovies" } }],
};

export const Movie = {
  name: "Movie",
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
  },
  belongsToMany: [{ target: "Actor", options: { through: "ActorMovies" } }],
};
```

In this case both models contain a belongsToMany type relationship. One of the differences here is that we need another table to help us define this complex many-to-many relationship. We can see this as the `through` option providing a table name of `ActorMovies`.

For more information on these relationships and the options available check the [documentation for Sequelize](https://sequelize.org/docs/v6/core-concepts/assocs/).

# Need help or have questions?

This project is supported by [Bitovi](https://www.bitovi.com/backend-consulting/nodejs-consulting) a Nodejs consultancy. You can get help or ask questions on our:

- [Slack Community](https://www.bitovi.com/community/slack)
- [Twitter](https://twitter.com/bitovi)

Or, you can hire us for training, consulting, or development. [Set up a free consultation.](https://www.bitovi.com/backend-consulting/nodejs-consulting)
