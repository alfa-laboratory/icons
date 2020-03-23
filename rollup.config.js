import pkg from './package.json';
import auto from '@rollup/plugin-auto-install';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import multiInput from 'rollup-plugin-multi-input';

export default {
    input: 'src/**/*.tsx',
    output: [
        {
            dir: 'dist',
            format: 'esm',
            plugins: [terser()],
        },
    ],
    plugins: [
        auto(),
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
