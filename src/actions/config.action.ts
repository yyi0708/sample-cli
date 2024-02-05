import { injectable, inject, TYPES, ICsvType } from 'IOC/index'
import { TempleteType, StrategyOptions, CsvConfig } from 'Tools/utils'
import { getDataSource, Project, Link, AsyncModule } from 'Tools/database'
import { Message } from 'Tools/ui'


@injectable()
export class ConfigAction implements Actions.IAction {
  @inject(TYPES.LibCsv) private _csv: ICsvType

  // 参数处理
  public async handle(
    inputs?: Input[],
    options?: Input[],
    extraFlags?: string[]
  ): Promise<void> {
    try {
      const type = inputs.find((item) => item.name === 'type')?.value as TempleteType
      const strategy = inputs.find((item) => item.name === 'strategy')?.value as string
      const path = inputs.find((item) => item.name === 'path')?.value as string
      const force = options.find((item) => item.name === 'force')?.value as Boolean

      // mode 导出
      if (strategy === StrategyOptions.EXPORT) {
        // 根据类型，获取模型数据
        const data = await this.getEntityList(type)

        // 根据类型整理，csv数据
        const row = this.getEntityRow(type, data)

        await this.createCsvFile(path, row, this.getHeadersArr(type, 'write'))
      } else if (strategy === StrategyOptions.TEMPLETE) {
        // 模版
        await this.createCsvFile(path, [[]], this.getHeadersArr(type, 'write'))
      } else if (strategy === StrategyOptions.IMPORT) {
        const result = await this.readCsvFile(path, this.getHeadersArr(type, 'read'))

        // console.log(result, 'result')
        await this.insertToSqlite(type, result, force)

        Message.sucess(`${path} 数据已写入本地数据库`)
      }
    } catch (error) {
      throw error
    }
  }

   /**
   * @function 获取项目数据库的数据
   * @returns Project 数据
   */
   private async getEntityList(type: TempleteType): Promise<Array<Project | Link | AsyncModule >> {
    const dataSource = await getDataSource()
    const Entity = type === TempleteType.PROJECT ? Project: type === TempleteType.LINK ? Link : type === TempleteType.ASYNCMOUDLE ? AsyncModule : null

    const datas = await dataSource
      .getRepository(Entity)
      .createQueryBuilder(type)
      .getMany()

    return datas
  }

  /**
   * @function 导入数据到数据库
   * @param type 
   */
  private async insertToSqlite(type: TempleteType, data: any[], force: Boolean) {
    const dataSource = await getDataSource()
    const Entity = type === TempleteType.PROJECT ? Project: type === TempleteType.LINK ? Link : type === TempleteType.ASYNCMOUDLE ? AsyncModule : null
    const sgin = type === TempleteType.LINK ? 'title' : 'name'
    const dataEntity = []
    const fieldIsArr = ['depend', 'dev_depend', 'snippet_name', 'scripts', 'belong']
    const repet = []
    
    for(const item of data) {
      const entityItem = await dataSource.manager.findOneBy(Entity, {
        [sgin]: type === TempleteType.LINK ? item.title : item.name
      })

      for(const key in item) {
        if(fieldIsArr.includes(key)) item[key] = item[key].split(',')
      }
  
      if(!entityItem) {
        dataEntity.push({
          ...item,
          createdAt: Date.now()
        })
      } else {
        // 强制替换
        if (force) {
          for(let key in item) {
            entityItem[key] = item[key]
          }
          await dataSource.manager.save(entityItem)
        } else {
          repet.push(type === TempleteType.LINK ? item.title : item.name)
        }
      }
    }
    
    if(repet.length) Message.warn(`本地库存在${repet}，已存在默认不予操作，若更新替换，命令可添加 -f`)
    await dataSource.manager.insert(Entity, dataEntity)
  }


  /**
   * @function 根据数据创建csv文件
   * @param path 路径
   * @param data 
   * @param headers 
   */
  private async createCsvFile(path: string, data: any[], headers: string[]): Promise<void> {
    this._csv.path = path
    this._csv.writeOpts = { headers }

    this._csv.create(data).then(() => {
      Message.sucess(`文件已导出，路径地址: ${path}`)
    })
  }

  /**
   * @function 读取csv文件
   * @param path 
   * @param headers 
   */
  private async readCsvFile(path: string, headers: string[]) {
    try {
      this._csv.path = path
      this._csv.writeOpts = { headers, renameHeaders: true }

      const data = await this._csv.readJson()

      return data
    } catch (error) {
      throw error
    }
    
  }

  /**
   * @function 返回csv所需的header
   * @param type 类型
   * @param mode 模式
   */
  private getHeadersArr(type: TempleteType, mode: 'read' | 'write'): string[] {
    const item = CsvConfig.find(item => item.type === type)

    return mode === 'read' ? item.filed : item.name
  }

  /**
   * @function 解析数据库数据，返回写入csv的二维数组
   * @param type 
   * @param data 
   * @returns 
   */
  private getEntityRow(type: TempleteType, data: Record<string, any>[]): Array<string | null> {
    let arr = []
    if (type === TempleteType.PROJECT) {
      arr = data.map(item => {
        return [item.name, item.content, item.type, item.tips].map(v => {
          if(Array.isArray(v)) v = v.join()
          return v
        })
      })
    } else if (type === TempleteType.LINK) {
      arr = data.map(item => {
        return [item.title, item.link, item.belong, item.submary, item.doc].map(v => {
          if(Array.isArray(v)) v = v.join()
          return v
        })
      })
    } else if (type === TempleteType.ASYNCMOUDLE) {
      arr = data.map(item => {
        return [item.name, item.type, item.tips, item.depend, item.dev_depend, item.snippet_code, item.snippet_name, item.remote_address, item.scripts].map(v => {
          if(Array.isArray(v)) v = v.join()
          return v
        })
      })
    }

    return arr
  }


}
