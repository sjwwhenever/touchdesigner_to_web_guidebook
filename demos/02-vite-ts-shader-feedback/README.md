# Demo 2 · Feedback Shader（Three.js + GLSL）

**面向人群**：写过几行 JavaScript，听说过 shader，但没从零拉通过一条 ping-pong 反馈管线的人。
**技术栈**：[Vite](https://vitejs.dev) + TypeScript + [Three.js](https://threejs.org/) r165 + 手写 GLSL fragment shader。

**English:** [README.en.md](./README.en.md)

---

## 跑起来

```bash
cd demos/02-vite-ts-shader-feedback
npm install
npm run dev
```

浏览器会自动打开。移动鼠标，你会看到一个从鼠标位置不断向外旋转、衰减、色相滚动的反馈图像——这是 TD 里最经典的「Feedback TOP 教学案例」。

## 它在做什么

### 核心概念：ping-pong WebGLRenderTarget

```
     ┌─────────┐    read       ┌───────────────┐    write      ┌─────────┐
     │  rtA    │ ────────────▶ │ feedback.frag │ ────────────▶ │  rtB    │
     └─────────┘               └───────────────┘               └─────────┘
                                                                    │
                                 (swap rtA ↔ rtB next frame)        │
                                                                    ▼
                                                            ┌───────────────┐
                                                            │   copy.frag   │  ─→ screen
                                                            └───────────────┘
```

每一帧：
1. 从 `rtA` 读上一帧图像；
2. 经 `feedback.frag` 处理（旋转 + 缩放 + 衰减 + 画一个鼠标位置的亮点）；
3. 结果写到 `rtB`；
4. 用一个极简的 `copy.frag` 把 `rtB` 复制到屏幕；
5. 交换 `rtA` ↔ `rtB`，下一帧继续。

这就是 **TD 的 Feedback TOP 在 Web 上的全部实现**。

### 关键对照

| TD 节点 | 代码位置 |
|---|---|
| **Feedback TOP** | `rtA` / `rtB` ping-pong（`src/main.ts` 里 `makeRT()` 和 `swap`） |
| **Transform TOP**（旋转+缩放） | `feedback.frag` 的 `rotate(centered, uRotation)` + `/= uZoom` |
| **Level TOP**（乘法衰减） | `feedback.frag` 的 `prev * uFade` |
| **Circle TOP + Composite TOP**（鼠标亮点） | `feedback.frag` 的 `exp(-d*d*400.0) * hue` |
| **Mouse In CHOP** | `main.ts` 里的 `pointermove` 监听 |
| **Time CHOP**（色相滚动） | `main.ts` 里的 `THREE.Clock` |

### GLSL 代码本身几乎等同 TD

最重要的卖点：[`src/feedback.frag.glsl`](./src/feedback.frag.glsl) 里的 GLSL 代码，**如果复制到 TD 的 GLSL TOP 里，除了删掉 `varying vec2 vUv;` 并把 `vUv` 换成 `vUV`，几乎一字不改就能跑。** shader 语言是跨工具的通用语，这是从 TD 迁移到 Web 时最大的「免费知识」。

## 文件结构

```
02-vite-ts-shader-feedback/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html               ← 只有一个 <canvas>
└── src/
    ├── main.ts              ← Three.js 样板 + 两个 RT + 渲染循环
    ├── feedback.frag.glsl   ← Feedback TOP 等价实现（重点）
    ├── copy.frag.glsl       ← 从 RT 拷到屏幕（= Null TOP / Out TOP）
    └── passthrough.vert.glsl ← 全屏 quad 的 vertex shader（一次写好永远不动）
```

Vite 的 `?raw` import 直接把 `.glsl` 文件当字符串读进来，不用装额外的 glsl 插件。

## 练习题

1. **改反馈方向**：在 `main.ts` 里把 `uRotation` 从 `0.0025` 改成 `-0.005`，观察反向旋转。
2. **改衰减速度**：把 `uFade` 从 `0.985` 改到 `0.95`，亮度衰减快得多；改到 `0.998`，几乎不衰减。
3. **改注入形状**：`feedback.frag.glsl` 里的 `exp(-d*d*400.0)` 把 `400.0` 改成 `50.0`，亮点会变大成一个柔和的圆。
4. **加第二个注入点**：在 shader 里多加一个 `vec2 uMouse2`，在 `main.ts` 里每秒把它随机移动一次。
5. **引 lygia noise**：按 [映射表](../../docs/mapping-table.md) 的 Noise TOP 片段，在 `feedback.frag.glsl` 里引 snoise 进去，用 noise 扰动 UV，做「液态反馈」效果。

## 踩坑

- **黑屏**：检查 `dist/` 目录是否 build 过；在 dev 模式下检查 console 有没有 GLSL 编译错误。
- **半精度 (`HalfFloatType`) 不支持**：极老的 GPU 可能不支持，可以改成 `UnsignedByteType`，代价是 8bit 量化会让衰减出现 banding。
- **鼠标位置和亮点对不上**：记得 GL 的 y 轴向上，代码里 `1 - e.clientY / window.innerHeight` 做了翻转。
- **Vite HMR 替换 shader 后出现双重渲染**：正常现象，刷新一下页面即可。

## 下一步

- 读 [`td-comparison.md`](./td-comparison.md) 看完整节点图对照。
- 读 [`prompts.md`](./prompts.md) 看这个 demo 是用什么 prompt 让 AI 写的。
- 去 [Demo 3](../03-svelte-midi-playground/) 看怎么把这些 uniform 接到 MIDI 控制器上。
