# TD 概念 → Web 库 映射表

**English:** [mapping-table.en.md](./mapping-table.en.md)

---

这张表是本项目的核心。每一行告诉你：**在 TD 里某个节点/概念做的事，在浏览器里用哪个库做**。

- ✅ **本仓库已实现**：在某个 demo 里真实跑过，可以直接打开看；
- 📋 **代码片段**：只是给你和 AI 参考的最小骨架，未必在 demo 里出现，但粘到空白项目里就能用；
- 🔗 **纯文档**：只给出对应关系，实现取决于你的具体需求。

## TOP（图像 / 贴图 / 后处理）

| TD 节点 / 概念 | Web 对应 | 最小骨架 | 状态 |
|---|---|---|---|
| **GLSL TOP** | [Three.js](https://threejs.org/) `ShaderMaterial` / [ogl](https://github.com/oframe/ogl) / [regl](https://regl.party/) | `new THREE.ShaderMaterial({ fragmentShader, vertexShader, uniforms })` | ✅ Demo 2 |
| **Feedback TOP** | Three.js `WebGLRenderTarget` ping-pong（两张 RT 交替做输入输出） | 见 Demo 2 `src/main.ts` 的 `swap()` | ✅ Demo 2 |
| **Composite TOP** / 多 pass | [Three.js `EffectComposer`](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer) 或手动多次 `render()` | `composer.addPass(new ShaderPass(...))` | 🔗 |
| **Blur TOP** | `postprocessing` 的 `BlurPass` / 自写两遍高斯 | `new BlurPass({ kernelSize: KernelSize.LARGE })` | 🔗 |
| **Noise TOP** | GLSL 里写 snoise / 用 [lygia](https://lygia.xyz/) | `#include "lygia/generative/snoise.glsl"` + `snoise(uv*5.0)` | 📋 |
| **Movie File In TOP** | HTML `<video>` → Three.js `VideoTexture` | `const tex = new THREE.VideoTexture(videoEl)` | 📋 |
| **Text TOP** | canvas 2d → `CanvasTexture`，或 [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) | `new Text()` + `text.text = 'hi'` | 📋 |
| **Render TOP**（3D 场景渲染） | 一个普通的 `WebGLRenderer.render(scene, camera)` | 就是 Three.js 的默认用法 | ✅ Demo 3 |
| **Level TOP** / 色调映射 | postprocess shader 或 `renderer.toneMapping` | `renderer.toneMapping = THREE.ACESFilmicToneMapping` | 🔗 |

### TOP 代码片段：Video → Texture（Movie File In TOP）

```js
import * as THREE from 'three';

const video = document.createElement('video');
video.src = 'clip.mp4';
video.loop = true;
video.muted = true; // 浏览器自动播放要求静音
await video.play();

const texture = new THREE.VideoTexture(video);
// 之后当成普通贴图用：
material.uniforms.uMap.value = texture;
```

### TOP 代码片段：Noise TOP（lygia snoise）

```glsl
#include "lygia/generative/snoise.glsl"

uniform float uTime;
varying vec2 vUv;

void main() {
  float n = snoise(vec3(vUv * 5.0, uTime * 0.3));
  gl_FragColor = vec4(vec3(n * 0.5 + 0.5), 1.0);
}
```

---

## SOP（几何 / 3D）

| TD 节点 / 概念 | Web 对应 | 最小骨架 | 状态 |
|---|---|---|---|
| **Geometry COMP** + SOP 几何 | Three.js `Mesh` + `BufferGeometry` | `new Mesh(new BoxGeometry(), new MeshStandardMaterial())` | ✅ Demo 3 |
| **Sphere / Box / Grid SOP** | Three.js 内置 `SphereGeometry` / `BoxGeometry` / `PlaneGeometry` | `new SphereGeometry(1, 32, 32)` | ✅ Demo 3 |
| **Copy SOP / Replicator COMP** | `InstancedMesh` | `new InstancedMesh(geo, mat, count)` + 每个实例 `setMatrixAt(i, m)` | 📋 |
| **Particle SOP** | `THREE.Points` + 自定义 shader | `new Points(geometry, pointsMaterial)` | 📋 |
| **Noise SOP**（变形几何） | 在顶点 shader 里加 noise 偏移 | `position.xyz += normal * snoise(position)` | 📋 |
| **Transform SOP** | `mesh.position / rotation / scale` | `mesh.rotation.y = t` | ✅ Demo 3 |
| **Line / Curve SOP** | `Line2` / `MeshLine` / Three.js `CatmullRomCurve3` | `new Line2(geo, lineMat)` | 🔗 |
| **Merge SOP** | `BufferGeometryUtils.mergeGeometries` | `mergeGeometries([a, b, c])` | 🔗 |

### SOP 代码片段：Replicator（InstancedMesh）

```js
import * as THREE from 'three';

const count = 1000;
const mesh = new THREE.InstancedMesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial(),
  count,
);
const m = new THREE.Matrix4();
for (let i = 0; i < count; i++) {
  m.setPosition(Math.random() * 10, Math.random() * 10, Math.random() * 10);
  mesh.setMatrixAt(i, m);
}
scene.add(mesh);
```

---

## CHOP（信号 / 音频 / 数据）

| TD 节点 / 概念 | Web 对应 | 最小骨架 | 状态 |
|---|---|---|---|
| **Audio Device In CHOP** | `getUserMedia({ audio: true })` + `AudioContext` | 见 Demo 1 `index.html` | ✅ Demo 1 |
| **Audio Spectrum CHOP** | `AnalyserNode.getByteFrequencyData()` | `analyser.getByteFrequencyData(freq)` | ✅ Demo 1 |
| **Analyze CHOP**（RMS / peak / average） | 自己对 `Float32Array` 求均值/最大值 | `arr.reduce((a,b)=>a+b)/arr.length` | ✅ Demo 1 |
| **Audio File In CHOP** | `new Audio('clip.mp3')` → `createMediaElementSource` | `ctx.createMediaElementSource(audioEl)` | 📋 |
| **Noise CHOP**（信号噪声） | 纯 JS：Perlin/Simplex 噪声库，例如 `simplex-noise` | `noise.noise2D(t, 0)` | 📋 |
| **Math CHOP**（混合/缩放） | 纯 JS 算术 | `const mix = a * (1 - t) + b * t` | 通用 |
| **Lag CHOP / Filter CHOP**（低通平滑） | 指数平滑 `x = x + (target - x) * k` | 每帧一行 | ✅ Demo 1 |
| **Timer CHOP** | `performance.now()` / `requestAnimationFrame` | `const t = performance.now() / 1000` | 通用 |
| **Keyframe CHOP** | [gsap](https://gsap.com/) / [d3-ease](https://d3js.org/d3-ease) / 自写缓动 | `gsap.to(obj, { x: 10, duration: 1 })` | 🔗 |
| **LFO CHOP** | 纯 JS `Math.sin(t * freq)` | `const lfo = Math.sin(t * 2 * Math.PI * freq)` | 通用 |

### CHOP 代码片段：Audio File → Spectrum

```js
const audioEl = new Audio('clip.mp3');
await audioEl.play();
const ctx = new AudioContext();
const src = ctx.createMediaElementSource(audioEl);
const analyser = ctx.createAnalyser();
analyser.fftSize = 512;
src.connect(analyser).connect(ctx.destination);

const freq = new Uint8Array(analyser.frequencyBinCount);
function tick() {
  analyser.getByteFrequencyData(freq);
  // freq 就是你的 CHOP 通道数据
  requestAnimationFrame(tick);
}
tick();
```

---

## 交互 / 硬件（MIDI / OSC / DAT）

| TD 节点 / 概念 | Web 对应 | 最小骨架 | 状态 |
|---|---|---|---|
| **MIDI In CHOP** | [`webmidi.js`](https://webmidijs.org/) 或原生 `navigator.requestMIDIAccess` | `WebMidi.inputs[0].addListener('controlchange', fn)` | ✅ Demo 3 |
| **MIDI Out CHOP** | 同上，`WebMidi.outputs[0].sendControlChange()` | `output.sendControlChange(7, 100, 1)` | 📋 |
| **OSC In CHOP / OSC Out CHOP** | [`osc-js`](https://github.com/adzialocha/osc-js)（通过 WebSocket relay） | `const osc = new OSC(); osc.on('/x', e => ...)` | 🔗 需后端 relay |
| **Keyboard In CHOP** | 原生 `window.addEventListener('keydown', fn)` | `e.key`、`e.code` | 通用 |
| **Mouse In CHOP** | 原生 `window.addEventListener('pointermove', fn)` | `e.clientX / window.innerWidth` | ✅ Demo 2 |
| **Touch In CHOP** | 原生 `pointerdown/move/up`（统一处理鼠标+触摸） | 同上 | 通用 |
| **DAT Table** | 纯 JS 数组 / JSON / `d3-dsv` 读 CSV | `d3.csvParse(text)` | 🔗 |
| **Web Client DAT**（HTTP） | 原生 `fetch` | `await fetch(url).then(r => r.json())` | 通用 |
| **WebSocket DAT** | 原生 `WebSocket` | `new WebSocket('ws://...')` | 通用 |

### 交互代码片段：Keyboard In CHOP

```js
const keys = new Set();
addEventListener('keydown', e => keys.add(e.code));
addEventListener('keyup',   e => keys.delete(e.code));

// 在渲染循环里查询：
if (keys.has('Space')) doSomething();
```

### 交互代码片段：OSC over WebSocket

> ⚠️ 浏览器不能直接发 UDP，必须通过 WebSocket → 后端 relay → OSC。最简单的 relay 是 `osc-js` 自带的 Node 版 bridge，本项目不默认带后端。

```js
import OSC from 'osc-js';

const osc = new OSC({ plugin: new OSC.WebsocketClientPlugin({ port: 8080 }) });
osc.open(); // 连上你的 relay
osc.on('/fader/1', msg => {
  console.log('got fader', msg.args[0]);
});
```

---

## COMP（组件 / 布局）

| TD 节点 / 概念 | Web 对应 | 备注 |
|---|---|---|
| **Container COMP / Panel COMP** | HTML `<div>` + CSS Flex/Grid | 这是 Web 的原生强项，直接写 HTML |
| **Slider COMP / Button COMP** | `<input type="range">` / `<button>` | 或者 [tweakpane](https://tweakpane.github.io/docs/) 做现成的调试面板 |
| **Window COMP**（多窗口） | 多个 `<canvas>` / `window.open()` / `BroadcastChannel` 同步数据 | Web 做多窗口需要手动协调 |
| **Replicator COMP** | JavaScript 循环 + DOM 或 `InstancedMesh` | 见 SOP 段落 |
| **Base COMP / Container COMP** 作为封装 | Web Components / Svelte 组件 / React 组件 | Demo 3 用 Svelte 组件演示 |

---

## 使用建议

1. 别试图一次读完这张表。**收藏它**，在你遇到某个 TD 节点需要迁移时再来查。
2. 把对应那一行扔给 AI 当上下文：
   > 「我要把 TD 里的 *Feedback TOP + Level TOP* 迁移到 Three.js。文档说对应的是 `WebGLRenderTarget` ping-pong + `ACESFilmicToneMapping`。请给我一个最小可运行示例。」
3. 看 [AI 提示词备忘单](./ai-prompt-cheatsheet.md) 学怎么写更好的提示词。

如果你发现某一行有更好的库，或者缺了某个 TD 节点，欢迎提 issue 或 PR。
