# Production / Custom Usage Guide

So you developed a nice app, and you might be wondering how I prepare for deployment to production. We know that production might be accessible to a large audience, possibly to everyone, and therefore there are steps we want to take to reduce what is running on these servers so we reduce the number of vulnerabilities. This guide will work through deploying with Docker:

## How to build our Vite frontend to static files suitable for hosting on any web server / CDN / etc.?

The development server runs on [Vite](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/). Vite is a development server so while it helps building apps faster, it is not intended for production. From a frontend perspective, the app is just a folder of static assets (HTML, JavaScript, and CSS files). In order to create this folder from our source code, we will want to run:

```bash
npm run build:frontend
```

Well done, now we have all our static assets under `dist/frontend`.

## How to build our backend to run without TypeScript and the Vite dev server middleware?

While we want our production to run [Koa](https://koajs.com/) or [Express](https://expressjs.com/) similar to our development server, it is also using [TypeScript](https://www.typescriptlang.org/) that is not needed in production, and it integrates [Vite](https://vitejs.dev/) middleware to be able to develop with a single executable. Furthermore, a production server signals to our dependencies that we are running in production so performance tweaks can take place. Some logging might not be necessary, caching can be leveraged, etc. Build the backend code using the following command:

```bash
npm run build:backend
```

Great, now we have an optimized JavaScript version under `dist/backend`. To run it without the Vite dev middleware we can run it with the `NODE_ENV` environment variable set to `production`:

```bash
NODE_ENV=production node dist/backend/backend/index.js
```

## How to build a docker image for hosting the backend and the frontend under a single proxy domain?

There are many ways to skin a cat when it comes to deploying our app to production servers. One of
the easier ones is using Docker. What's great about Docker is that you can have a fair simulation of
the deployed infrastructure tested locally before it gets deployed.

We will use Docker to: host a Postgres database, run the backend API server, and include
[Nginx](https://www.nginx.com/) to serve frontend assets and proxy API requests.

Before continuing make sure you have Docker installed, when the version command `docker version`
completes successfully then Docker is correctly installed.

Now that Docker is ready let's create four files at the root of our project:

### `backend.dockerfile`

Starts the server code that hosts the API. In this file we:

- Specify the Node version we need
- Copy only the compiled Javascript files required for the app to run into the container
- Install the `pg` package to communicate with the Postgres DB.
- Build the dependencies for the OS of the container
- Specify the command to execute the server

```docker
# backend.dockerfile
FROM node:20
WORKDIR /usr/src/hatchify
COPY ["package.json", "package-lock.json", "./"]
# Install the `pg` package when using the Postgres DB.
RUN npm install pg
RUN npm install --production --silent
COPY ./dist/backend .
RUN chown -R node /usr/src/hatchify
USER node
CMD ["npm", "run", "start:backend"]
```

### `nginx.conf`

Used by the Nginx server created as part of the [frontend.dockerfile](#frontenddockerfile).

- Serves frontend static assets
- Proxies API requests to our backend service

```nginx
# nginx.conf
worker_processes 1;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;

  server {
    listen 80;
    add_header Pragma public;
    add_header Cache-Control "public";
    gzip on;
    gzip_types *;
    server_tokens off;

    location / {
      root /var/www;
      try_files $uri /index.html;
      access_log /var/log/nginx/frontend_access.log;
      error_log /var/log/nginx/frontend_error.log;
    }

    location ~ ^\/api {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header Host $host;
      proxy_pass http://backend:3000;
      access_log /var/log/nginx/backend_access.log;
      error_log /var/log/nginx/backend_error.log;
    }
  }
}

```

### `frontend.dockerfile`

Serves the frontend code.

- Start Nginx
- Copy the configuration we just created
- Copy the static frontend assets into the container

```docker
# frontend.dockerfile
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/frontend /var/www
```

### `docker-compose.yml`

Composes all of the Hatchify containers.

_Note that the database user and password values are provided to the docker container at runtime
using environment variables named `USERNAME` and `PASSWORD`. Before deploying Hatchify to production
you must [replace the default credentials with new
credentials](https://www.postgresqltutorial.com/postgresql-administration/postgresql-change-password/)._

- Setup a Postgres container
- Setup the backend container using the Dockerfile above along with environment variables
- Setup the frontend container using the Dockerfile above and exposing it on port 80

```yaml
# docker-compose.yml
version: "3.4"
services:
  database:
    container_name: database
    image: postgres:alpine
    networks:
      - hatchify-network
    environment:
      - POSTGRES_USER=${USERNAME}
      - POSTGRES_PASSWORD=${PASSWORD}
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  backend:
    container_name: backend
    build:
      context: .
      dockerfile: backend.dockerfile
    environment:
      DB_URI: postgres://postgres:password@database:5432/postgres
      NODE_ENV: production
    depends_on:
      database:
        condition: service_healthy
    networks:
      - hatchify-network
  proxy:
    container_name: proxy
    build:
      context: .
      dockerfile: frontend.dockerfile
    image: proxy
    networks:
      - hatchify-network
    depends_on:
      - backend
    ports:
      - 80:80
networks:
  hatchify-network: {}
```

You are all set. You can go ahead and test it out locally using:

```sh
USERNAME=postgres PASSWORD=password docker compose up --build
```

and navigating to `http://localhost`.

## Next Steps

`docker compose` is good for testing your containers or managing simple deployments, but more complex scenarios will use something like [Kubernetes](https://kubernetes.io/) to orchestrate, load balance and scale your Nginx gateway and API instances separately.

Also, this is just one example of how to deploy the frontend & backend, and that situations where the frontend is delivered via a CDN or the backend is hosted on a different domain (these require [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) support) are also valid configurations.

However, if you choose to stay with Docker, there is a handy [GitHub Action to deploy Docker projects to AWS ](https://www.bitovi.com/blog/deploy-any-docker-project-to-aws-with-github-actions).
