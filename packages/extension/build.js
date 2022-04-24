import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import svgr from '@svgr/rollup';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { rollup } from 'rollup';

const isProduction = process.env.NODE_ENV === 'production';

const popupBuild = rollup({
  input: 'src/popup/main.tsx',
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(
        isProduction ? 'production' : 'development'
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
    nodeResolve(),
    html({
      title: 'Syncboii',
    }),
  ],
}).then((bundle) => {
  return bundle.write({
    dir: 'dist',
    sourcemap: !isProduction,
  });
});

const backgroundBuild = rollup({
  input: 'src/background/background.ts',
  plugins: [typescript(), commonjs(), nodeResolve({ browser: true })],
}).then((bundle) => {
  return bundle.write({
    dir: 'dist',
    sourcemap: !isProduction,
  });
});

const contentBuild = rollup({
  input: 'src/content/content.tsx',
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(
        isProduction ? 'production' : 'development'
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
  ],
}).then((bundle) => {
  return bundle.write({
    dir: 'dist',
    sourcemap: !isProduction,
  });
});

Promise.all([popupBuild, backgroundBuild, contentBuild])
  .then(async (outputs) => {
    const popupOutput = outputs[0];
    const backgroundOutput = outputs[1];
    const contentOutput = outputs[2];

    const manifest = JSON.parse(
      await readFile('./src/manifest.json', { encoding: 'utf8' })
    );
    delete manifest['$schema'];
    manifest.action.default_popup = popupOutput.output[1].fileName;
    manifest.background.service_worker = backgroundOutput.output[0].fileName;
    manifest.content_scripts[0].js[0] = contentOutput.output[0].fileName;
    return writeFile('dist/manifest.json', JSON.stringify(manifest));
  })
  .then(() => {
    const icons = readdirSync('src/icons');
    if (!existsSync('dist/icons')) {
      mkdirSync('dist/icons');
    }
    icons.forEach((icon) => {
      copyFileSync(join('src/icons', icon), join('dist/icons', icon));
    });
  });
