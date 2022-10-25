import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/protime.js',
    format: 'cjs'
  },
  plugins: [typescript()],
}
