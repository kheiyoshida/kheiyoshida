import type { Config } from 'jest'

const RootConfig:Config = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1'
  },
  testEnvironment: 'jsdom',  
  testMatch: [
    '<rootDir>/src/**/*.test.ts'
  ], 
  prettierPath: require.resolve('prettier-2'),
}

const JestConfig:Config = {
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
      coverageDirectory: '<rootDir>/src',
      collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    },
    {
      ...RootConfig,
      displayName: 'utils',
      rootDir: './pkgs/utils',
      coverageDirectory: '<rootDir>/src',
      collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    }
  ]
}
export default JestConfig