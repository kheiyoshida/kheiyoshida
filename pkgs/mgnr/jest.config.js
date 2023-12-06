module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  roots: [
    '<rootDir>/src'
  ],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1'
  },
}
