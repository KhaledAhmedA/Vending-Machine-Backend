const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
};
