import { createRequire } from 'node:module'
import { mkdir, writeFile, copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(path.join(root, 'RuoYi-Vue3/package.json'))
const { h } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const icons = require('@element-plus/icons-vue')
const names = { home: 'House', calendar: 'Calendar', record: 'Document', user: 'User', book: 'Reading', shield: 'CircleCheck', bell: 'Bell', download: 'Download', filter: 'Filter', wallet: 'Wallet', search: 'Search', edit: 'EditPen', check: 'CircleCheck', delete: 'Delete', back: 'ArrowLeft', next: 'ArrowRight', more: 'MoreFilled', pause: 'VideoPause', info: 'InfoFilled', grid: 'DataAnalysis', orders: 'Tickets', chart: 'TrendCharts', finance: 'Coin', dish: 'Bowl', group: 'UserFilled', settings: 'Setting', milk: 'CoffeeCup', school: 'School', close: 'Close', success: 'Select', wechat: 'ChatDotRound' }
const dest = path.join(root, '学生食堂/static/canteen/icons')
const web = path.join(root, 'RuoYi-Vue3/public/canteen/icons')
await mkdir(dest, { recursive: true })
await mkdir(web, { recursive: true })
for (const [name, component] of Object.entries(names)) {
  const svg = (await renderToString(h(icons[component]))).replaceAll('currentColor', '#303b3b')
  await writeFile(path.join(dest, name + '.svg'), svg)
  await copyFile(path.join(dest, name + '.svg'), path.join(web, name + '.svg'))
}
console.log(`Exported ${Object.keys(names).length} Element Plus icons for the app and preview.`)
