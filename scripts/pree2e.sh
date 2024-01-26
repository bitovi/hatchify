#!/bin/sh
cd e2e;
rm -rf hatchify-app;
node ../packages/create/index.js hatchify-app \
    --frontend ${npm_config_frontend} \
    --backend ${npm_config_backend} \
    --database ${npm_config_database} \
    --path ../../packages;
cp schemas.txt hatchify-app/schemas.ts;
cp App.txt hatchify-app/frontend/App.tsx;