# create-hatchifyjs <a href="https://npmjs.com/package/@hatchifyjs/create"><img src="https://img.shields.io/npm/v/@hatchifyjs/create" alt="npm package"></a>

## Scaffolding Your First HatchifyJS Project

> **Compatibility Note:**
> HatchifyJS requires [Node.js](https://nodejs.org/en/) version 18 or above.

With NPM:

```bash
npm init @hatchifyjs@latest
```

With Yarn:

```bash
yarn create @hatchifyjs@latest
```

With PNPM:

```bash
pnpm create @hatchifyjs@latest
```

With Bun:

```bash
bunx @hatchifyjs/create@latest
```

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Hatchify + Koa + SQLite project, run:

```bash
# npm 7+, extra double-dash is needed:
npm create @hatchifyjs/create hatchify-app -- --frontend=react --backend=koa --database=sqlite://localhost/:memory

# yarn
yarn create @hatchifyjs/create hatchify-app --frontend=react --backend=koa --database=sqlite://localhost/:memory

# pnpm
pnpm create @hatchifyjs/create hatchify-app --frontend=react --backend=koa --database=sqlite://localhost/:memory

# Bun
bunx @hatchifyjs/create hatchify-app --frontend=react --backend=koa --database=sqlite://localhost/:memory
```

You can use `.` for the project name to scaffold in the current directory.
