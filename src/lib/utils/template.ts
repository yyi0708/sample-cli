// tailwind.config.js
export const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`

// postcss.config.js
export const postcss = `module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    }
}
`
export const postcss_es = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

`

// tailwindcss
export const tailwindcss = `@tailwind base;
@tailwind components;
@tailwind utilities;
`

// jest.config.js cjs
export const jest_cjs = `/** @type {import('jest').Config} */
const config = {
  verbose: true,
};

module.exports = config;
`

// jest.config.js mjs
export const jest_mjs = `/** @type {import('jest').Config} */
export default {
  verbose: true,
};

`

// jest.config.ts
export const jest_ts = `import type {Config} from 'jest';

const config: Config = {
  verbose: true,
};

export default config;
`

// .prettierrc.json
export const prettierrc = `{
  "printWidth": 80,
  "semi": false,
  "singleQuote": true,
  "overrides": [
    {
      "files": ["*.html", "**/__test__/*.{js,ts,tsx,jsx}"],
      "options": {
        "semi": true
      }
    }
  ],
  "bracketSpacing": true,
  "trailingComma": "none"
}
`

// .prettierignore
export const prettierIgnore = `dist
coverage
build
node_modules
pnpm-lock.yaml
package-lock.json

**/.git
**/.svn
**/.hg
**/node_modules
**/.husky
**/.vscode
`

// .eslintignore
export const eslintIgnore = `dist
coverage
build
node_modules
pnpm-lock.yaml
package-lock.json

.git
.svn
.hg
node_modules
.husky
.vscode
`
