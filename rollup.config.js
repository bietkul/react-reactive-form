// rollup.config.js
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
export default {
  dest: 'dist/main.js',
  entry: 'src/lib.js',
  format: 'cjs',
  plugins: [resolve(), commonjs(), babel({
    exclude: 'node_modules/**',
    plugins: ['external-helpers']
  })]
}
