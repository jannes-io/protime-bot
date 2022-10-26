import typescript from '@rollup/plugin-typescript';
import node from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    file: 'dist/protime.cjs',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    node(),
  ],
}
