import {
  copy,
  pathExists,
  readJson,
  writeJson
} from 'fs-extra/esm'
import type { CopyOptions } from 'fs-extra'
import { readFile, writeFile, readdir, stat } from 'node:fs/promises'
import { statSync } from 'node:fs'
import { IReader } from './reader'
import { injectable } from 'IOC/index'
import { join } from 'path'

@injectable()
export class FileSystemReader implements IReader {
  constructor(private _dir: string = process.cwd()) {}

  get directory() {
    return this._dir
  }

  set directory(path: string) {
    this._dir = path
  }

  public async copy(
    src: string,
    dest: string,
    options?: CopyOptions
  ): Promise<void> {
    try {
      await copy(join(this._dir, src), join(this._dir, dest), options)
    } catch (error) {
      console.log(error)
    }
  }

  public async readFile(src: string): Promise<string> {
    try {
      const filePath = join(this._dir, src)
      const contents = await readFile(filePath, { encoding: 'utf8' })
      return contents
    } catch (err) {
      console.error(err);
    }
  }

  public async readAnyOf(filenames: string[]): Promise<string> {
    try {
      for (const file of filenames) {
        return await this.readFile(file)
      }
    } catch (err) {
      return filenames.length > 0
        ? await this.readAnyOf(filenames.slice(1, filenames.length))
        : undefined
    }
  }

  public async pathExists(src: string): Promise<boolean> {
    return await pathExists(join(this._dir, src))
  }

  public async writeFile(src: string, content: string | Buffer): Promise<void> {
    return await writeFile(join(this._dir, src), content)
  }

  public async readdir(
    src: string,
    options?:
      | BufferEncoding
      | {
          encoding: BufferEncoding
          withFileTypes?: false
        }
  ): Promise<string[]> {
    try {
      return await readdir(join(this._dir, src), options)
    } catch (error) {
      throw error
    }
  }

  public async readJson(src: string, isCompletePath: boolean = false) {
    try {
      if (isCompletePath) return await readJson(src)
      return await readJson(join(this._dir, src))
    } catch (error) {
      throw error
    }
  }

  public async writeJson<T>(
    src: string,
    data: T,
    isCompletePath: boolean = false
  ): Promise<void> {
    try {
      if (isCompletePath) return await writeJson(src, data)
      await writeJson(join(this._dir, src), data)
    } catch (error) {
      throw error
    }
  }

  public async isFile(src: string): Promise<boolean> {
    try {
      const result = await stat(join(this._dir, src))
      return result.isFile()
    } catch (error) {
      throw error
    }
  }

  public isFileSync(src: string): boolean {
    try {
      const result = statSync(join(this._dir, src))
      return result.isFile()
    } catch (error) {
      throw error
    }
  }
}
