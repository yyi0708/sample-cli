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

// config命令配置
export enum TempleteType {
  LINK = 'link',
  PROJECT = 'project',
  ASYNCMOUDLE = 'asyncMoudle'
}

export enum StrategyOptions {
  IMPORT = 'import',
  EXPORT = 'export',
  TEMPLETE = 'templete'
}

// 分隔符，代码模块
export const splitSymbol = ';%'


// 配置命令中，导入导出
export const CsvConfig = [
  {
    type: TempleteType.PROJECT,
    name: ['项目名', '内容', '模式', '提示'],
    filed: ['name', 'content', 'type', 'tips']
  },
  {
    type: TempleteType.LINK,
    name: ['名称', '地址链接', '分类', '提示', '文档链接'],
    filed: ['title', 'link', 'belong', 'submary', 'doc']
  },
  {
    type: TempleteType.ASYNCMOUDLE,
    name: ['名称', '类型', '提示', '生产依赖', '开发依赖', '代码片段', '代码片段名', '远程地址', '命令添加'],
    filed: ['name', 'type', 'tips', 'depend', 'dev_depend', 'snippet_code', 'snippet_name', 'remote_address', 'scripts']
  }
]