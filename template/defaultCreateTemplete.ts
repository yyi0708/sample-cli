export const ProjectTemplete = [
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
    content: 'npx nuxi init demo-nuxt',
    tips: 'Nuxt is an intuitive and extendable way to create type-safe, performant and production-grade full-stack web apps and websites with Vue 3.'
  },
  {
    type: 'order',
    name: 'quasar',
    content: 'npm i -g @quasar/cli && npm init quasar',
    tips: 'Quasar Framework - Build high-performance VueJS user interfaces in record time'
  },
  {
    type: 'remote',
    name: 'create-electron-vite',
    content: 'electron-vite/create-electron-vite',
    tips: 'Scaffolding Your Electron⚡️Vite Project',
    repoType: 'github'
  }
]