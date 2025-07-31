import type { Config } from 'jest';

const config: Config = {
  rootDir: '../../',
  testMatch: ['<rootDir>/apps/email/tests/unit/**/*.spec.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/libs/common/$1',
  },
  coverageDirectory: '<rootDir>/coverage/email',
  collectCoverageFrom: ['<rootDir>/apps/email/**/*.ts'],
};

export default config;
