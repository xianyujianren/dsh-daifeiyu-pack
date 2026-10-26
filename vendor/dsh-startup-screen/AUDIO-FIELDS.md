# 需要音频的字段清单

本文件列出启动动画里**所有会出声的槽位**，以及每个槽位当前用的是哪份素材。
数值与文件名直接从 `lib/splash.js` 抓取。**最后更新：2026-10-26（六条台词统一重录）**

---

## 一、语音台词 —— 6 个槽位，全部用真声素材

素材由同一个神经女声合成，六条一致：`edge-tts` / **en-US-AvaNeural**，
语速 `+8%`、音调 `-3Hz`，响度统一归到 **-23.5 LUFS**（峰值留 -2 dB 余量）。

台词刻意和画面上的英文副标题对齐，念的和看到的是同一句。

| 槽位 | 中文主字 | 英文副标题 | 素材文件 | 台词 | 素材时长 | 出声时机 |
|---|---|---|---|---|---|---|
| `line-1` | 需要访问许可 | `ACCESS PERMISSION REQUIRED` | `lib/assets/line-1.mp3` | Access permission required. | **1.97s** | 洗白后第一步，与文字渐显同时 |
| `line-2` | 身份资料确认 | `IDENTITY VERIFICATION` | `lib/assets/line-2.mp3` | Identity verification. | **1.92s** | 第二步（身份卡 + 等确认） |
| `line-3` | 接收访问需求 | `ACCESS REQUEST RECEIVED` | `lib/assets/line-3.mp3` | Access request received. | **2.09s** | 第三步（鲸鱼标识一笔画成） |
| `line-4` | 开始读取权限 | `PERMISSION READ STARTED` | `lib/assets/line-4.mp3` | Permission read started. | **1.63s** | 第四步（十六进制瀑布） |
| `line-5` | 读取完毕 · 核验通过 | `READ COMPLETE · VERIFIED` | `lib/assets/line-5.mp3` | Read complete. Verified. | **2.42s** | 第五步（环形准星扫描） |
| `line-6` | 终幕 WELCOME TO | `DEEPSEEK HARNESS` | `lib/assets/line-6.mp3` | Welcome to DeepSeek Harness. | **2.16s** | 终幕揭幕前（色散故障亮起来那一刻） |

### 2026-10-26 这轮改了什么

- **终幕那条不再走 TTS。** 旧 `line-6.mp3` 只有 **0.565s**（`"welco…"` 半句），
  一播就断，只能强制退回系统 TTS 念白；而系统 TTS（Zira，pitch 0.85）跟前五条真声
  完全不是一个人，听感就是"这谁在说话"。现在六条同一声源，终幕重新走素材。
- 前五条的台词跟着英文副标题重新定稿（`Beginning permission read` → `Permission read started`、
  `Read complete. Verification passed` → `Read complete. Verified`），`say` 字段同步，
  所以就算哪天素材丢了回落 TTS，念的也是同一句。
- 素材 URL 加了版本号 `?v=ASSET_VERSION`：`/dsh-startup/asset/` 的响应带
  `Cache-Control: public, max-age=86400`，不改 URL 的话桌面端会继续播一天前的旧素材。

### 终幕那句为什么不含身份名称

画面上的「欢迎 `<身份名称>` 访问」是**文字**，不念。素材是一句固定话术，
和设置页里可改的名字无关 —— 名字要是动态的，素材永远对不上。

### 素材取不到时

`voiceSource = 'asset'`（默认）时优先用素材；**素材缺失或解码失败会自动回落到 TTS**，
`say` 字段就是回落使用的文本。设置页可强制 `tts`。

---

## 二、界面音效 —— 8 个槽位

| # | 槽位 | 出声时机 | 素材 | 状态 |
|---|---|---|---|---|
| 1 | `cue` | **每次念台词之前**的两声轻提示 | 合成（1046.5 + 1568 Hz） | 合成 |
| 2 | `tick` | 文字逐字渐显 | `lib/assets/sfx-tick.mp3` | ✅ 真素材 |
| 3 | `step` | 每个阶段推进 | 同上 | ✅ 真素材 |
| 4 | `confirm` | 点按钮 / 按 Enter 确认 | 同上 | ✅ 真素材 |
| 5 | `tickRun` | 十六进制瀑布开始滚动 | `lib/assets/sfx-ticks-run.mp3` | ✅ 真素材 |
| 6 | `sweep` | 黑幕 → 暖白底板的洗白过场 | 合成（带通噪声扫频） | 合成 |
| 7 | `rise` | 黑幕上 DeepSeek 标识出现 | 合成（220→990 Hz 上行） | 合成 |
| 8 | `chime` | 终幕揭幕 | 合成（三音和声钟） | 合成 |

`tick` / `step` / `confirm` 目前**共用同一个「哒」**（音量不同）。
音效这轮没动，还是原素材 + 合成。

---

## 三、素材清单

```
lib/assets/
├─ line-1.mp3          48 KB   Access permission required.     1.97s
├─ line-2.mp3          47 KB   Identity verification.          1.92s
├─ line-3.mp3          51 KB   Access request received.        2.09s
├─ line-4.mp3          40 KB   Permission read started.        1.63s
├─ line-5.mp3          58 KB   Read complete. Verified.        2.42s
├─ line-6.mp3          52 KB   Welcome to DeepSeek Harness.    2.16s
├─ sfx-tick.mp3         2.1 KB 单声「哒」（20ms，质心 7.5kHz）
├─ sfx-ticks-run.mp3   10.2 KB 整串 10 个「哒」，每 45ms 一个
└─ _old-20261026/              上一版素材（旧 line-1…6 + 半句 line-6）备份
```

六条统一 **44.1 kHz / 单声道 / MP3 192 kbps / -23.5 LUFS**，
定标方式是按每条自身测出的整体响度做纯增益，不做动态压缩，句内起伏保留。

Host 经 `/dsh-startup/asset/<文件名>` 只读下发（正则白名单 + 防目录穿越），
子目录不进白名单，所以 `_old-*` 备份不会被下发。

---

## 四、时长怎么定

**不写死。** 每一步的停留时间 = `max(视觉基准, 实际音频时长 + 240ms 收尾)`：

```js
var spoke = voice.line(step.say, step.zh, step.audio)   // Promise<这一句实际播了多久>
function holdFor(spoken) {
  var target = Math.max(ms(step.hold), (spoken || 0) + ms(240))
  return wait(Math.max(0, target - (spoken || 0)))
}
```

素材播多长，动画就等多久；**用户点得快也不掐断语音**。
只有「跳过 / 揭幕」才真的 `cancel()`。

按新素材时长，五步语音段落约 `1.97s → 1.92s → 2.09s → 1.63s → 2.42s`，
终幕再 +2.16s。**比上一版整体长约 5 秒** —— 旧素材是从参考片里硬剪出来的短句，
新素材是完整句。嫌拖就把语速调到 `+18%` 重录（见第七节），能压回三秒左右。

---

## 五、有字但故意不配音的字段

`en`（中央大字）· `log` / `logEn`（底部日志）· `btnZh` / `btnEn`（按钮）· `badge`（阶段计数）·
`brand1/2/3`、`orgZh/orgEn/orgSub`、`welcomeBox`、`footer`（品牌与页脚）

---

## 六、相关设置项

| 设置项 | 作用 |
|---|---|
| `voice` | 语音播报总开关 |
| `voiceSource` | `asset`=优先真声素材 / `tts`=全 TTS |
| `voiceLang` | `en` / `zh` / `both`（只影响 TTS 回落时念什么） |
| `voiceName` / `voiceRate` / `voicePitch` / `voiceVolume` | **只作用于 TTS 回落**，不影响素材 |
| `voiceCue` | 念台词前的提示音开关 |
| `voiceLead` | 提示音之后留多久再开口（默认 240ms） |
| `sound` / `soundVolume` | 界面音效总开关与音量（**不连坐语音素材**） |
| `sfx` | 音效来源：`audio`=真素材 / `synth`=全合成 |

---

## 七、换音色 / 重录

东西都在 `D:\尝试\开机语音试听\`：

- `01 Ava …05 Jenny` 五个音色的试听（欢迎语 + 第一句各一条），挑一个；
- `重录语音.py`：改最上面 `VOICE` / `RATE` / `PITCH` 三行再跑，它会
  ① 备份现有素材到 `lib/assets/_old-<时间戳>/`；② 重录六条并对齐响度；
  ③ 把 `splash.js` 的 `ASSET_VERSION` 推到今天（同一天重跑会 a→b→c 递增，绕开缓存）。

依赖：`pip install edge-tts --index-url https://pypi.org/simple`。

要退回旧的人声素材：把 `lib/assets/_old-20261026/line-*.mp3` 拷回 `lib/assets/`，
再把 `ASSET_VERSION` 改一个值即可。
