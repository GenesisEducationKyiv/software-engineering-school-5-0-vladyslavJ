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
  roots: ['<rootDir>/unit'],
  setupFiles: ['dotenv/config'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage/unit',
};

export default config;
