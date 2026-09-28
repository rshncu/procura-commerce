export default {
  displayName: 'api-gateway',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/api-gateway',
  // Pact provider verification runs separately via the test-pact-verify target (see jest.pact.config.ts).
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/src/pact/'],
};
