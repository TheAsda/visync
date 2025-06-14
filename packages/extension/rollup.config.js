import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import { readFileSync } from 'fs';
import OpenProps from 'open-props';
import postcssJitProps from 'postcss-jit-props';
import { defineConfig } from 'rollup';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';
import { terser } from 'rollup-plugin-terser';
import { hotReloadPlugin } from './hot-reload/hot-reload-plugin.js';

const version = JSON.parse(readFileSync('package.json', 'utf8')).version;

const isProduction = !process.argv.includes('--watch');

if (isProduction) {
  console.log('Building for production');
}

export default defineConfig([
  {
    input: 'src/popup/main.tsx',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
      hotReloadPlugin(),
      // typescript(),
      // babel({
      //   presets: ['@babel/preset-react'],
      //   babelHelpers: 'bundled',
      //   compact: true,
      // }),
      swc({}),
      svgr({ dimensions: false }),
      commonjs(),
      nodeResolve({ browser: true }),
      json(),
      html({
        title: 'ViSync',
      }),
      // isProduction && terser(),
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
    input: 'src/content/content.ts',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
      hotReloadPlugin(),
      swc({}),
      commonjs(),
      nodeResolve({ browser: true }),
      json(),
      // isProduction && terser(),
    ],
    output: {
      file: 'dist/content.js',
      sourcemap: !isProduction && 'inline',
      format: 'esm',
    },
  },
  {
    input: 'src/content/iframe.ts',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
      }),
      hotReloadPlugin(),
      swc({}),
      commonjs(),
      nodeResolve({ browser: true }),
      json(),
      // isProduction && terser(),
    ],
    output: {
      file: 'dist/iframe.js',
      sourcemap: !isProduction && 'inline',
      format: 'iife',
    },
  },
  {
    input: 'src/background/background.ts',
    watch: {
      clearScreen: false,
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
        'process.env.SERVER_URL': JSON.stringify(
          isProduction ? process.env.SERVER_URL : 'http://127.0.0.1:23778'
        ),
      }),
      swc({}),
      nodeResolve({ browser: true }),
      commonjs(),
      hotReloadPlugin(),
      // isProduction && terser(),
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
      format: 'esm',
    },
  },
]);
