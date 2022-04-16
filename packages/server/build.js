const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
});
