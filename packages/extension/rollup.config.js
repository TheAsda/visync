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
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';
import { terser } from 'rollup-plugin-terser';
import { hotReloadPlugin } from './hot-reload/hot-reload-plugin.js';

const version = JSON.parse(readFileSync('package.json', 'utf8')).version;

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  console.log('Building for production');
}

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
      isProduction && terser(),
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
  // {
  //   input: 'src/content/sync.ts',
  //   plugins: [
  //     replace({
  //       preventAssignment: true,
  //       'process.env.NODE_ENV': JSON.stringify(
  //         process.env.NODE_ENV || 'development'
  //       ),
  //     }),
  //     typescript(),
  //     commonjs(),
  //     nodeResolve({ browser: true }),
  //     json(),
  //     isProduction && terser(),
  //   ],
  //   output: {
  //     file: 'dist/sync.js',
  //     sourcemap: !isProduction && 'inline',
  //     format: 'esm',
  //   },
  // },
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
        'process.env.SERVER_HOSTNAME': JSON.stringify(
          process.env.SERVER_HOSTNAME
        ),
        'process.env.SERVER_PORT': JSON.stringify(process.env.SERVER_PORT),
        'process.env.SERVER_PROTOCOL': JSON.stringify(
          process.env.SERVER_PROTOCOL
        ),
      }),
      swc({}),
      nodeResolve({ browser: true }),
      commonjs(),
      hotReloadPlugin(),
      isProduction && terser(),
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
];
