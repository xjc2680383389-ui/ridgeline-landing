# 脊线 RIDGELINE — 户外机能装备落地页

一个虚构户外机能品牌的产品展示与预订落地页。品牌定位是高质量、高耐用度、高实用性，
页面的设计概念是：**耐用不是形容词，是可以缝进洗标的实测数据**——每个卖点都带实测值与测试方法标准号。

## 运行

```bash
npm install        # 安装依赖（React 19 / Vite 8 / TypeScript 5.9）
npm run dev        # 开发服务器 http://localhost:5173
npm run build      # 类型检查 + 产物构建到 dist/
npm run preview    # 预览构建产物 http://localhost:4173
npm run typecheck  # 仅做类型检查
```

`vite.config.ts` 里设置了 `base: './'`，`dist/` 可以放在任意子路径下部署。

## 技术选择

- **Vite + React 19 + TypeScript**，strict 模式，`noUnusedLocals` / `verbatimModuleSyntax` 全开
- **无 UI 框架、无 CSS 预处理器**：设计令牌与样式集中在两个 CSS 文件，避免为单页引入组件库
- **无外部图片请求**：五款装备的图都是手绘 SVG 技术图纸（`ProductArt.tsx`），离线可用、任意分辨率清晰
- **字体本地打包**：`@fontsource` 引入 Big Shoulders Display（工业招牌体，用于型号名与数字）、
  IBM Plex Sans（正文）、IBM Plex Mono（仅用于需要数位对齐的实测值）。中文使用系统字体栈，
  不加载中文 webfont——那会让首屏多出几 MB

## 结构

```
src/
├─ main.tsx / App.tsx          入口与区块组装（产品详情抽屉的开关状态在 App）
├─ fonts.ts                    字体子集导入
├─ styles/
│  ├─ global.css               设计令牌（色 / 字 / 尺度 / 动效）、reset、排版与控件原语
│  └─ sections.css             区块样式，顺序与页面一致
├─ data/
│  ├─ catalog.ts               五款装备：型号、简介、价格、实测头条、规格、工艺、配色尺码
│  └─ site.ts                  导航、Hero 实测条、八项测试报告、品牌时间线、交付批次、页脚
├─ state/PreorderContext.tsx   预订清单 + 回执 + 提示，useReducer + localStorage
├─ hooks/                      useCountUp / useScrollSpy / useModal / useMotion
└─ components/                 Header Hero ContourField ProofSection CatalogSection
                               ProductCard ProductArt ProductDrawer StorySection
                               PreorderSection SiteFooter Toast
```

状态管理只有一处共享状态（预订清单），用 Context + reducer；其余为组件局部状态（筛选、表单、抽屉选择）。
文案与数值全部来自 `src/data/`，改产品不需要动组件。

## 预订流程

产品卡「选尺码加入预订」→ 抽屉内选尺码 / 配色 / 数量 → 加入清单（toast 与头部计数即时反馈）
→ 预订区可改数量、删除、清空 → 填表提交：字段级校验（失焦即校验、提交时聚焦第一个错误）
→ 提交中态 → 就地生成回执（预订编号、批次、清单快照、后续三步）→ 刷新后从 localStorage 恢复。

清单为空时表单仍可用，按钮与提示改为「保存本地批次意向」，而不是禁用保存。

当前没有商家接口：清单和回执只保存在当前浏览器，不会发出订单、短信或邮件。请使用测试信息体验表单，勿填写真实联系方式。清除浏览器网站数据会删除本地清单。

`npm run test:storage` 验证异常缓存、规格与数量校验、回执恢复；`npm run build` 继续执行类型检查和生产构建。

## 响应式与可访问性

- 断点：1040 / 900 / 760 / 640 / 460；320px 宽度下无横向溢出
- 移动端：导航为全屏抽屉，产品详情改为底部面板
- 跳转链接、`aria-live` 播报表单与清单反馈、`aria-pressed` 标记选中态、键盘焦点环（信号橙）
- 浮层锁定滚动、Esc 关闭、Tab 收拢在面板内、关闭后焦点归位
- `prefers-reduced-motion` 下等高线绘制与数字滚动直接呈现终值
- 正文与背景对比度 ≥ 4.5:1；信号橙按钮使用深色文字（4.8:1）

## 已验证

`npm run typecheck` 与 `npm run build` 无报错；开发服务器下用无头浏览器走完预订全流程
（加清单 → 校验拦截 → 修正 → 提交 → 回执 → 刷新恢复），并在 1440 / 900 / 390 / 320 四档截图逐屏检查，
控制台与网络无错误。
