import {
  injectable,
  inject,
  TYPES,
  IQuestion,
  IPackageManagerFactory,
  AbstractPackageManager,
  IReader
} from 'IOC/index'
import {
  LibrarySupport,
  Runner,
  tailwindConfig,
  tailwindcss,
  postcss,
  postcss_es,
  jest_cjs,
  jest_mjs,
  jest_ts,
  prettierrc,
  prettierIgnore,
  eslintIgnore
} from 'Lib/utils'
import { Message } from 'Lib/ui'
import fg from 'fast-glob'
import semver from 'semver'

@injectable()
export class AddAction implements Actions.IAction {
  @inject(TYPES.LibReader) private _reader: IReader
  @inject(TYPES.LibQuestion) private _question: IQuestion
  @inject(TYPES.LibPackageManagerFactory)
  private _packageManagerFactory: IPackageManagerFactory

  public async handle(
    inputs?: Input[],
    options?: Input[],
    extraFlags?: string[]
  ): Promise<void> {
    try {
      const isApply = await this._reader.pathExists('package.json')
      if (!isApply) throw new RangeError('package.json is not exist!')

      // step1
      const { library, isBuildIn } = this.libraryIsBuildIn(options)
      if (!isBuildIn) {
        // step2
        const answers = await this._question.getQuestionAnswer([
          {
            type: 'rawlist',
            name: 'type',
            message: 'What library would you like to install?',
            choices: [
              { name: LibrarySupport.prettier, value: LibrarySupport.prettier },
              { name: LibrarySupport.eslint, value: LibrarySupport.eslint },
              { name: LibrarySupport.jest, value: LibrarySupport.jest },
              { name: LibrarySupport.cypress, value: LibrarySupport.cypress },
              { name: LibrarySupport.husky, value: LibrarySupport.husky },
              {
                name: LibrarySupport.tailwindcss,
                value: LibrarySupport.tailwindcss
              },
              {
                name: LibrarySupport.inversify,
                value: LibrarySupport.inversify
              },
              { name: LibrarySupport.custom, value: LibrarySupport.custom }
            ]
          },
          {
            type: 'input',
            name: 'target',
            message: 'Input custom resource .',
            when: (content) => content.type === LibrarySupport.custom
          }
        ])

        // step3
        this.addLibrary(answers.type, answers.target)
      } else {
        // step3
        this.addLibrary(library)
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @description 判断输入值是否为内置支持的模块
   * @param inputs 命令参数
   * @returns bool
   */
  private libraryIsBuildIn(inputs: Input[] = []): { library; isBuildIn } {
    const library = inputs.find((item) => item.name === 'template')
      ?.value as string
    return {
      library,
      isBuildIn: library in LibrarySupport
    }
  }

  /**
   * @description 动态增加功能模块
   * @param name 内置功能名称
   * @param value 当name为custom时，此值为自定义模块名称
   */
  private async addLibrary(name: LibrarySupport, value?: string) {
    try {
      const packageManagerName = await this.getPackageManagerType()

      const packageManager: AbstractPackageManager =
        await this._packageManagerFactory(packageManagerName)

      switch (name) {
        case LibrarySupport.tailwindcss:
          await this.tailwindcssOpt(packageManager)
          Message.detail(
            'more detail, to see document at:',
            'https://tailwindcss.com/docs/installation'
          )
          break
        case LibrarySupport.jest:
          await this.jestOpt(packageManager)
          Message.detail(
            'more detail, to see document at:',
            'https://jestjs.io/zh-Hans/'
          )
          break
        case LibrarySupport.prettier:
          await this.prettierOpt(packageManager)
          Message.detail(
            'more detail, to see document at:',
            'https://prettier.io/docs/en/options.html'
          )
          break
        case LibrarySupport.eslint:
          await this.eslintOpt(packageManager)
          Message.detail(
            'more detail, to see document at:',
            'https://eslint.org/'
          )
          break
        case LibrarySupport.cypress:
          await this.cypressOpt(packageManager)
          Message.detail(
            'more detail, to see document at:',
            'https://docs.cypress.io/guides/overview/why-cypress'
          )
          break
        case LibrarySupport.husky:
          await this.huskyOpt(packageManager)
          Message.detail(
            'more detail, to see document at:',
            'https://typicode.github.io/husky/'
          )
          break
      }
    } catch (error) {
      throw error
    } finally {
      process.exit(1)
    }
  }

  /**
   * @description 对项目增加tailwind功能支持
   * @param packageManager 包管理器
   */
  private async tailwindcssOpt(packageManager: AbstractPackageManager) {
    try {
      await packageManager.addDevelopment([
        'tailwindcss',
        'postcss',
        'autoprefixer'
      ])

      // 创建postcss.config.js, tailwind.config.js, main.css
      const [isExistPostcssConfig, isExistTailwindConfig, isExistTailwindCss] =
        await Promise.all([
          this._reader.pathExists('postcss.config.js'),
          this._reader.pathExists('tailwind.config.js'),
          this._reader.pathExists('./src/main.css')
        ])

      // 判断postcss.config.js存在
      if (isExistPostcssConfig) {
        // 存在postcss.config.js
        const fileContent = await this._reader.readFile('./postcss.config.js')
        const fileLine = fileContent.split('\n')

        const items = ['tailwindcss', 'autoprefixer']

        for (const item of items) {
          const code = `${item}: {},`
          if (!fileContent.includes(item)) {
            const index = fileLine.findIndex((v) => v.includes('plugins:'))
            fileLine.splice(index + 1, 0, code)
          }
        }

        await this._reader.writeFile('./postcss.config.js', fileLine.join('\n'))
      } else {
        const isESM = await this.formatIsESM()
        await this._reader.writeFile(
          './postcss.config.js',
          isESM ? postcss_es : postcss
        )
      }

      // 不存在tailwind.config.js
      if (!isExistTailwindConfig) {
        await this._reader.writeFile('./tailwind.config.js', tailwindConfig)
      }

      // 不存在tailwind css文件
      if (!isExistTailwindCss) {
        await this._reader.writeFile('./src/main.css', tailwindcss)

        // 添加到src/{main,index}.{js,ts}, 文件中添加引用
        const files = await fg(['src/{main,index}.+(js|ts)'], {
          cwd: process.cwd(),
          deep: 2,
          onlyFiles: true,
          extglob: true,
          braceExpansion: true
        })

        if (files.length === 0) {
          Message.fail(
            '在 src/{main,index}.{js,ts} 中，无法知道规定的入口文件～'
          )
          throw new Error('文件未发现')
        }
        const fileContent = await this._reader.readFile(files[0])
        const insertCode = `import './main.css'`
        if (!fileContent.includes(insertCode)) {
          console.log(insertCode)
          const fileLine = fileContent.split('\n')
          const index = fileLine.findIndex((v) => !v)
          fileLine.splice(index > -1 ? index : 0, 0, insertCode)

          await this._reader.writeFile(files[0], fileLine.join('\n'))
        }
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @description 对项目增加tailwind功能支持
   * @param packageManager 包管理器
   */
  private async jestOpt(packageManager: AbstractPackageManager) {
    try {
      const [dependencies, devDependencies] = await Promise.all([
        packageManager.getProduction(),
        packageManager.getDevelopment()
      ])
      const isTs =
        [...dependencies, ...devDependencies].findIndex(
          (v) => v.name === 'typescript'
        ) > -1

      if (isTs) {
        // step1 install dependencies
        await packageManager.addDevelopment([
          'jest',
          'ts-jest',
          '@types/jest',
          '@types/node',
          'ts-node'
        ])

        // step2 add jest.config.ts
        await this._reader.writeFile('./jest.config.ts', jest_ts)
      } else {
        await packageManager.addDevelopment(['jest'])

        const isEsm = await this.formatIsESM()
        if (isEsm) {
          await this._reader.writeFile('./jest.config.js', jest_mjs)
        } else {
          await this._reader.writeFile('./jest.config.js', jest_cjs)
        }
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @description 对项目增加prettier功能支持
   * @param packageManager 包管理器
   */
  private async prettierOpt(packageManager: AbstractPackageManager) {
    try {
      // step1 install
      await packageManager.addDevelopment(['prettier'])

      // step2 创建文件.prettierrc.json、.prettierignore
      await Promise.all([
        this._reader.writeFile('.prettierrc.json', prettierrc),
        this._reader.writeFile('.prettierignore', prettierIgnore)
      ])

      // step3 package.json 添加命令
      const json = await this._reader.readJson<Record<string, any>>(
        'package.json'
      )
      const val = Object.values(json.scripts).join()
      if (!val.includes('prettier')) {
        json.scripts.prettier = 'prettier --write .'
        await this._reader.writeJson('package.json', json)
      }

      // step4 run 运行格式化命令
      await packageManager.run('prettier')
    } catch (error) {
      throw error
    }
  }

  /**
   * @description 对项目增加eslint功能支持
   * @param packageManager 包管理器
   */
  private async eslintOpt(packageManager: AbstractPackageManager) {
    const [dependencies, devDependencies] = await Promise.all([
      packageManager.getProduction(),
      packageManager.getDevelopment()
    ])
    const isTs =
      [...dependencies, ...devDependencies].findIndex(
        (v) => v.name === 'typescript'
      ) > -1
    const vue = [...dependencies, ...devDependencies].find(
      (v) => v.name === 'vue'
    )
    const isPrettier =
      [...dependencies, ...devDependencies].findIndex(
        (v) => v.name === 'prettier'
      ) > -1
    const isJest =
      [...dependencies, ...devDependencies].findIndex(
        (v) => v.name === 'jest'
      ) > -1

    let baseConfig: Record<string, any> = {
      root: true,
      extends: ['eslint:recommended'],
      plugins: [],
      rules: {}
    }
    const installPkg = ['eslint']

    // ts 的情况
    if (isTs) {
      installPkg.push(
        '@typescript-eslint/parser',
        '@typescript-eslint/eslint-plugin'
      )

      baseConfig = {
        ...baseConfig,
        parser: '@typescript-eslint/parser',
        parserOptions: { project: ['./tsconfig.json'] },
        plugins: ['@typescript-eslint'],
        env: {
          browser: true,
          es2021: true,
          node: true
        }
      }
    }

    // vue的情况
    if (vue) {
      const isVue3 = semver.gt(
        semver.valid(semver.coerce(vue.version)),
        '3.0.0'
      )

      baseConfig = {
        ...baseConfig,
        extends: [
          ...baseConfig.extends,
          isVue3 ? 'plugin:vue/vue3-recommended' : 'plugin:vue/recommended'
        ]
      }

      // 存在自定义解析器
      if (isTs) {
        baseConfig = {
          ...baseConfig,
          parser: 'vue-eslint-parser',
          overrides: [],
          parserOptions: {
            parser: '@typescript-eslint/parser',
            ecmaVersion: 'latest',
            ecmaFeatures: {
              jsx: true
            },
            sourceType: 'module'
          }
        }
      }
      installPkg.push('eslint-plugin-vue')
    }

    // prettier
    if (isPrettier) {
      baseConfig.extends.push('plugin:prettier/recommended')

      installPkg.push('eslint-plugin-prettier', 'eslint-config-prettier')
    }

    // jest
    if (isJest) {
      baseConfig.env.jest = true
    }
    // step1 安装必须的包
    await packageManager.addDevelopment(installPkg)

    // step2 创建文件.eslintrc.json、.eslintignore
    await Promise.all([
      this._reader.writeJson('.eslintrc.json', baseConfig),
      this._reader.writeFile('.eslintignore', eslintIgnore)
    ])

    // step3 package.json 添加命令
    const json = await this._reader.readJson<Record<string, any>>(
      'package.json'
    )
    const vals = Object.values(json.scripts).join()
    if (!vals.includes('lint')) {
      json.scripts.lint = 'eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix'
      await this._reader.writeJson('package.json', json)
    }

    // step4 run 运行格式化命令
    if (isPrettier) {
      await packageManager.run('prettier')
    }
    await packageManager.run('lint')
  }

  /**
   *
   * @description 对项目增加cypress功能支持
   * @param packageManager 包管理器
   *
   */
  private async cypressOpt(packageManager: AbstractPackageManager) {
    try {
      await packageManager.addDevelopment(['cypress'])

      await packageManager.exec('cypress open')
    } catch (error) {
      throw error
    }
  }

  /**
   *
   * @description 对项目增加husky功能支持
   * @param packageManager 包管理器
   *
   */
  private async huskyOpt(packageManager: AbstractPackageManager) {
    try {
      await packageManager.exec('husky-init')

      await packageManager.install()
    } catch (error) {
      throw error
    }
  }

  /**
   * @description 当前路径下，获取包管理器
   * @returns Runner
   */
  private async getPackageManagerType(): Promise<Runner> {
    try {
      const files = await this._reader.readdir('')

      if (files.findIndex((filename) => filename === 'yarn.lock') > -1) {
        return Runner.YARN
      } else if (
        files.findIndex((filename) => filename === 'pnpm-lock.yaml') > -1
      ) {
        return Runner.PNPM
      } else {
        return Runner.NPM
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @description 获取执行路径的package.json文件是否ESM规范
   * @returns
   */
  private async formatIsESM(): Promise<boolean> {
    try {
      const json = await this._reader.readJson<{ type: string }>('package.json')

      return json.type === 'module'
    } catch (error) {
      throw error
    }
  }
}
