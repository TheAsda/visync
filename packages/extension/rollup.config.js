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
import { readFileSync } from 'fs';
import postcss from 'rollup-plugin-postcss';
const postcssJitProps = require('postcss-jit-props');
const OpenProps = require('open-props');

const version = JSON.parse(readFileSync('package.json', 'utf8')).version;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('Building for production');
}

/** @type { import('rollup').RollupOptions[] } */
export default [
  {
    input: 'src/popup/main.tsx',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
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
      // terser(),
      postcss({
        plugins: [postcssJitProps(OpenProps)],
      }),
    ],
    output: {
      file: 'dist/popup.js',
      sourcemap: !isProduction && 'inline',
      format: 'esm',
    },
  },
  {
    input: 'src/background/background.ts',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
        'process.env.SERVER_HOSTNAME': JSON.stringify(
          process.env.SERVER_HOSTNAME
        ),
        'process.env.SERVER_PORT': JSON.stringify(process.env.SERVER_PORT),
      }),
      typescript(),
      commonjs(),
      nodeResolve({ browser: true }),
      // terser(),
      copy({
        targets: [
          {
            src: 'src/manifest.json',
            dest: 'dist',
            transform: (content) =>
              content.toString().replace('process.env.VERSION', version),
          },
          {
            src: 'src/icons/*',
            dest: 'dist/icons',
          },
        ],
      }),
    ],
    output: {
      file: 'dist/background.js',
      sourcemap: !isProduction && 'inline',
      format: 'umd',
    },
  },
  {
    input: 'src/content/sync.ts',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
      typescript(),
      commonjs(),
      nodeResolve({ browser: true }),
      json(),
      // terser(),
    ],
    output: {
      file: 'dist/sync.js',
      sourcemap: !isProduction && 'inline',
      format: 'esm',
    },
  },
  {
    input: 'src/content/kinopoisk.tsx',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
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
      // terser(),
      postcss({
        plugins: [postcssJitProps(OpenProps)],
      }),
    ],
    output: {
      file: 'dist/kinopoisk.js',
      sourcemap: !isProduction && 'inline',
      format: 'iife',
    },
  },
];
