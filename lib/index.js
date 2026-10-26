// dsh-daifeiyu-pack —— 宿主半侧
//
// 这个插件本身不画任何界面，只做一件事：
//   在 DSH 启动时，如果用户还没有对应配置，就把套装的预设「种」进 ~/.dsh，
//   让人装完重启就能看到一样的开机动画 / 桌宠观感，而不是一片空配置。
//
// 三条铁律：
//   1) 目标文件已存在就绝不覆盖（除非显式 force / 手动跑 node lib/index.js --force）；
//   2) 任何异常都吞掉 —— 种子失败不能影响 DSH 启动；
//   3) 不联网、不写注册表、不动 node_modules。

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-daifeiyu-pack'
export const inject = []

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PRESET_DIR = path.join(HERE, '..', 'presets')

// 预设 -> 目标（相对 ~/.dsh）
const SEEDS = [
  { preset: 'dsh-startup.json',      target: ['dsh-startup.json'],             label: '开机动画配置' },
  { preset: 'pet.main-config.jsonc', target: ['dsh-pet', 'main-config.jsonc'], label: '桌宠配置' },
  { preset: 'pet.json',              target: ['pet.json'],                     label: '桌宠显示状态' }
]

function dshHome() {
  return process.env.DSH_HOME || path.join(os.homedir(), '.dsh')
}

/**
 * 把预设种进 ~/.dsh。默认不覆盖已有文件。
 * @param {{force?: boolean, home?: string}} [opts]
 * @returns {string[]} 逐条结果，方便日志与自测断言
 */
export function seed(opts = {}) {
  const home = opts.home || dshHome()
  const force = opts.force === true
  const report = []

  for (const s of SEEDS) {
    const from = path.join(PRESET_DIR, s.preset)
    const to = path.join(home, ...s.target)

    if (!fs.existsSync(from)) {
      report.push(`${s.label}：预设文件缺失（${from}），跳过`)
      continue
    }
    if (fs.existsSync(to) && !force) {
      report.push(`${s.label}：已存在，保持你的设置不动`)
      continue
    }
    try {
      fs.mkdirSync(path.dirname(to), { recursive: true })
      if (fs.existsSync(to)) fs.copyFileSync(to, `${to}.bak-${Date.now()}`)
      fs.copyFileSync(from, to)
      report.push(`${s.label}：已写入 ${to}`)
    } catch (err) {
      report.push(`${s.label}：写入失败（${err?.message ?? err}）`)
    }
  }
  return report
}

export function apply(ctx) {
  try {
    if (process.env.DSH_DAIFEIYU_PACK_NO_SEED === '1') return
    const report = seed()
    const text = '[dsh-daifeiyu-pack] 预设检查完成\n  ' + report.join('\n  ')
    if (typeof ctx?.logger?.info === 'function') ctx.logger.info(text)
    else console.log(text)
  } catch (err) {
    try {
      console.warn('[dsh-daifeiyu-pack] 预设种子失败（已忽略，不影响启动）：', err?.message ?? err)
    } catch {}
  }
}

// 手动跑：node lib/index.js [--force]
const self = fileURLToPath(import.meta.url)
const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(self)
if (invokedDirectly) {
  const force = process.argv.includes('--force')
  console.log(`[dsh-daifeiyu-pack] DSH_HOME = ${dshHome()}${force ? '（--force：覆盖已有配置，先备份）' : ''}`)
  for (const line of seed({ force })) console.log('  • ' + line)
}
