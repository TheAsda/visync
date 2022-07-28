import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

const isProduction = process.env.NODE_ENV === 'production';

/** @type { import('rollup').RollupOptions[] } */
export default [
  {
    input: 'src/popup/main.tsx',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        ),
        'process.env.SCRIPT': 'popup',
      }),
      typescript(),
      babel({
        presets: ['@babel/preset-react'],
        babelHelpers: 'bundled',
        compact: true,
      }),
      svgr({ dimensions: false }),
      commonjs(),
      nodeResolve({ browser: true }),
      json(),
      html({
        title: 'ViSync',
      }),
      terser(),
    ],
    output: {
      file: 'dist/popup.js',
      format: 'esm',
    },
  },
  {
    input: 'src/background/background.ts',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        ),
        'process.env.SCRIPT': 'background',
        'process.env.SERVER_HOSTNAME': JSON.stringify(
          process.env.SERVER_HOSTNAME
        ),
        'process.env.SERVER_PORT': JSON.stringify(process.env.SERVER_PORT),
      }),
      typescript(),
      commonjs(),
      nodeResolve({ browser: true }),
      terser(),
    ],
    output: {
      file: 'dist/background.js',
      sourcemap: !isProduction,
      format: 'esm',
    },
  },
  {
    input: 'src/content/content.tsx',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        ),
        'process.env.SCRIPT': 'content',
      }),
      typescript(),
      babel({
        presets: ['@babel/preset-react'],
        babelHelpers: 'bundled',
        compact: true,
      }),
      svgr({ dimensions: false }),
      commonjs(),
      nodeResolve({ browser: true }),
      json(),
      terser(),
      copy({
        targets: [
          {
            src: 'src/manifest.json',
            dest: 'dist',
          },
          {
            src: 'src/icons/*',
            dest: 'dist/icons',
          },
        ],
      }),
    ],
    output: {
      file: 'dist/content.js',
      sourcemap: !isProduction,
    },
  },
];
