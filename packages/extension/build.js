import { rollup } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import html from '@rollup/plugin-html';
import replace from '@rollup/plugin-replace';
import analyze from 'rollup-plugin-analyzer';
import { copyFile, writeFile } from 'fs/promises';
import { writeFileSync } from 'fs';

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
  plugins: [typescript(), commonjs(), nodeResolve()],
}).then((bundle) => {
  return bundle.write({
    dir: 'dist',
  });
});

Promise.all([popupBuild, backgroundBuild]).then(async (outputs) => {
  const popupOutput = outputs[0];
  const backgroundOutput = outputs[1];

  const manifest = await import('./src/manifest.json');
  manifest.action.default_popup = popupOutput.output[1].fileName;
  manifest.background.service_worker = backgroundOutput.output[0].fileName;
  return writeFile('dist/manifest.json', JSON.stringify(manifest));
});
