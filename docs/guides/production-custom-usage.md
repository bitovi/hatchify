# Production / Custom Usage Guide

So you developed a nice app and you might be wondering how do I get prepared for deployment to production. We know that production might be accessibly to a large audience, possibly to everyone, and therefore there are steps we want to take to reduce what is running on these servers so we reduce the amount of vulnerabilities. This guide will try answering a few questions about it:

## How to build our Vite frontend to static files suitable for hosting on any web server / CDN / etc.?

The development server runs on [Vite](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/). Vite is a development server so while it helps building apps faster, it is not needed to run in production. From frontend perspective, frontend is just a folder of static assets (HTML, JavaScript and CSS files). In order to create this folder from our source code, we will want to run:

```bash
npm run build:frontend
```

Well done, now we have all our static assets under `dist/frontend`.

# How to build our backend to run without TypeScript and the Vite dev server middleware?

While we want our production to run [Koa](https://koajs.com/) or [Express](https://expressjs.com/) similar to our development server, it is also running on [TypeScript](https://www.typescriptlang.org/) that is not needed in production, and it integrates [Vite](https://vitejs.dev/) middleware to be able to develop with a single executable. Furthermore, A production server signals to our dependencies that we are running in production so performance tweaks can take place. Some logging might not be necessary, caching can be leveraged, etc.

```bash
npm run build:backend
```

Great, now we have an optimized JavaScript version under `dist/backend`. To run it without the Vite dev middleware we can run it with the `NODE_ENV` environment variable set to `production`:

```bash
NODE_ENV=production node dist/backend/backend/index.js
```

## How to build a docker image for hosting the backend

There are many ways to skin a cat when it comes to deploying our app to production servers. One of the easier ones is using Docker. What's great about Docker is that you can have a fair simulation of the deployed infrastructure tested locally before it gets deployed. In order to do that, we will create a few files at the root of our project:

1. A `backend.dockerfile` file for the backend will:

- Specify the Node version we need
- Copy only the compiled Javascript files required for the app to run into the container
- Build the dependencies for the OS of the container
- Specify the command to execute the server

```docker
# backend.dockerfile
FROM node:20
WORKDIR /usr/src/hatchify
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production --silent
COPY ./dist/backend .
RUN chown -R node /usr/src/hatchify
USER node
CMD ["npm", "run", "start:backend"]
```

2. An `nginx.conf` configuration file will:

- Serve our static assets
- Proxy API requests to our backend service

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

3. A `frontend.dockerfile` file for the frontend will:

- Setup [Nginx](https://www.nginx.com/)
- Copy the configuration we just created
- Copy the static frontend assets into the container

```docker
# frontend.dockerfile
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/frontend /var/www
```

4. A `docker-compose.yml` file at the root of our project will:

- Setup a Postgres container, can be omitted if we have one outside of Docker
- Setup the backend container using the Dockerfile above along with environment variables
- Setup the frontend container using the Dockerfile above and exposing it on port 80
- Setup networks in a way that the frontend is not on the same network with the database

```yaml
# docker-compose.yml
version: "3.4"
services:
  database:
    image: postgres:alpine
    container_name: database
    networks:
      - back-tier
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
  backend:
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
      - back-tier
      - front-tier
  proxy:
    build:
      context: .
      dockerfile: frontend.dockerfile
    image: proxy
    networks:
      - front-tier
    depends_on:
      - backend
    ports:
      - 80:80
networks:
  back-tier: {}
  front-tier: {}
```

You are all set. You can go ahead and test it out locally using:

```bash
docker compose up --build
```

and navigating to http://localhost.

## Next Steps

[Deploy Any Docker Project to AWS with GitHub Actions](https://www.bitovi.com/blog/deploy-any-docker-project-to-aws-with-github-actions)
