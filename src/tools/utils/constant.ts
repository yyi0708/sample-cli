export const availableLanguages = ['js', 'ts', 'javascript', 'typescript']

// 远程资源
export enum sourcePrefixes {
  github,
  gitlab,
  bitbucket
}

// runner env
export enum Runner {
  NPM,
  YARN,
  PNPM,
  GIT
}

// package-manager
export enum PackageManager {
  NPM,
  YARN,
  PNPM
}

// add 库支持类型
export enum LibrarySupport {
  prettier = 'prettier',
  eslint = 'eslint',
  jest = 'jest',
  husky = 'husky',
  cypress = 'cypress',
  tailwindcss = 'tailwindcss',
  inversify = 'inversify',
  custom = 'custom'
}


export const splitSymbol = ';%'