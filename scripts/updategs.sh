#!/bin/sh
cd example;
rm -rf getting-started;
node ../packages/create/index.js getting-started \
    --frontend=react \
    --backend=koa \
    --database=sqlite://localhost/:memory
