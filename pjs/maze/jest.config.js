module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  roots: [
    '<rootDir>'
  ],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1'
  },
}
