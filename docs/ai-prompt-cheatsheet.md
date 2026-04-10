# AI 提示词备忘单

**English:** [ai-prompt-cheatsheet.en.md](./ai-prompt-cheatsheet.en.md)

---

> 这是本项目最想让你带走的东西。在 AI 能替你写 90% 代码的时代，**「知道让 AI 用哪个库」比「自己会写」更重要**。

下面的模版都假设你已经看过 [映射表](./mapping-table.md)。

## 一、通用模版（可以直接抄）

```
我要把我在 TouchDesigner 里的一个效果迁移到浏览器。

TD 的节点组合是：
  [节点1] → [节点2] → [节点3]
效果是：
  [用一两句话描述]

请用 [Three.js / p5.js / Svelte + webmidi.js / 其它] 在浏览器里实现同样的效果。

约束：
- 语言：[JS / TS]
- 构建：[不要构建工具，单 HTML 文件 / 用 Vite / 用 SvelteKit]
- 目标浏览器：最新 Chrome
- 只给我一个/两个文件，不要整个项目骨架
- 不要帮我加任何我没要求的库
```

这个模版为什么有效：

1. **明确输入和输出**：AI 不用猜你想要什么；
2. **指定了库**：AI 不会东拉西扯推荐它听说过的任何库；
3. **指定了技术栈深度**：「不要构建工具」会逼 AI 用原生 API + CDN，适合教学；
4. **「只给我一个文件」**：减少 AI 幻觉出一堆文件的概率。

## 二、按 TD 能力分类的填好的例子

### 示例 1 · CHOP（音频反应）

```
我要把我在 TouchDesigner 里的一个效果迁移到浏览器。

TD 的节点组合是：
  Audio Device In CHOP → Audio Spectrum CHOP → 取前 16 个 bin → Circle SOP 半径
效果是：
  一个圆，半径随麦克风声音的低频强度实时变化。

请用 p5.js + Web Audio API 在浏览器里实现同样的效果。

约束：
- 语言：JS
- 构建：不要构建工具，单 HTML 文件，从 CDN 加载 p5
- 目标浏览器：最新 Chrome
- 只给我一个 index.html
- 需要一个「点击开始」按钮来触发麦克风权限（浏览器要求用户手势）
```

对应实现见 [`demos/01-vanilla-audio-reactive/`](../demos/01-vanilla-audio-reactive/)。

---

### 示例 2 · TOP（Feedback + GLSL）

```
我要把我在 TouchDesigner 里的一个效果迁移到浏览器。

TD 的节点组合是：
  Feedback TOP → Transform TOP（轻微旋转+缩放）→ Level TOP → 回环
  + 鼠标位置在中心画一个亮点注入反馈
效果是：
  经典的反馈循环图像——一个从中心不断向外旋转扩散的辉光。

请用 Vite + TypeScript + Three.js 实现。关键点是用两张 WebGLRenderTarget 做 ping-pong。

约束：
- 语言：TypeScript
- 构建：Vite
- 目标浏览器：最新 Chrome
- 给我：package.json、vite.config.ts、index.html、src/main.ts、src/feedback.frag.glsl
- Three.js 用最新版（r160+ 的 API，不要用 .setSize 之外的老写法）
- fragment shader 写在单独的 .glsl 文件里，不要嵌字符串
```

对应实现见 [`demos/02-vite-ts-shader-feedback/`](../demos/02-vite-ts-shader-feedback/)。

---

### 示例 3 · MIDI + SOP/TOP（硬件控制 3D 场景）

```
我要把我在 TouchDesigner 里的一个效果迁移到浏览器。

TD 的节点组合是：
  MIDI In CHOP（一个旋钮控制器，CC 16~19）
  → Math CHOP 归一化到 [0,1]
  → 分别驱动 Geometry COMP 的 Transform SOP 旋转、缩放、颜色
效果是：
  一个可旋转的 3D 场景（几个 mesh），四个旋钮分别控制旋转速度、几何复杂度、shader 颜色色相、辉光强度。

请用 SvelteKit + Three.js + webmidi.js 实现。

约束：
- 语言：TypeScript
- 构建：SvelteKit（最新版，adapter-static）
- 目标浏览器：最新 Chrome
- 如果检测不到 MIDI 设备，在屏幕上显示 4 个 <input type="range"> 作为回退
- 给我：一个 +page.svelte、一个 Scene.ts（封装 Three.js）、一个 midi.ts（封装 webmidi.js）
- 用 Svelte store 把 MIDI 值暴露出来，让 Scene.ts 响应式地读取
```

对应实现见 [`demos/03-svelte-midi-playground/`](../demos/03-svelte-midi-playground/)。

---

## 三、AI 常犯的错（陷阱清单）

让 AI 替你写 TD 迁移代码的时候，请警惕以下几类错误，**不要直接相信 AI 生成的第一版**——跑一遍，报错就把报错原文贴回去让它修。

### Three.js
- **WebGLRenderTarget 新旧 API 混用**：新版 (r150+) 的 clone/set 语义变了，AI 经常把 r120 和 r160 的代码混着给。要求它 `import * as THREE from 'three'` 并用最新 API。
- **忘记 `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`**：在高分屏上画面糊或闪烁，多半是这个没设。
- **颜色空间**：新版 Three.js 默认 `SRGBColorSpace`，老代码里用 `encoding = sRGBEncoding` 会警告。
- **`requestAnimationFrame` 的 this 丢失**：AI 写 class 时经常忘 bind。

### Web Audio
- **不是用户手势触发**：`AudioContext` 在浏览器里必须由用户点击/按键后创建或 `resume()`，否则被 suspend。症状：麦克风权限弹出但 `analyser` 全是 0。
- **忘了 `getUserMedia` 需要 https 或 localhost**：file:// 打开 HTML 是拿不到麦克风的。用 `python3 -m http.server` 或 Vite dev server。
- **`fftSize` 必须是 2 的幂**：256/512/1024/2048/4096，给别的值会抛异常。

### webmidi.js
- **v2 vs v3 的 API 区别很大**：v3 开始用 `WebMidi.inputs[0].addListener('controlchange', fn)`；v2 是 `addListener('controlchange', 'all', fn)`。一定要求 AI 用 v3。
- **Firefox 不支持 Web MIDI**（至今）。要求 AI 加兼容性检测并 fallback。
- **没连设备时 `inputs.length === 0`**：写 fallback UI。

### p5.js
- **`preload/setup/draw` 全局模式 vs instance 模式**：AI 混着写会出奇怪的作用域错误。要求它「只用 instance 模式」或「只用全局模式」。
- **麦克风要 `p5.AudioIn`（`p5.sound` 库）**：默认 `p5.min.js` 不带 sound，要额外加载 `p5.sound.min.js`。

### SvelteKit
- **`+page.svelte` 里直接 `import * as THREE from 'three'` 会在 SSR 阶段崩**：Three.js 依赖 `window`。要用 `onMount` 或 `$effect`，或者 `<svelte:head>` + `browser` 守卫。
- **`adapter-static` 需要 `prerender = true`**：不设会报错。
- **Svelte 5 的 runes 语法** (`$state`, `$derived`, `$effect`) **和 Svelte 4 的 `$:` 语法不兼容**。先问 AI 用哪个版本。

---

## 四、当 AI 给你的代码跑不起来时

这是一个标准的调教流程：

1. **把报错原文完整贴回去**（不要自己翻译/总结）；
2. **附上 AI 生成的代码版本**（或者 commit hash）；
3. **说明你已经检查了什么**（例：「我确认 `node_modules/three` 是 r160.2」）；
4. **要求最小修改**：「请只改导致这个报错的部分，不要重写整个文件」。

迭代 2~3 次通常就能跑。如果 5 次还跑不起来，多半是你给它的上下文缺了什么——回到模版第一步，重新描述一遍需求。

---

## 五、终极心法

> **你不是在学写代码。你是在学怎么当一个懂 Web 生态的 AI 导演。**

知道什么能做 + 知道该用哪个库 + 知道怎么验证结果 —— 这三件事比语法熟练度重要得多。映射表给你前两件，这份备忘单给你第三件。
