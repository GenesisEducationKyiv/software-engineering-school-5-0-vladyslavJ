import type { Config } from 'jest';
import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

const rootDir = resolve(__dirname, '..');
loadEnv({ path: resolve(process.cwd(), '.env.test.docker') });

const config: Config = {
  rootDir,
  preset: 'ts-jest',
  testEnvironment: 'node',

  roots: ['<rootDir>/integration'],

  setupFiles: ['dotenv/config'],

  globalSetup: '<rootDir>/setup/global.setup.ts',
  globalTeardown: '<rootDir>/setup/global-teardown.setup.ts',

  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage/integration',
  verbose: true,
  testTimeout: 30_000,
};

export default config;
