module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    collectCoverageFrom: [
        'nodes/**/*.ts',
        'credentials/**/*.ts',
        '!**/*.test.ts',
        '!**/*.spec.ts',
        '!**/node_modules/**',
        '!**/dist/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    roots: ['<rootDir>'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
