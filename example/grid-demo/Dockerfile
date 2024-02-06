## this is a multi-stage build
## use --target backend/frontend to specify which stage to build
## otherwise only frontend builds
## using alpine and then installing node reduces size from 375MB to 269MB
FROM alpine AS base
WORKDIR /app
RUN apk update && apk add npm nodejs~=20
COPY package*.json ./
RUN npm ci
COPY schemas.ts schemas.ts

FROM base AS backend
COPY backend/ backend/
COPY tsconfig*.json ./
COPY frontend/ frontend/
COPY public/ public/
COPY index.html tsconfig.json vite.config.ts ./
EXPOSE $APP_PORT
CMD npm run "dev:$BACKEND:$DATABASE"
