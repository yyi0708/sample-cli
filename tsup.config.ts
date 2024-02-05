import { defineConfig } from 'tsup'

export default defineConfig((options) => {
    return {
        entry: ['src/index.ts', 'scripts/setup.ts'],
        splitting: false,
        treeshake: true,
        clean: true,
        dts: false,
        sourcemap: !!options.watch,
        minify: false,
        format: ['esm'],
        noExternal: [],
        outExtension({ format }) {
            return {
                js: `.${format}.js`,
            }
        },
    }
  })