import { availableLanguages, sourcePrefixes } from './constant'
import { Message } from 'Lib/ui'

// 提供配置选项类型支持
export function defineConfig(config: Config.UserConfigExport) {
  return config
}

// 语言类型
export const desposeLanguage = (lang: string): string => {
  const lowercasedLanguage = lang.toLowerCase()
  const langMatch = availableLanguages.includes(lowercasedLanguage)
  if (!langMatch) {
    throw new Error(
      `Invalid language "${lang}" selected. Available languages are "typescript" or "javascript"`
    )
  }

  let newLang = ''
  switch (lowercasedLanguage) {
    case 'javascript':
      newLang = 'js'
      break
    case 'typescript':
      newLang = 'ts'
      break
    default:
      newLang = lowercasedLanguage
      break
  }
  return newLang
}

// 仓库路径转换
export const getRemotePath = (type: sourcePrefixes) => {
  if (type === sourcePrefixes.github) {
    return (repositor: string, dir: string): string => {
      return `https://raw.fastgit.org/${repositor}/main/${dir}`
    }
  } else if (type === sourcePrefixes.gitlab) {
    return (repositor: string, dir: string): string => {
      return `https://gitlab.com/flippidippi/${repositor}/-/raw/master/${dir}`
    }
  }
  Message.warn(`暂不支持类型${type}的路径转换！`)
}

/**
 *
 * @param str
 * @returns formated string
 * @description normalizes input to supported path and file name format.
 * Changes camelCase strings to kebab-case, replaces spaces with dash and keeps underscores.
 */
export function normalizeToKebabOrSnakeCase(str: string) {
  const STRING_DASHERIZE_REGEXP = /\s/g
  const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g
  return str
    .replace(STRING_DECAMELIZE_REGEXP, '$1-$2')
    .toLowerCase()
    .replace(STRING_DASHERIZE_REGEXP, '-')
}
