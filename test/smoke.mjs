// 自测：不依赖 DSH 运行时，只验证种子逻辑的两条底线
//   1) 空 DSH_HOME 下三份配置都写出来；
//   2) 已有配置时绝不覆盖（除非 force，且覆盖前留备份）。
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { seed } from '../lib/index.js'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'daifeiyu-'))
const home = path.join(tmp, '.dsh')

const first = seed({ home })
assert.equal(fs.existsSync(path.join(home, 'dsh-startup.json')), true)
assert.equal(fs.existsSync(path.join(home, 'dsh-pet', 'main-config.jsonc')), true)
assert.equal(fs.existsSync(path.join(home, 'pet.json')), true)
assert.equal(first.filter((l) => l.includes('已写入')).length, 3, first.join('\n'))

const startupFile = path.join(home, 'dsh-startup.json')
fs.writeFileSync(startupFile, '{"identity":"我自己的设置"}')
const second = seed({ home })
assert.equal(fs.readFileSync(startupFile, 'utf8'), '{"identity":"我自己的设置"}')
assert.equal(second.filter((l) => l.includes('已存在')).length, 3, second.join('\n'))

seed({ home, force: true })
assert.equal(fs.readFileSync(startupFile, 'utf8').includes('仙愈剑人'), true)
assert.equal(fs.readdirSync(home).some((n) => n.includes('.bak-')), true)

fs.rmSync(tmp, { recursive: true, force: true })
console.log('smoke ok')
