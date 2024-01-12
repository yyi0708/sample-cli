import { pathExists, writeJSON, ensureFile } from 'fs-extra/esm'
import { Message } from '@/src/tools/ui'
import {  appConfigFilePath, createConfigFilePath, openConfigFilePath } from '@/src/tools/utils'
import { appConfig, createConfig, openConfig } from '@/template/default'
import cfonts from 'cfonts'

// local file map
const pathData = [
  {
    path: appConfigFilePath,
    data:appConfig
  },
  {
    path: createConfigFilePath,
    data:createConfig
  },
  {
    path: openConfigFilePath,
    data:openConfig
  },
]
// save file data
const settingFileByPath = async (path: string, data: Record<string,any>): Promise<void> => {
  const isExistPath = await pathExists(path)

  if (!isExistPath) {
    await ensureFile(path)
    await writeJSON(path, data)

    Message.Create_config_success(path)
  }
}
// start
async function bootstrap() {
  try {
    // tips
    Message.sucess('Welcome:')
    cfonts.say('Sample-cli!', {
      font: 'pallet', // define the font face
      align: 'left', // define text alignment
      colors: ['red', '#333'], // define all colors
      lineHeight: 0.5,
      gradient: true
    })

    await Promise.all(pathData.map(item => settingFileByPath(item.path, item.data)))
  } catch (error) {
    process.exit(1)
  }
}

bootstrap()
