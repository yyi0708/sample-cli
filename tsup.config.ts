import { defineConfig } from 'tsup'

export default defineConfig((options) => {
    return {
        entry: ['src/index.ts'],
        splitting: false,
        treeshake: true,
        clean: true,
        dts: true,
        sourcemap: !options.watch,
        minify: !options.watch,
        format: ['esm'],
        noExternal: [],
        outExtension({ format }) {
            return {
                js: `.${format}.js`,
            }
        },
    }
  })