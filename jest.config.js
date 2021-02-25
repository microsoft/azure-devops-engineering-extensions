const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  bail: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  roots: ['Tasks'],
};