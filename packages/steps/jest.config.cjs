module.exports = {
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ],
  },
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/__tests__/*-test.ts'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov'],
  coverageDirectory: '../coverage/tests/',
  moduleNameMapper: {
    '^(\\.\\.?/.*)\\.js$': ['$1.ts', '$0'],
  },
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/../jest/setup-tests.ts'],
};
