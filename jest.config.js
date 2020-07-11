module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  verbose: true,
  setupFilesAfterEnv: ['jest-extended', 'jest-expect-message']
};