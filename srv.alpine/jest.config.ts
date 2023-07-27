/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  globalSetup: '<rootDir>/testing/jest.global.ts',
  clearMocks: true,
  roots: ['<rootDir>/testing'],
  testEnvironment: 'node',
  preset: 'ts-jest',
  globalTeardown: '<rootDir>/testing/teardown.ts',
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/middlewares**/*.ts',
    '!src/app.ts',
    '!**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/testing/coverage',
  reporters: ['default',
    ['jest-junit', {usePathForSuiteName: true, outputDirectory: '<rootDir>/testing/coverage' }]
  ],
  testResultsProcessor: 'jest-junit'
}