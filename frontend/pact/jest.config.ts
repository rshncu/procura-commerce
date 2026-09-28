import type { Config } from 'jest';

// Isolated Node project for Pact consumer specs — Pact's mock server and pact.json writer need real fs/net APIs, not jsdom.
const config: Config = {
  displayName: 'frontend-pact-consumer',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/consumer/**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/frontend-pact-consumer',
};

export default config;
