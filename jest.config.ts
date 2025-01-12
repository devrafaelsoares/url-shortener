import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
    preset: 'ts-jest',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testMatch: ['<rootDir>/src/**/*.spec.ts'],

    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    testEnvironment: 'node',
};

export default config;
