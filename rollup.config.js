import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import multiInput from 'rollup-plugin-multi-input';

const cjs = {
    input: 'src/**/*.tsx',
    output: [
        {
            dir: 'dist',
            format: 'cjs',
            plugins: [terser()],
        },
    ],
    plugins: [
        resolve(),
        typescript({
            allowSyntheticDefaultImports: true,
            jsx: 'react',
            declaration: true,
            declarationDir: './dist',
            outDir: './dist',
            rootDir: './src',
            removeComments: true,
            strict: true,
        }),
        multiInput(),
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
};

const esm = {
    input: 'src/index.tsx',
    output: [
        {
            dir: 'dist/esm',
            format: 'esm',
            plugins: [terser()],
        },
    ],
    plugins: [
        resolve(),
        typescript({
            allowSyntheticDefaultImports: true,
            jsx: 'react',
            outDir: './dist/esm',
            rootDir: './src',
            removeComments: true,
            strict: true,
        })
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
};

export default [cjs, esm];
