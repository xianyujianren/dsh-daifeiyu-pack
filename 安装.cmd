@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>nul

REM ============================================================================
REM  dsh-daifeiyu-pack（大肥鱼套装）安装脚本
REM  ---------------------------------------------------------------------------
REM  装的东西：
REM    本套装本体 + dsh-startup-screen（开机动画）+ dsh-pet（桌宠）
REM    + @ash-qw/dsh-theme-prts（主题）
REM  做法：dsh plugin add "link:<本目录>"，依赖由 pnpm 一并装进 profile。
REM
REM  桌面端注意：安装前请**完全退出** DeepSeek Harness Desktop
REM  （desktop profile 的 package.json 由桌面端进程加锁管理，进程在跑时装不进去）。
REM ============================================================================

set "HERE=%~dp0"
if "%HERE:~-1%"=="\" set "HERE=%HERE:~0,-1%"

echo.
echo ============================================================
echo   大肥鱼套装 安装（开机动画 + 主题 + 桌宠）
echo ============================================================
echo   包目录：%HERE%
echo.

where dsh >nul 2>nul
if errorlevel 1 goto no_dsh

if not exist "%HERE%\package.json" goto no_pkg

set "PKG=link:%HERE%"

set "HAS_WEB="
set "HAS_DESKTOP="
if exist "%USERPROFILE%\.dsh\profiles\web\package.json" set "HAS_WEB=1"
if exist "%USERPROFILE%\.dsh\profiles\desktop\package.json" set "HAS_DESKTOP=1"

if defined HAS_WEB     echo [1/2] 检测到 web profile
if defined HAS_DESKTOP echo [1/2] 检测到 desktop profile（桌面端）
if not defined HAS_WEB if not defined HAS_DESKTOP (
  echo [1/2] 没有检测到已初始化的 profile
  echo        web 用户先跑一次 dsh web；桌面端用户先打开一次桌面端再退出。
  goto done
)

echo [2/2] 开始安装：!PKG!
echo.

if defined HAS_WEB (
  echo ---- 安装到 web profile ----
  call dsh plugin --profile web add "!PKG!"
  if errorlevel 1 (
    echo    ^> web profile 安装失败，看上面的报错。
    echo      常见原因：同名插件已装过（先 remove）；或网络拉不到依赖。
  ) else (
    echo    ^> web profile 安装完成
  )
  echo.
)

if defined HAS_DESKTOP (
  echo ---- 安装到 desktop profile ----
  echo    提示：如果报 profile 被锁，请先完全退出桌面端再重跑本脚本。
  call dsh plugin --profile desktop add "!PKG!"
  if errorlevel 1 (
    echo    ^> desktop profile 安装失败，看上面的报错。
  ) else (
    echo    ^> desktop profile 安装完成
  )
  echo.
)

echo ============================================================
echo   装完了，接下来：
echo ============================================================
echo   1. web     ：重启 dsh web（关掉启动器窗口再双击），刷新页面。
echo      desktop ：重新打开 DeepSeek Harness Desktop。
echo   2. 想开 P.R.T.S. 主题（默认是关的）：
echo      把 presets\theme-prts.patch.yml 的内容贴进 profile 的 cordis.patch.yml 末尾，
echo      或者进 设置 - 主题 里手动打开开关。
echo   3. 想看种子到底写了什么：node lib\index.js
echo.
echo   卸载：
echo      dsh plugin --profile web remove dsh-daifeiyu-pack
echo      dsh plugin --profile desktop remove dsh-daifeiyu-pack
echo.
pause
exit /b 0

:no_dsh
echo [x] 找不到 dsh 命令。
echo.
echo     先装 DSH：npm i -g @deepseek-ai/dsh
echo     （桌面端用户装一次全局 dsh 只是为了用它的 plugin 子命令，
echo       插件本身是装进桌面端的 profile。）
pause
exit /b 1

:no_pkg
echo [x] 本目录里没有 package.json，请把脚本放在仓库根目录再跑。
pause
exit /b 1

:done
pause
exit /b 0
