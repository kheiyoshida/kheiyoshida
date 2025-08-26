import type { Config } from 'jest'

const RootConfig: Config = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
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
    '!**/light.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 70,
      functions: 85,
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
      setupFilesAfterEnv: [
        '<rootDir>/jest/setup.ts'
      ]
    },
    {
      ...RootConfig,
      displayName: 'forest',
      rootDir: './pjs/forest',
    },
    {
      ...RootConfig,
      displayName: 'midi-viz',
      rootDir: './pjs/midi-viz',
    },
    {
      ...RootConfig,
      displayName: 'video',
      rootDir: './pjs/video',
    },
    // pkgs
    {
      ...RootConfig,
      displayName: 'utils',
      rootDir: './pkgs/utils',
    },
    {
      ...RootConfig,
      displayName: 'p5utils',
      rootDir: './pkgs/p5utils',
      setupFilesAfterEnv: [
        '<rootDir>/jest/setup.ts'
      ]
    },
    {
      ...RootConfig,
      displayName: 'test-utils',
      rootDir: './pkgs/test-utils',
    },
    {
      ...RootConfig,
      displayName: 'maze-gl',
      rootDir: './pkgs/maze-gl',
    },
  ],
}
export default JestConfig
