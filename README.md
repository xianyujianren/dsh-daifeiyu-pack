# 大肥鱼套装 · dsh-daifeiyu-pack

给 **DeepSeek Harness**（桌面端 / dsh web）用的一键整合包：**开机动画 + 主题 + 桌宠**，
外加一套开箱能用的预设配置。

装之前你只有 DSH；装完你有一个会播开机序列的启动界面、一套 P.R.T.S. 风格界面、
和一只在桌面上溜达的蓝色大肥鱼。

```
          DEEPSEEK  HARNESS
   ┌──────────────────────────────────┐
   │  厂牌标识 → 过曝洗白 → 暖白档案底板 │   开机动画（可交互、带真声台词）
   │  → 五步访问授权 → 色散故障揭幕     │
   ├──────────────────────────────────┤
   │  P.R.T.S. 主题                    │   明日方舟 P.R.T.S. 风格 UI
   ├──────────────────────────────────┤
   │         🐟  ← 蓝毛小女仆           │   桌宠：会走会跳、能拖能甩、会碎碎念
   └──────────────────────────────────┘
```

> 本包是**整合包**：三件本体的作者不是我，我负责把它们装到一起、并附上能看的预设。
> 授权与出处见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

---

## 包含什么

| 东西 | 来源 | 本包做了什么 |
| --- | --- | --- |
| **开机动画** `dsh-startup-screen` | 上游 MIT（源码内置 `vendor/`） | 内置一份改过的版本；预设了身份名称 / 编号 / 权限等级 / 配色 / 音色 |
| **主题** `@ash-qw/dsh-theme-prts` | npm · MIT | 声明依赖自动装；附一段 patch 片段帮你把主题**默认打开** |
| **桌宠** `dsh-pet` | npm · MIT | 声明依赖自动装；预设在「右下角、160px、蓝毛小女仆」 |
| **套装本体**（这个包自己） | 本仓库 · MIT | 启动时检查 `~/.dsh` 里缺哪些配置，**只补缺的**，绝不覆盖你已有的设置 |

预设内容（`presets/`）：

- `dsh-startup.json` —— 开机动画的 33 项设置（身份「仙愈剑人」/ 编号 0087 / 权限 6 / 橙色主色 / 语速 0.88 / 音高 0.85 …）
- `pet.main-config.jsonc` —— 桌宠行为（重力 1400、弹性 0.78、会碎碎念、工作状态、边界约束）
- `pet.json` —— 桌宠显示状态（右下角、160px、气泡缩放 1）
- `theme-prts.patch.yml` —— 可选：让主题默认开启的 patch 片段

---

## 安装

### 一、一键（Windows，推荐）

1. 把本仓库下载/克隆到本地任意目录（**建议 D 盘**，别塞 `C:\Program Files`）
2. **完全退出 DeepSeek Harness Desktop**（托盘图标也要退）
3. 双击 **`安装.cmd`**

脚本会自己检测你有哪些 profile（`desktop` / `web`），然后跑：

```cmd
dsh plugin --profile desktop add "link:<本仓库路径>"
```

依赖（`dsh-pet`、`@ash-qw/dsh-theme-prts`）由 pnpm 一并装好。

### 二、手动

```bash
git clone https://github.com/xianyujianren/dsh-daifeiyu-pack.git
cd dsh-daifeiyu-pack

# 桌面端（先完全退出桌面端）
dsh plugin --profile desktop add "link:$PWD"

# 或者 dsh web
dsh plugin --profile web add "link:$PWD"
```

装完**重启**：桌面端重新打开；`dsh web` 关掉启动器窗口再双击。

### 三、前置条件

- 已经能跑 DSH：桌面端，或 `npm i -g @deepseek-ai/dsh` 起的 `dsh web`
- 有 `dsh` 命令（桌面端用户装一次全局 `@deepseek-ai/dsh` 就为了用它的 `plugin` 子命令）
- Node.js ≥ 20

---

## 装完检查

```bash
node lib/index.js           # 打印预设种子结果：哪些写了、哪些"已存在、没动"
```

- 开机动画：设置页里会多出「**启动动画**」一页，里面能改身份、编号、配色、语速、每句文案
- 主题：设置 → **主题**；默认是关的，要么手动打开，要么把 `presets/theme-prts.patch.yml` 贴进 profile patch
- 桌宠：右下角出现一只大肥鱼；拖动可以甩，长按能摸

profile patch 的位置：

```
C:\Users\<你>\.dsh\profiles\desktop\cordis.patch.yml    ← 桌面端
C:\Users\<你>\.dsh\profiles\web\cordis.patch.yml        ← dsh web
```

想改开机动画的身份文案，**直接改设置页**就行，会落回 `~/.dsh/dsh-startup.json`；
本包只在文件不存在时补一份预设，之后完全不管你。

---

## 自定义

| 想改什么 | 改哪里 |
| --- | --- |
| 开机动画的身份 / 编号 / 配色 / 语速 / 文案 | DSH 设置页 → 启动动画（落盘 `~/.dsh/dsh-startup.json`） |
| 桌宠大小 / 位置 / 物理手感 / 碎碎念 | `~/.dsh/dsh-pet/main-config.jsonc` |
| 主题开关 / 玻璃质感 / 侧栏默认隐藏 | profile 的 `cordis.patch.yml` 里 `id: theme-prts` 那段 |
| 不想让本包再碰预设 | 环境变量 `DSH_DAIFEIYU_PACK_NO_SEED=1`，或者删掉 `presets/` 里的对应文件 |

想再种一次预设（会先备份成 `*.bak-<时间戳>`）：

```bash
node lib/index.js --force
```

---

## 卸载

```bash
dsh plugin --profile desktop remove dsh-daifeiyu-pack
# 或者
dsh plugin --profile web remove dsh-daifeiyu-pack
```

卸载只摘插件，不动你的 `~/.dsh/*.json` 配置。想彻底清干净，再自己删：

- `~/.dsh/dsh-startup.json`
- `~/.dsh/dsh-pet/`、`~/.dsh/pet.json`

---

## 常见问题

**装的时候报 profile 被锁**
桌面端还开着。托盘里退干净，再重跑。

**装完界面没变化 / 少了某一件**
八成是同一件插件被注册了两次（手工往 `cordis.patch.yml` 里 insert 过）。
把手工加的 `- insert: ...` 那几行删掉再重启 —— `dsh plugin add` 已经会自动挂载了。

**开机动画没有第一帧，先闪一下加载卡**
上游 `dsh-startup-screen` 在桌面端需要一条 asar 补丁（在 `<head>` 里同步引用 `/dsh-startup/boot.js`）。
应用更新会把它换掉。不带补丁时插件会自动退化成「插件客户端自举」：功能齐全，只是开屏先闪一下。
补丁脚本见上游仓库 `DESKTOP.md`。

**主题装了但界面没变**
它默认 `enabled: false`。用 `presets/theme-prts.patch.yml` 打开，或去设置页手动开。

**依赖拉不下来**
`dsh-pet` / `@ash-qw/dsh-theme-prts` 走 npmjs。国内网络可以先给 pnpm 配镜像，或在能联网的环境装完再拷 `node_modules`。

---

## 目录结构

```
dsh-daifeiyu-pack/
├── package.json            # dsh.bundle.patch 指向下面的 patch；三件本体作为依赖
├── cordis.patch.yml        # 只挂「套装本体」这一行（其余由依赖各自挂载）
├── lib/index.js            # 宿主半侧：启动时补缺的预设，绝不覆盖
├── presets/                # 预设配置（开机动画 / 桌宠 / 主题片段）
├── vendor/dsh-startup-screen/  # 开机动画插件（上游 MIT，含修改）
├── test/smoke.mjs          # 自测：只补缺、不覆盖、force 先备份
├── 安装.cmd                # Windows 一键安装
└── THIRD_PARTY_NOTICES.md  # 三件上游的出处与授权
```

自测：

```bash
node test/smoke.mjs   # smoke ok
```

---

## 致谢与授权

- 开机动画：[6shenhonghong9/dsh-startup-screen](https://github.com/6shenhonghong9/dsh-startup-screen) · MIT © 2026 沈宏宏
- 桌宠：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet) · MIT © 2026 PC2005-cloud
- 主题：[ash-qw/dsh-theme-prts](https://github.com/ash-qw/dsh-theme-prts) · MIT © 2026 dsh-theme-prts contributors

本仓库自己的部分（整合、预设、脚本、文档）MIT © 2026 仙愈剑人。
三件本体的改动请提给上游；本仓库只负责「装到一起 + 预设」。

---

## English, briefly

A one-command bundle for DeepSeek Harness: boot animation (`dsh-startup-screen`, vendored, MIT),
P.R.T.S. theme (`@ash-qw/dsh-theme-prts`, npm), and a desktop pet (`dsh-pet`, npm), plus a preset
config for the "仙愈剑人" boot identity and a lazy whale-girl pet.

```bash
git clone https://github.com/xianyujianren/dsh-daifeiyu-pack.git
cd dsh-daifeiyu-pack
dsh plugin --profile desktop add "link:$PWD"   # quit the desktop app first
```

Restart DSH. The plugin only seeds config files that do not exist yet — your own settings are never
overwritten. Credits and licenses live in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
