module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'backend/src/**/*.ts',
    '!backend/src/**/*.d.ts',
    '!backend/src/app.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
