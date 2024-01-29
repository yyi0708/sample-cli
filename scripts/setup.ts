import { pathExists, writeJSON, ensureFile } from 'fs-extra/esm'
import cfonts from 'cfonts'

import { Message } from 'Tools/ui'
import {  appConfigFilePath } from 'Tools/utils'
import { appConfig, ProjectTemplete, LinkTemplete, AsyncModuleTemplete } from '@/template'
import { getDataSource, AsyncModule, Link, Project, DataSource } from 'Tools/database'
import { splitSymbol } from 'Tools/utils'


// local file map
const pathData = [
  {
    path: appConfigFilePath,
    data:appConfig
  }
]

/**
 * @function settingFileByPath save file data
 * @param path 路径
 * @param data 文件内容
 */
const settingFileByPath = async (path: string, data: Record<string,any>): Promise<void> => {
  const isExistPath = await pathExists(path)

  if (!isExistPath) {
    await ensureFile(path)
    await writeJSON(path, data)

    Message.Create_config_success(path)
  }
}

/**
 * @function settingDb 初始化数据库，建立库
 */
const settingDb = async () => {
  const AppDataSource = await getDataSource();

  await Promise.allSettled([
    initProjectEntity(AppDataSource),
    initLinkEntity(AppDataSource),
    initAsyncModuleEntity(AppDataSource)
  ])

}

/**
 * @function 初始化项目模版
 * @param db 数据库实例
 */
async function initProjectEntity(db: DataSource): Promise<void> {
  const projectEntity = []

  for(const projectItem of ProjectTemplete) {
    const isHave = await db.manager.findOneBy(Project, {
      name: projectItem.name
    })

    if(!isHave) {
      projectEntity.push({
        ...projectItem,
        createdAt: Date.now()
      })
    }
  }

  await db.manager.insert(Project, projectEntity)
}

/**
 * @function 初始化链接库模版
 * @param db 数据库实例
 */
async function initLinkEntity(db: DataSource): Promise<void> {
  const entity = []

  for(const item of LinkTemplete) {
    const isHave = await db.manager.findOneBy(Link, {
      title: item.title
    })

    if(!isHave) {
      entity.push({
        ...item,
        createdAt: Date.now()
      })
    }
  }

  await db.manager.insert(Link, entity)
}

/**
 * @function 初始化增量库模版
 * @param db 数据库实例
 */
async function initAsyncModuleEntity(db: DataSource): Promise<void> {
  try {
    const entity = []

    for(const item of AsyncModuleTemplete) {
      const isHave = await db.manager.findOneBy(AsyncModule, {
        name: item.name
      })

      if(!isHave) {
        entity.push({
          ...item,
          snippet_code: item.snippet_code.join(splitSymbol),
          createdAt: Date.now()
        })
      }
    }

    console.log(1)

    await db.manager.insert(AsyncModule, entity)

    console.log(1)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @function 首次安装提示
 */
function welcomeTips () {
  Message.sucess('Welcome to use:')

  cfonts.say('Sample-quick-cli!', {
    font: 'pallet', // define the font face
    align: 'left', // define text alignment
    colors: ['red', '#333'], // define all colors
    lineHeight: 0.5,
    gradient: true
  })
}

/**
 * @function start 启动
 */
async function bootstrap() {
  try {
    await Promise.all([
      settingDb(),
      ...pathData.map(item => settingFileByPath(item.path, item.data))
    ])

    welcomeTips()
  } catch (error) {
    console.log(error)
    process.exit(0)
  } 
}

bootstrap()
