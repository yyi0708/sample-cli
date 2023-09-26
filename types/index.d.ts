/// <reference types="reflect-metadata" />

declare type Input = {
  name: string
  value: boolean | string
  options?: any
}

declare namespace Download {
  type DownloadOptions = {
    source: string
    path?: string
  }
  type DownloadMutilOptions = {
    source: string[]
    path?: string[]
  }
  interface RepoParams {
    repository: string
    destination?: string
    options?: { clone: boolean }
  }

  export interface IDownlaod {
    downloadRepo(params: RepoParams): Promise<string>
    downloadFile(params: DownloadOptions): Promise<void | Buffer>
    multiFilesDownload(params: DownloadMutilOptions): Promise<void | Buffer[]>
  }
}
