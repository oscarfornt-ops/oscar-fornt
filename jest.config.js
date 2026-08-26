module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@ports/(.*)$': '<rootDir>/src/ports/$1',
    '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  }
};
