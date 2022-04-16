import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { readFile, writeFile } from 'fs/promises';
import { rollup } from 'rollup';
import analyze from 'rollup-plugin-analyzer';

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
    commonjs(),
    nodeResolve(),
    html({
      title: 'Syncboii',
    }),
    analyze({ hideDeps: true, summaryOnly: true }),
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
    format: 'cjs',
  });
});

Promise.all([popupBuild, backgroundBuild]).then(async (outputs) => {
  const popupOutput = outputs[0];
  const backgroundOutput = outputs[1];

  const manifest = JSON.parse(
    await readFile('./src/manifest.json', { encoding: 'utf8' })
  );
  manifest.action.default_popup = popupOutput.output[1].fileName;
  manifest.background.service_worker = backgroundOutput.output[0].fileName;
  return writeFile('dist/manifest.json', JSON.stringify(manifest));
});
