import type { JestConfigWithTsJest } from "ts-jest"

const config: JestConfigWithTsJest = {
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: { ".+\\.ts$": "ts-jest" },
  moduleNameMapper: {
    "@hatchifyjs/node": "<rootDir>/../node/src/exports.ts",
  },
}

export default config
