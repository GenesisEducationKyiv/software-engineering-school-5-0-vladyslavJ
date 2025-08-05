import type { Config } from 'jest';
import { resolve } from 'path';

const rootDir = resolve(__dirname, '..');

const config: Config = {
  rootDir,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/unit/**/*.spec.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/libs/common/$1',
  },
  coverageDirectory: '<rootDir>/coverage/email/unit',
  collectCoverageFrom: [
    '../application/**/*.ts',
    '../domain/**/*.ts',
    '../infrastructure/**/*.ts',
    '../main.ts',
  ],
};

export default config;
