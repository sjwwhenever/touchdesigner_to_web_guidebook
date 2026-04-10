# Demo 3 的 AI 提示词

## 原始 Prompt

```
我要把我在 TouchDesigner 里的一个控制器→3D 场景的作品迁移到浏览器。

TD 的节点组合是：
  MIDI In CHOP（一个 4 旋钮控制器，CC 16~19）
  → Math CHOP 归一化到 [0, 1]
  → 分别驱动：
      - Transform SOP 的旋转速度（对称到 -2..2 rad/s）
      - Torus SOP 的 p/q 参数（弯绕圈数，0..7 整数）
      - GLSL TOP 的 uHue uniform（0..1）
      - GLSL TOP 的 uGlow uniform（0..1，边缘发光强度）

效果是：
  一个不停旋转的 torus knot 3D 物体，着色是渐变色 + rim light，
  四个旋钮分别控制 旋转速度 / 几何复杂度 / 色相 / 发光。

请用 SvelteKit（latest, adapter-static） + TypeScript + Three.js (r160+)
  + webmidi.js v3 实现。

关键约束：
- Svelte 4 语法（writable store + $store + bind:value），不要用 Svelte 5 runes
- 如果浏览器不支持 Web MIDI（例如 Firefox），或者没有 MIDI 设备连接，
  必须 fallback 到 4 个屏幕 slider，功能完全相同
- 4 个参数都放在 src/lib/stores.ts 里作为独立的 writable store
- midi.ts 只负责把 CC 消息翻译成 store.set()
- Scene.ts 只负责读 store 并驱动 Three.js；不能 import midi.ts
- +page.svelte 只负责布局和 slider，不直接持有 Three.js 或 MIDI 逻辑
- +layout.ts 必须设 ssr = false（因为 Three.js 依赖 window）

交付物：
  package.json, svelte.config.js, vite.config.ts, tsconfig.json,
  src/app.html,
  src/routes/+layout.ts, src/routes/+page.svelte,
  src/lib/stores.ts, src/lib/midi.ts, src/lib/Scene.ts
```

## 微调 Prompt（你几乎一定会遇到的问题）

### 「webmidi.js v3 导入报错」

```
我装的是 webmidi@^3.1，但你给的 import 语句是
  import WebMidi from 'webmidi'
实际上 v3 应该是
  import { WebMidi, type Input, type MessageEvent } from 'webmidi'
请改一下 midi.ts 的 import。
```

### 「Torus 的 p/q 是浮点不好看」

```
我现在用 CC17 直接当 p 参数，看起来每次 CC 微动都会导致几何剧烈重建 + 闪烁。
请把 complexity 量化为 0..7 的整数（Math.round(c * 7)），
并且只在这个量化值发生变化时才重建 geometry。
```

### 「我的控制器发的 CC 不是 16-19」

```
我的控制器实际发的 CC 是 70, 71, 72, 73。
请把 ccMap 改成这四个号，而不是 16-19。
```

## 为什么要把 store / midi / scene 拆成三个文件

这是有意的。拆分带来的好处：

1. **Scene.ts 不知道 MIDI 的存在**——它只看到 store。如果以后你想用音频、OSC、甚至一个 WebSocket 服务器来驱动，只要新写一个「writer」文件写同一批 store，Scene.ts 完全不用动。
2. **midi.ts 不知道 Three.js 的存在**——它只看到 store。你可以在一个完全没有 canvas 的页面上用它，做一个 MIDI debugger。
3. **+page.svelte 只负责 UI**——它既是「读取者」也是「写入者」（slider bind），因为这是 UI 框架的自然职责。

这对应 TD 里「不同的 Container COMP 分工明确，通过 CHOP 通道通讯」的思维。

## 把这个模版用到你自己的作品

替换这三部分：

1. **CC 映射表**：你的旋钮/推子对应哪些 CC？改 `ccMap`。
2. **4 个 store 的名字**：换成你的语义。比如你可能想要 `spawnRate`, `lifetime`, `gravity`, `colorShift`。
3. **Scene.ts 里怎么用这些值**：这是你作品的真正内容——AI 帮不了你的，**这部分你来想**。

前两步是纯机械翻译，AI 一定能写对。第三步才是你作为一个艺术家 / 设计师的价值所在。
