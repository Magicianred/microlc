import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import copy from 'rollup-plugin-copy'
import {terser} from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'


const extensions = ['.js', '.ts', '.tsx'];

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: [/@babel\/runtime/],
  plugins: [
    external(),
    postcss(),
    url(),
    svgr(),
    babel({
      babelrc: false,
      extensions,
      exclude: ['/node_modules/'],
      babelHelpers: 'runtime',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [['import', {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: 'less'
      }],
      'react-require',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        ['@babel/plugin-proposal-object-rest-spread', {
          useBuiltIns: true,
        }],
        ['@babel/plugin-transform-runtime', {
          corejs: 3,
          helpers: true,
          regenerator: true,
          useESModules: false,
        }],
    ],
      
    }),
    resolve({
      browser: true,
      extensions
    }),
    commonjs(
      {
        include: /node_modules/,
      }
    ),
    json(),
    copy({
      targets: [
        {src: 'src/*/index.d.ts', dest: 'dist/lib'},
        {
          src: 'types/index.d.ts',
          dest: 'dist',
          transform: contents => contents.toString().replace(/\.\.\/src/g, './lib')
        }
      ],
      flatten: false
    }),
    terser({
      keep_fnames: true,
      keep_classnames: true
    }),
    filesize()
  ],
  context: 'null',
  moduleContext: 'null'
}
