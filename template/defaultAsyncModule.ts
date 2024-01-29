type AsyncModuleType = {
    name: string
    depend?: Array<string>
    dev_depend?: Array<string>
    snippet_code?: string[]
    snippet_name?: string[]
    remote_address?: string
    type?: 'module' | 'remote' | 'snippet'
    tips?: string
    scripts?: string[]
    createdAt?: number;
}

// tailwind.config.js
export const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
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
// .eslintrc.js example
export const eslintrc = `module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
  }
`

export const AsyncModuleTemplete:AsyncModuleType[] = [
    {
        name: 'jest-ts',
        type: 'module',
        dev_depend: [
            'jest',
            'ts-jest',
            '@types/jest',
            '@types/node',
            'ts-node'
        ],
        tips: '细节请查看: https://jestjs.io/zh-Hans/docs/getting-started',
        snippet_name: ['jest.config.ts'],
        snippet_code: [jest_ts]
    },
    {
        name: 'jest-js',
        type: 'module',
        dev_depend: [
            'jest'
        ],
        tips: '细节请查看: https://jestjs.io/zh-Hans/docs/getting-started',
        snippet_name: ['jest.config.cjs'],
        snippet_code: [jest_cjs]
    },
    {
        name: 'tailwind',
        type: 'module',
        dev_depend: [
            'tailwindcss',
            'postcss',
            'autoprefixer'
        ],
        tips: '细节请查看: https://tailwindcss.com/docs/installation/using-postcss',
        snippet_name: ['postcss.config.cjs', 'tailwind.config.cjs', 'tailwind.css'],
        snippet_code: [postcss, tailwindConfig, tailwindcss]
    },
    {
        name: 'prettier',
        type: 'module',
        dev_depend: [
            'prettier'
        ],
        tips: '细节请查看: https://prettier.io/',
        snippet_name: ['.prettierrc.json', '.prettierignore'],
        snippet_code: [prettierrc, prettierIgnore],
        scripts: ['prettier', 'prettier --write .']
    },
    {
        name: 'eslint-js',
        type: 'module',
        dev_depend: [
            'eslint'
        ],
        tips: '细节请查看: https://eslint.org/',
        snippet_name: ['.eslintrc.js', '.eslintignore'],
        snippet_code: [eslintrc, eslintIgnore],
        scripts: ['lint', 'eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix']
    },
]