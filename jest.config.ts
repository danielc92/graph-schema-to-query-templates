/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
  // All imported modules in your tests should be mocked automatically
  // automock: false,
  // Stop running tests after `n` failures
  // bail: 0,
  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "C:\\Users\\danie\\AppData\\Local\\Temp\\jest",
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "node_modules",
    "types"
  ],
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",
  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",
  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],
  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,
  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],
  // The test environment that will be used for testing
  testEnvironment: "node",
  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},
  // Adds a location field to test results
  // testLocationInResults: false,
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    // "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "node_modules", "dist"
  ],
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  // Whether to use watchman for file crawling
  watchman: true,
};
