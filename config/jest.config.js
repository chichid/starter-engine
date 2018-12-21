const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

const args = process.argv.slice(2);
const isWatch = args.indexOf("--watch") !== -1;
const coverage = args.indexOf("--coverage") !== -1;

let config = {
  name: "redux-typescript",
  preset: "ts-jest",
  rootDir: "../",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/config/"
  }),
  roots: ["src", "core"]
};

if (!isWatch || coverage) {
  config = Object.assign({}, config, {
    coverageDirectory: "reports",
    collectCoverage: true,
    collectCoverageFrom: ["**/*.{ts,tsx}", "!**/node_modules/**"]
  });
}

module.exports = config;
