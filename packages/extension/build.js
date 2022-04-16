const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/popup/main.tsx'],
  bundle: true,
  outdir: 'dist',
  platform: 'browser',
  minify: true,
  sourcemap: true,
  target: ['es2020'],
});

esbuild.build({
  entryPoints: ['src/background/background.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'browser',
  minify: true,
  target: ['es2020'],
});
