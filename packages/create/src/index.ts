import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import minimist from "minimist"
import prompts from "prompts"
import { red, reset } from "kolorist"
import {
  copyDir,
  emptyDir,
  formatTargetDir,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent,
  replaceStringInFile,
  runCommand,
  toValidPackageName,
} from "./util"
import { DIALECTS, FRAMEWORKS } from "./constants"
import type { Dialect } from "./types"

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ["_"] })
const cwd = process.cwd()

const defaultTargetDir = "hatchify-app"

async function init() {
  const argTargetDir = formatTargetDir(argv._[0])
  const argFramework = (argv.framework || argv.f)?.toUpperCase()
  const argDialect = (argv.dialect || argv.d)?.toUpperCase()

  let targetDir = argTargetDir || defaultTargetDir
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir

  let result: prompts.Answers<
    | "projectName"
    | "overwrite"
    | "packageName"
    | "framework"
    | "dialect"
    | "databaseHost"
    | "databasePort"
    | "databaseUsername"
    | "databasePassword"
    | "databaseName"
  >

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled")
            }
            return null
          },
          name: "overwriteChecker",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },
        {
          type: FRAMEWORKS[argFramework] ? null : "select",
          name: "framework",
          message:
            argFramework && !FRAMEWORKS[argFramework]
              ? reset(
                  `"${argFramework}" isn't a valid framework. Please choose from below: `,
                )
              : reset("Select a framework:"),
          choices: Object.values(FRAMEWORKS)
            .filter(
              (framework) => framework.name === "koa", // TODO: It was decided to limit to Koa at the moment
            )
            .map((framework) => ({
              title: framework.color(framework.display || framework.name),
              value: framework,
            })),
        },
        {
          type: DIALECTS[argDialect] ? null : "select",
          name: "dialect",
          message:
            argDialect && !DIALECTS[argDialect]
              ? reset(
                  `"${argDialect}" isn't a valid dialect. Please choose from below: `,
                )
              : reset("Select a dialect:"),
          choices: Object.values(DIALECTS).map((dialect) => ({
            title: dialect.color(dialect.display || dialect.name),
            value: dialect,
          })),
        },
        {
          type: (dialect: Dialect) =>
            dialect?.name === "postgres" ? "text" : null,
          name: "databaseHost",
          message: reset("Database host:"),
          initial: "localhost",
        },
        {
          type: (_, { dialect }: { dialect: Dialect }) =>
            dialect?.name === "postgres" ? "number" : null,
          name: "databasePort",
          message: reset("Database port:"),
          initial: 5432,
        },
        {
          type: (_, { dialect }: { dialect: Dialect }) =>
            dialect?.name === "postgres" ? "text" : null,
          name: "databaseUsername",
          message: reset("Database username:"),
          initial: "postgres",
        },
        {
          type: (_, { dialect }: { dialect: Dialect }) =>
            dialect?.name === "postgres" ? "password" : null,
          name: "databasePassword",
          message: reset("Database password:"),
          initial: "password",
        },
        {
          type: (_, { dialect }: { dialect: Dialect }) =>
            dialect?.name === "postgres" ? "text" : null,
          name: "databaseName",
          message: reset("Database name:"),
          initial: "postgres",
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled")
        },
      },
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  // user choice associated with prompts
  const framework = result.framework || FRAMEWORKS[argFramework]
  const dialect = result.dialect || DIALECTS[argDialect]
  const {
    overwrite,
    packageName,
    databaseHost,
    databasePort,
    databaseUsername,
    databasePassword,
    databaseName,
  } = result

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    await emptyDir(root)
  } else if (!fs.existsSync(root)) {
    await fs.promises.mkdir(root, { recursive: true })
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : "npm"

  console.log(`\nScaffolding project in ${root}...`)

  runCommand(
    `npm create vite@latest ${targetDir} -- --template react-ts`,
    cwd,
    true,
  )

  const templatePackage = await fs.promises.readFile(
    path.join(root, "package.json"),
    "utf-8",
  )

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `template-${
      argFramework && argDialect
        ? `${argFramework.toLowerCase()}-${argDialect.toLowerCase()}`
        : `${framework.name}-${dialect.name}`
    }`,
  )

  await Promise.all([
    fs.promises.writeFile(
      path.join(root, "package.json"),
      JSON.stringify(
        {
          ...JSON.parse(templatePackage),
          name: packageName || getProjectName(),
          type: undefined,
          scripts: {
            lint: "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
            dev: "npm run dev:backend & npm run dev:frontend",
            "dev:frontend": "vite",
            "dev:backend":
              "nodemon --esm backend/index.ts --watch backend --watch schemas.ts",
            "build:frontend": "tsc && vite build --outDir dist/frontend",
            "build:backend":
              "tsc --outDir dist/backend --project tsconfig.backend.json",
            "start:frontend": "vite preview --outDir dist/frontend",
            "start:backend": "node dist/backend/backend/index.js",
          },
        },
        null,
        2,
      ),
      "utf8",
    ),
    copyDir(path.join(root, "src"), path.join(root, "frontend")),
    replaceStringInFile(path.join(root, "index.html"), "/src", "/frontend"),
    fs.promises.writeFile(
      path.join(root, "tsconfig.json"),
      JSON.stringify(
        {
          experimentalResolver: true,
          compilerOptions: {
            module: "NodeNext",
            moduleResolution: "Node",
            target: "ESNext",
            lib: ["DOM", "DOM.Iterable", "ESNext"],
            jsx: "react-jsx",
            composite: true,
            declaration: true,
            incremental: true,
            strict: true,
            allowJs: false,
            allowSyntheticDefaultImports: true,
            downlevelIteration: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            isolatedModules: true,
            noFallthroughCasesInSwitch: true,
            noImplicitReturns: true,
            noUnusedLocals: true,
            resolveJsonModule: true,
            skipLibCheck: true,
            useDefineForClassFields: true,
          },
          include: ["frontend", "backend", "schemas", "vite.config.ts"],
          exclude: ["node_modules"],
        },
        null,
        2,
      ),
      "utf8",
    ),
    fs.promises.rm(path.join(root, "tsconfig.node.json")),
    fs.promises.writeFile(
      path.join(root, "tsconfig.backend.json"),
      JSON.stringify(
        {
          extends: "./tsconfig.json",
          compilerOptions: {},
          include: ["backend", "schemas"],
        },
        null,
        2,
      ),
      "utf8",
    ),
    fs.promises.writeFile(
      path.join(root, ".env"),
      [
        `PG_DB_HOST=${databaseHost}`,
        `PG_DB_PORT=${databasePort}`,
        `PG_DB_USERNAME=${databaseUsername}`,
        `PG_DB_PASSWORD=${databasePassword}`,
        `PG_DB_NAME=${databaseName}`,
      ].join("\n"),
      "utf8",
    ),
  ])

  await fs.promises.rm(path.join(root, "src"), { recursive: true, force: true })

  await copyDir(templateDir, root)

  const dependencies = [
    "sequelize",
    ...framework.dependencies,
    ...dialect.dependencies,
    "@hatchifyjs/core",
    "@hatchifyjs/react",
    "@mui/material",
    "@emotion/react",
    "@emotion/styled",
  ]
  const devDependencies = [
    ...framework.devDependencies,
    ...dialect.devDependencies,
    "nodemon",
    "ts-node",
  ]

  runCommand(
    `npm install --package-lock-only --no-package-lock --legacy-peer-deps ${dependencies.join(
      " ",
    )}`,
    root,
  )
  runCommand(
    `npm install --package-lock-only --no-package-lock --legacy-peer-deps ${devDependencies.join(
      " ",
    )} --save-dev`,
    root,
  )
  runCommand("npm install", root)

  const cdProjectName = path.relative(cwd, root)
  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
      }`,
    )
  }
  switch (pkgManager) {
    case "yarn":
      console.log("  yarn dev")
      break
    default:
      console.log(`  ${pkgManager} run dev`)
      break
  }

  if (dialect.name === "postgres" && databaseHost === "localhost") {
    console.log()
    console.log(
      "Make sure you have Postgres running already start a docker container using:",
    )
    console.log(
      `docker run --name hatchify-database -p ${databasePort}:5432 -e POSTGRES_PASSWORD=${databasePassword} -e POSTGRES_USER=${databaseUsername} -d ${databaseName}`,
    )
  }

  console.log()
}

init().catch((e) => {
  console.error(e)
})
