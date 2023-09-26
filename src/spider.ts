import { container, TYPES } from 'IOC/index'
import { resolve } from 'path'

class Spider {
  private _download = container.get<Download.IDownlaod>(TYPES.LibDownload)

  public async load() {
    console.log('hello-12')

    await this._download.downloadFile({
      source:
        'https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md',
      path: resolve(__dirname, 'assets/awesome.md')
    })
  }
}

const spider = new Spider()
spider.load()
