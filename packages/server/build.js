const typescript = require('@rollup/plugin-typescript');
const rollup = require('rollup');

rollup
  .rollup({
    input: 'src/app.ts',
    plugins: [typescript()],
  })
  .then((bundle) => {
    return bundle.write({
      dir: 'dist',
      format: 'cjs',
    });
  });
