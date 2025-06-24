import type { Config } from 'jest';
import 'dotenv/config';
import { resolve } from 'path';

const rootDir = resolve(__dirname, '..');

const config: Config = {
  rootDir,
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/integration'],

  setupFiles: ['dotenv/config'],

  globalSetup: '<rootDir>/setup/globalSetup.ts',
  globalTeardown: '<rootDir>/setup/globalTeardown.ts',

  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage/integration',
  verbose: true,
  testTimeout: 30_000,
};

export default config;
