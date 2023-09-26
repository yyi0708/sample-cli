import { defineConfig } from './utils'

// 默认配置
export const defaultConfig = defineConfig({
  app: {
    resourceType: 'default'
  },
  create: {
    template: [
      {
        type: 'order',
        name: 'vite',
        content: 'npm create vite',
        tips: '[兼容性注意] Vite 需要 Node.js 版本 14.18+，16+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。'
      },
      {
        type: 'order',
        name: 'nest',
        content: 'npm install -g @nestjs/cli && nest new',
        tips: 'https://nestjs.com/'
      },
      {
        type: 'order',
        name: 'nuxt',
        content: 'npx nuxi init demo-nuxt'
      },
      {
        type: 'order',
        name: 'quasar',
        content: 'npm i -g @quasar/cli && npm init quasar'
      },
      {
        type: 'remote',
        name: 'create-electron-vite',
        content: 'electron-vite/create-electron-vite',
        tips: 'Scaffolding Your Electron⚡️Vite Project',
        repoType: 'github'
      }
    ]
  },
  open: {
    template: [
      {
        title: 'Node.js',
        submary: 'Node.js JavaScript runtime ✨🐢🚀✨',
        link: 'https://github.com/nodejs/node',
        belong: ['Basic Language']
      },
      {
        title: 'Typescript',
        submary:
          'TypeScript is a superset of JavaScript that compiles to clean JavaScript output.',
        doc: 'www.typescriptlang.org',
        link: 'https://github.com/microsoft/TypeScript',
        belong: ['Basic Language']
      },
      {
        title: 'Vue.js',
        submary:
          '🖖 Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
        doc: 'https://cn.vuejs.org/',
        link: 'https://github.com/vuejs/core',
        belong: ['Framework']
      },
      {
        title: 'svelte.js',
        submary: 'Cybernetically enhanced web apps.',
        doc: 'svelte.dev',
        link: 'https://github.com/sveltejs/svelte',
        belong: ['Framework']
      }
    ]
  }
})
