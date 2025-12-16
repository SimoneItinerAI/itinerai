module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/jest.tsconfig.json', useESM: true }]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^.*services/api$': '<rootDir>/src/test/stubs/api.ts',
    '^.*pages/LoginPage$': '<rootDir>/src/test/stubs/LoginPage.tsx',
    '^.*utils/env$': '<rootDir>/src/test/stubs/env.ts'
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)']
}
