import type { Config } from 'jest'

const RootConfig: Config = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  prettierPath: require.resolve('prettier-2'),
  setupFiles: ['../../jest/globalSetup.ts'],
}

const JestConfig: Config = {
  globals: {
    'ts-jest': {
      isolatedModules: false,
    },
  },
  // even thoug it's on top level, this is for each project level
  // do not run --coverage from root dir
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.config.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 80,
      functions: 95,
      lines: 60,
    },
  },
  coverageDirectory: 'jest/coverage',
  projects: [
    // pjs
    {
      ...RootConfig,
      displayName: 'maze',
      rootDir: './pjs/maze',
    },
    {
      ...RootConfig,
      displayName: 'sketch',
      rootDir: './pjs/sketch',
    },
    // pkgs
    {
      ...RootConfig,
      displayName: 'mgnr',
      rootDir: './pkgs/mgnr',
    },
    {
      ...RootConfig,
      displayName: 'utils',
      rootDir: './pkgs/utils',
    },
  ],
}
export default JestConfig
