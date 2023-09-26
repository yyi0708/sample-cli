import { CopyOptions } from 'fs-extra'

export interface IReader {
  get directory(): string
  set directory(path: string)
  copy(src: string, dest: string, options?: CopyOptions): Promise<void>
  readFile(src: string): Promise<string>
  readJson<T>(src: string, isCompletePath?: boolean): Promise<T>
  writeJson<T>(src: string, data: T, isCompletePath?: boolean): Promise<void>
  readAnyOf(filenames: string[]): string | Promise<string | undefined>
  writeFile(src: string, content: string | Buffer): Promise<void>
  readdir(
    src: string,
    options?:
      | BufferEncoding
      | {
          encoding: BufferEncoding
          withFileTypes?: false
        }
  ): Promise<string[]>
  pathExists(src: string): Promise<boolean>
  isFile(src: string): Promise<boolean>
  isFileSync(src: string): boolean
}
