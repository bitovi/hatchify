import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import spawn from "cross-spawn"
import minimist from "minimist"
import prompts from "prompts"
import { blue, green, red, reset, yellow } from "kolorist"

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ["_"] })
const cwd = process.cwd()

type ColorFunc = (str: string | number) => string
type Framework = {
  name: string
  display: string
  color: ColorFunc
  dependencies: string[]
  devDependencies: string[]
  databases: FrameworkDatabase[]
}
type FrameworkDatabase = {
  name: string
  display: string
  color: ColorFunc
  dependencies: string[]
  devDependencies: string[]
}

const FRAMEWORKS: Framework[] = [
  {
    name: "koa",
    display: "Koa",
    color: green,
    dependencies: ["koa", "@koa/cors", "@hatchifyjs/koa"],
    devDependencies: ["@types/koa", "@types/koa__cors"],
    databases: [
      {
        name: "koa-sqlite",
        display: "SQLite",
        color: blue,
        dependencies: ["sqlite3"],
        devDependencies: [],
      },
      {
        name: "koa-postgres",
        display: "Postgres",
        color: yellow,
        dependencies: ["pg", "dotenv"],
        devDependencies: ["@types/pg"],
      },
    ],
  },
  {
    name: "express",
    display: "Express",
    color: yellow,
    dependencies: ["express", "cors", "@hatchifyjs/express"],
    devDependencies: ["@types/cors"],
    databases: [
      {
        name: "express-sqlite",
        display: "SQLite",
        color: blue,
        dependencies: ["sqlite3"],
        devDependencies: [],
      },
      {
        name: "express-postgres",
        display: "Postgres",
        color: yellow,
        dependencies: ["pg", "dotenv"],
        devDependencies: ["@types/pg"],
      },
    ],
  },
]

const TEMPLATES = FRAMEWORKS.reduce(
  (acc, framework) =>
    framework.name === "koa" // TODO: It was decided to limit to Koa at the moment
      ? [...acc, ...framework.databases.map(({ name }) => name)]
      : acc,
  [] as string[],
)

const renameFiles: Record<string, string> = {
  _gitignore: ".gitignore",
}

const defaultTargetDir = "hatchify-app"

async function init() {
  const argTargetDir = formatTargetDir(argv._[0])
  const argTemplate = argv.template || argv.t

  let targetDir = argTargetDir || defaultTargetDir
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir

  let result: prompts.Answers<
    "projectName" | "overwrite" | "packageName" | "framework" | "database"
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
          type:
            argTemplate && TEMPLATES.includes(argTemplate) ? null : "select",
          name: "framework",
          message:
            typeof argTemplate === "string" && !TEMPLATES.includes(argTemplate)
              ? reset(
                  `"${argTemplate}" isn't a valid template. Please choose from below: `,
                )
              : reset("Select a framework:"),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework,
            }
          }),
        },
        {
          type: (framework: Framework) =>
            framework && framework.databases ? "select" : null,
          name: "database",
          message: reset("Select a database:"),
          choices: (framework: Framework) =>
            framework.databases.map((database) => {
              const databaseColor = database.color
              return {
                title: databaseColor(database.display || database.name),
                value: database,
              }
            }),
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
  const { framework, overwrite, packageName, database } = result

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    await emptyDir(root)
  } else if (!fs.existsSync(root)) {
    await fs.promises.mkdir(root, { recursive: true })
  }

  // determine template
  const template: string = database?.name || framework?.name || argTemplate

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
    `template-${template}`,
  )

  console.log("--------", {
    root,
    cwd,
    file: fileURLToPath(import.meta.url),
    template: `template-${template}`,
    templateDir,
  })

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
            "dev:backend": "nodemon --esm backend/index.ts --watch backend",
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
  ])

  await fs.promises.rm(path.join(root, "src"), { recursive: true, force: true })

  await copyDir(templateDir, root)

  const dependencies = [
    "sequelize",
    ...framework.dependencies,
    ...database.dependencies,
    "@hatchifyjs/core",
    "@hatchifyjs/react",
  ]
  const devDependencies = [
    ...framework.devDependencies,
    ...database.devDependencies,
    "nodemon",
    "ts-node",
  ]

  runCommand(`npm install ${dependencies.join(" ")}`, root)
  runCommand(`npm install ${devDependencies.join(" ")} --save-dev`, root)

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
  console.log()
}

async function replaceStringInFile(
  filePath: string,
  searchValue: string,
  replaceValue: string,
) {
  const indexHtml = await fs.promises.readFile(filePath, "utf8")

  await fs.promises.writeFile(
    filePath,
    indexHtml.replaceAll(searchValue, replaceValue),
    "utf8",
  )
}

function runCommand(fullCommand: string, cwd: string, silent = false) {
  const [command, ...args] = fullCommand.split(" ")
  const { status } = spawn.sync(command, args, {
    stdio: silent ? [] : "inherit",
    cwd,
  })

  if (status) {
    process.exit(status)
  }
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "")
}

async function copyFile(src: string, dest: string) {
  const stat = await fs.promises.stat(src)
  if (stat.isDirectory()) {
    await copyDir(src, dest)
  } else {
    await fs.promises.copyFile(src, dest)
  }
}

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  )
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-")
}

async function copyDir(srcDir: string, destDir: string) {
  const [files] = await Promise.all([
    fs.promises.readdir(srcDir),
    fs.promises.mkdir(destDir, { recursive: true }),
  ])
  await Promise.all(
    files.map((file) =>
      copyFile(
        path.resolve(srcDir, file),
        path.resolve(destDir, renameFiles[file] ?? file),
      ),
    ),
  )
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === ".git")
}

async function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }

  const files = await fs.promises.readdir(dir)

  await Promise.all(
    files.map((file) =>
      file === ".git"
        ? null
        : fs.promises.rm(path.resolve(dir, file), {
            recursive: true,
            force: true,
          }),
    ),
  )
}

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) {
    return undefined
  }
  const [name, version] = userAgent.split(" ")[0].split("/")
  return { name, version }
}

init().catch((e) => {
  console.error(e)
})
