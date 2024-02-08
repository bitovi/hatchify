# Hatchify Grid Demo

- <https://hatchify-grid-demo.bitovi-sandbox.com:3000> - React Koa SQLite
- <https://hatchify-grid-demo.bitovi-sandbox.com:3001> - React Koa Postgres

The demo is redeployed on every push to `main`. To deploy a version with the latest changes:

1. Create a new branch
2. Update the dependencies in `package.json`

   ```bash
   npm install @hatchifyjs/core@latest @hatchifyjs/express@latest @hatchifyjs/koa@latest @hatchifyjs/react@latest
   ```

3. The demo will be deployed once the branch is merged into `main`
