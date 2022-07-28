import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import { writeFile } from 'fs/promises';
import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import manifest from './src/manifestBase.js';
import json from '@rollup/plugin-json';
import cpy from 'cpy';

const isProduction = process.env.NODE_ENV === 'production';

// const popupBuild = rollup({
//   input: 'src/popup/main.tsx',
//   plugins: [
//     replace({
//       preventAssignment: true,
//       'process.env.NODE_ENV': JSON.stringify(
//         isProduction ? 'production' : 'development'
//       ),
//       'process.env.SCRIPT': 'popup',
//     }),
//     typescript(),
//     babel({
//       presets: ['@babel/preset-react'],
//       babelHelpers: 'bundled',
//       compact: true,
//     }),
//     svgr({ dimensions: false }),
//     commonjs(),
//     nodeResolve(),
//     html({
//       title: 'ViSync',
//     }),
//     terser(),
//   ],
// }).then((bundle) => {
//   return bundle.write({
//     dir: 'dist',
//     sourcemap: !isProduction,
//   });
// });

// const backgroundBuild = rollup({
//   input: 'src/background/background.ts',
//   plugins: [
//     replace({
//       preventAssignment: true,
//       'process.env.NODE_ENV': JSON.stringify(
//         isProduction ? 'production' : 'development'
//       ),
//       'process.env.SCRIPT': 'background',
//       'process.env.DISABLE_LOGDNA': isProduction ? false : true,
//       'process.env.SERVER_HOSTNAME': JSON.stringify(
//         process.env.SERVER_HOSTNAME
//       ),
//       'process.env.SERVER_PORT': JSON.stringify(process.env.SERVER_PORT),
//     }),
//     typescript(),
//     commonjs(),
//     nodeResolve({ browser: true }),
//     terser(),
//   ],
// }).then((bundle) => {
//   return bundle.write({
//     dir: 'dist',
//     sourcemap: !isProduction,
//     format: 'esm',
//   });
// });

// const contentBuild = rollup({
//   input: 'src/content/content.tsx',
//   plugins: [
//     replace({
//       preventAssignment: true,
//       'process.env.NODE_ENV': JSON.stringify(
//         isProduction ? 'production' : 'development'
//       ),
//       'process.env.SCRIPT': 'content',
//     }),
//     typescript(),
//     babel({
//       presets: ['@babel/preset-react'],
//       babelHelpers: 'bundled',
//       compact: true,
//     }),
//     svgr({ dimensions: false }),
//     commonjs(),
//     nodeResolve({ browser: true }),
//     terser(),
//   ],
// }).then((bundle) => {
//   return bundle.write({
//     dir: 'dist',
//     sourcemap: !isProduction,
//   });
// });

// const iconsCopy = cpy(['src/icons/*'], 'dist/icons');

// Promise.all([popupBuild, backgroundBuild, contentBuild, iconsCopy]).then(
//   async (outputs) => {
//     const popupOutput = outputs[0];
//     const backgroundOutput = outputs[1];
//     const contentOutput = outputs[2];

//     manifest.action.default_popup = popupOutput.output[1].fileName;

//     manifest.background.service_worker = backgroundOutput.output[0].fileName;
//     manifest.background.type = 'module';

//     manifest.content_scripts.push({
//       js: [contentOutput.output[0].fileName],
//       matches: ['<all_urls>'],
//     });

//     return writeFile('dist/manifest.json', JSON.stringify(manifest));
//   }
// );

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
      nodeResolve(),
      html({
        title: 'ViSync',
      }),
      terser(),
    ],
    output: {
      file: 'dist/popup.js',
    },
  },
];
