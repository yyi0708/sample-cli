import { RollupOptions } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import { resolve } from 'path'

const aliasConfig = {
  entries: [
    { find: '@', replacement: resolve(process.cwd(), './') },
    { find: 'Lib', replacement: resolve(process.cwd(), './src/lib') },
    { find: 'IOC', replacement: resolve(process.cwd(), './src/IOC') },
    { find: 'Types', replacement: resolve(process.cwd(), './types') }
  ]
}

// 定义常量
const extensions = ['.ts', '.tsx', '.js', '.vue']

const config: RollupOptions = {
  input: './src/index.ts',
  output: [
    {
      file: 'dist/bundle.min.js',
      format: 'cjs',
      plugins: [terser()],
      sourcemap: true
    }
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  plugins: [
    commonjs(),
    alias(aliasConfig),
    nodeResolve({
      extensions,
      exportConditions: ['node', 'default', 'module', 'import'],
      preferBuiltins: false
    }),
    typescript({
      clean: true
    }),
    json()
  ],
  external: ['*']
}

export default config
