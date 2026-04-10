# Demo 3 · Svelte + webmidi.js + Three.js Playground

**面向人群**：会用 npm，熟悉 ES 模块，想看 Web 框架里响应式状态如何替代 TD 的 CHOP 数据流。
**技术栈**：[SvelteKit](https://kit.svelte.dev) + [Three.js](https://threejs.org/) + [webmidi.js](https://webmidijs.org/)。

**English:** [README.en.md](./README.en.md)

---

## 跑起来

```bash
cd demos/03-svelte-midi-playground
npm install
npm run dev
```

- 有 MIDI 控制器？插上（推荐带 4 个旋钮的 nanoKONTROL / MIDI Fighter Twister / 任何能发 CC 的设备），启动时浏览器会弹出 MIDI 权限，允许后旋钮就能直接控制场景。默认映射是 **CC 16/17/18/19**。
- 没有 MIDI 设备？完全没问题，右侧会显示 4 个 slider 做回退。

## 为什么选 Svelte（而不是 React）

**因为 Svelte 的响应式 store 是「TD 心智模型的最近邻」。** 在 TD 里：

- 你改一个 CHOP 通道值，所有依赖它的地方**自动**更新。
- 你不需要写「通知下游」的代码。

Svelte 的 `writable` store + `$store` 语法做的就是同一件事。你把 4 个 CC 值放到 4 个 store 里：

```ts
export const rotSpeed   = writable(0.5);
export const complexity = writable(0.5);
export const hue        = writable(0.5);
export const glow       = writable(0.5);
```

然后——
- **MIDI 端**（`src/lib/midi.ts`）收到 controlchange 消息时 `rotSpeed.set(value)`；
- **UI 端**（`src/routes/+page.svelte`）用 `bind:value={$rotSpeed}` 直接绑到 slider；
- **Three.js 端**（`src/lib/Scene.ts`）每帧 `get(rotSpeed)` 读值。

**三个地方共享同一个「通道」**，谁写都行、自动同步。这就是 TD CHOP 的思维模型，在 JavaScript 里大概要 10 行代码。

对比 React 里要实现同样的事，你至少要：加 Context、Provider、useReducer、useEffect、把非 React 的 Three.js 渲染循环接进 React 的生命周期……Svelte 没有这些摩擦。

## 它在做什么

场景里是一个 `TorusKnotGeometry`（= TD 的 Torus SOP）应用了一个自定义 `ShaderMaterial`（= TD 的 GLSL TOP）。四个参数：

| 参数 | CC | 效果 |
|---|---|---|
| Rotation speed | 16 | 旋转速度（负→正） |
| Geometry complexity | 17 | 量化成 0-7，重建几何的 p/q 参数（弯绕圈数） |
| Hue | 18 | shader 里的主色相 |
| Glow | 19 | 边缘发光强度 |

## 对应的 TD 网络

见 [`td-comparison.md`](./td-comparison.md)。简短版：

```
MIDI In CHOP ─→ Math CHOP ─→ (4 channels) ─┬→ Transform SOP (rotation)
                                            ├→ Torus SOP (p, q)
                                            └→ GLSL TOP uniforms (hue, glow)
                                                      ↓
                                                Geometry COMP → Render TOP → Out
```

## 文件结构

```
03-svelte-midi-playground/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── app.html              ← SvelteKit 入口 HTML
│   ├── routes/
│   │   ├── +layout.ts        ← prerender = true, ssr = false
│   │   └── +page.svelte      ← UI + 4 个 slider + canvas
│   └── lib/
│       ├── stores.ts         ← 4 个 writable store (= CHOP 通道)
│       ├── midi.ts           ← webmidi.js 封装，写 store
│       └── Scene.ts          ← Three.js 场景，读 store
```

## 关键代码段

### 把 MIDI 写入 store（`midi.ts`）

```ts
input.addListener('controlchange', (e) => {
  const cc = e.message.dataBytes[0];
  const value = e.message.dataBytes[1] / 127; // = Math CHOP rescale
  const setter = ccMap[cc];
  if (setter) setter(value);
});
```

### 把 store 读入 Three.js（`Scene.ts`）

```ts
const speed = (get(rotSpeed) - 0.5) * 4; // -2..2 rad/s
this.mesh.rotation.y += speed * dt;
this.material.uniforms.uHue.value = get(hue);
this.material.uniforms.uGlow.value = get(glow);
```

### 把 store 绑到 slider（`+page.svelte`）

```svelte
<input type="range" min="0" max="1" step="0.001" bind:value={$rotSpeed} />
```

**注意：** 这三段代码**互不认识**。它们只共享 `rotSpeed` 这个 store。这就是响应式状态的威力。

## 练习题

1. **改 CC 映射**：把 `ccMap` 里 16-19 改成你的控制器实际发的 CC 号。
2. **加第 5 个通道**：加一个 `scale` store，对应 CC 20，让它控制 `mesh.scale`。
3. **接音频**：把 Demo 1 的 `AnalyserNode` 搬进来，用频谱的低频值覆盖 rotSpeed store——于是你的 3D 场景既能被 MIDI 控也能被音乐驱动。
4. **加 OSC**：参考 [映射表](../../docs/mapping-table.md) 的 OSC 段，起一个 `osc-js` 的 WebSocket bridge 把 OSC 也写到同一组 store 里。

## 踩坑

- **Firefox 不支持 Web MIDI**：直到 2026 年 Firefox 仍未实现 Web MIDI。代码会自动 fallback 到 sliders。
- **没有 MIDI 设备**：同样 fallback。看右侧状态条。
- **SSR crash**：Three.js 依赖 `window`。`+layout.ts` 里设了 `ssr = false`，否则 prerender 会崩。
- **控制器发的是 14-bit CC（高精度）**：webmidi.js v3 有 `nrpn` / `14bit` 的处理方式，但本 demo 只处理普通 7-bit CC，需要的话查 webmidi.js 文档。
- **`build/` 目录下的索引页 404**：`base` 路径问题。本地 preview 的话不需要设 `PAGES_BASE`；部署到 GitHub Pages 时才需要。

## 下一步

- 回去看 [AI 提示词备忘单](../../docs/ai-prompt-cheatsheet.md)，用同样的模式让 AI 帮你把你自己 TD 里的控制器映射翻译到这个 demo 上。
- 读 [`prompts.md`](./prompts.md) 看这个 demo 是怎么 prompt 出来的。
