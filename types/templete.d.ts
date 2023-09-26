declare namespace Template {
  // OPEN - 基础语言/框架/工具库/想法/社区
  type BelongType =
    | 'Basic Language'
    | 'Framework'
    | 'Tools Library'
    | 'Idea'
    | 'Community'
    | 'awesome'
  export interface RowLink<T extends BelongType = BelongType> {
    title: string
    submary: string
    doc?: string
    link: string
    belong: Array<T>
  }

  // CREATE
  export interface CreateRow {
    name: string
    content: string
    type: 'order' | 'remote'
    tips?: string
    repoType?: 'github' | 'gitlab' | 'bitbucket'
  }
}
