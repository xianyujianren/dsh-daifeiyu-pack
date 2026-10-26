# 第三方组件与授权

本套装是「一键装齐 + 预设配置」的整合包，三件本体来自三个上游项目。
它们的作者不是我，授权是 MIT（可再分发，需保留版权声明）。

| 组件 | 版本 | 上游 | 授权 | 本仓库如何提供 |
| --- | --- | --- | --- | --- |
| dsh-startup-screen（开机动画） | 1.1.5 | https://github.com/6shenhonghong9/dsh-startup-screen | MIT © 2026 沈宏宏 | **源码内置**于 `vendor/dsh-startup-screen/`（`file:` 依赖） |
| dsh-pet（桌宠） | ^0.3.8 | https://github.com/PC2005-cloud/dsh-pet | MIT © 2026 PC2005-cloud | 只声明依赖，安装时从 npm 拉取 |
| @ash-qw/dsh-theme-prts（主题） | ^2.5.2 | https://github.com/ash-qw/dsh-theme-prts | MIT © 2026 dsh-theme-prts contributors | 只声明依赖，安装时从 npm 拉取 |

## 关于 `vendor/dsh-startup-screen/`

- 上游没有把包发到 npm，只发 tgz / GitHub，所以要「装一个包就齐活」只能随仓库带一份。
- 这一份是**修改版**（修了首帧白闪、加载卡透出、语音推进节奏等问题），改动跟随使用者本人的配置习惯；
  上游 `LICENSE` 原样保留在 `vendor/dsh-startup-screen/LICENSE`，上游文档（README / INSTALL / DESKTOP /
  AUDIO-FIELDS）也一并保留，出问题请先读那几份。
- 为了仓库体积，上游的 `test/`（自测脚本）与 `.bak` 中间产物没有一起带过来；要看原始测试请去上游仓库。
- 如果你想用**未经修改的上游版**：删掉 `vendor/`，把 `package.json` 里 `dsh-startup-screen` 那行换成
  上游的 tgz 或 git 地址，再重新 `dsh plugin add`。

## 其它

- `@ash-qw/dsh-theme-prts` 的 MIT 授权只覆盖**代码**；明日方舟相关的形象素材另见其
  `THIRD_PARTY_NOTICES.md`，本仓库不分发任何主题素材。
- 开机动画的语音素材（`vendor/dsh-startup-screen/lib/assets/*.mp3`）随上游 MIT 授权一并分发。
