import type { Config } from 'jest';

// Dedicated target so the (intentionally failing) Pact verification doesn't run inside the regular `test` target.
const config: Config = {
  displayName: 'api-gateway-pact-provider',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/pact/**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/api-gateway-pact-provider',
};

export default config;
