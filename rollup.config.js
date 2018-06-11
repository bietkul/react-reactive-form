// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

const minify = process.env.MINIFY
const format = process.env.FORMAT
const es = format === 'es'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

if (es) {
  output = { file: `dist/react-reactive-form.es.js`, format: 'es' }
} else if (umd) {
  if (minify) {
    output = {
      file: `dist/react-reactive-form.umd.min.js`,
      format: 'umd'
    }
  } else {
    output = { file: `dist/react-reactive-form.umd.js`, format: 'umd' }
  }
} else if (cjs) {
  output = { file: `dist/react-reactive-form.cjs.js`, format: 'cjs' }
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

export default {
  input: 'src/index.js',
  output: Object.assign(
    {
      name: 'react-reactive-form',
      exports: 'named',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes'
      }
    },
    output
  ),
  external: ['react', 'prop-types'],
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs({ include: 'node_modules/**' }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['env', { modules: false }], 'stage-2'],
      plugins: ['external-helpers']
    }),
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development'
          )
        })
      : null,
    minify ? uglify() : null
  ].filter(Boolean)
}
