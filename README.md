# TouchDesigner → Web：是时候认真考虑这件事了

<table>
<tr><td>

**一份开源指南：TD 常用节点的 Web 替代方案速查。**
你不需要自己读完它——把这个文档扔给 AI Agent，让它帮你查、帮你写。附带三个可在线体验的 Demo。

[![作者](https://img.shields.io/badge/作者-sjwwhenever-blue)](https://sjwwhenever.xyz) [![小红书](https://img.shields.io/badge/小红书-不可兼容-red)](https://sjwwhenever.xyz) [![English](https://img.shields.io/badge/English-README-green)](./README.en.md) [![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

</td></tr>
</table>

---

## 我为什么写这个

> 我做了很多年 TouchDesigner 项目。后来 vibe coding 起来之后，我开始用 Web 技术做各种东西——网页应用、桌面程序、手机 App——然后发现：TD 真的很受限。
>
> 不是说 TD 不好用。它在装置、演出、VJ 这些场景里确实方便。但问题是，**TD 的好用建立在一个封闭的生态上**，而这个封闭正在成为它最大的瓶颈。

---

## TD 的根本问题：不够开放

> TD 是商业闭源软件。它的 API 是封闭的——你能用 Python 做一些脚本，但性能关键的部分必须写 C++ 插件，门槛很高，生态也很窄。整个扩展体系依赖社区用爱发电，官方并没有提供一个真正开放的平台。
>
> 最近 TD 有了 MCP（Model Context Protocol）的支持，看起来是在拥抱 AI。但仔细看，**那是社区第三方做的（比如 [touchdesigner-mcp](https://github.com/8beeeaaat/touchdesigner-mcp)，向作者致敬），不是官方的**。这说明什么？说明官方在 AI 这件事上并没有真正主动推进。MCP 不是长久之计——如果官方不从根本上开放 TD 的架构和 API，光靠社区补丁是无法逆转趋势的。

---

## 一个很能说明问题的例子：MediaPipe

> [!WARNING]
> TD 的 MediaPipe 插件底层就是启动了一个 Chromium 浏览器，跑的是 WebAssembly + WebGL，再通过 WebSocket 把结果传回 TD。**它本质上就是套壳了一个网页应用。**

在 TD 圈子里，MediaPipe（人脸追踪、手势识别、姿态检测）是影响力很大的一个能力。很多人觉得这是 TD 的功能。

这在以前还说得通——毕竟你在 TD 里拖个节点就能用，不用自己处理 Web 那一套。但现在呢？**你完全可以在网页里让 AI 帮你直接调用 MediaPipe，几句话就搞定。** 反而是在 TD 里，你还得装插件、配环境、处理兼容性。

这不是个例。TensorFlow.js、OpenCV 的 WASM 版本、各种 ML 模型——这些 TD 用户常用的能力，底层全是 Web 技术。TD 只是一个中间层，而这个中间层正在变得多余。

---

## Web + AI：门槛已经不存在了

> 十年前选 TD 而不是写代码，理由很充分——代码门槛高，拖节点快。但 2026 年了：

<table>
<tr>
<td width="50%">

**🤖 AI 帮你写代码**
你描述你要什么效果，AI 写出来。你的角色是导演，不是程序员。

</td>
<td width="50%">

**🌐 浏览器原生能力已经爆炸**
Web Audio、WebGL、WebGPU、WebMIDI、WebSocket、摄像头——全是浏览器自带的，不需要任何插件。

</td>
</tr>
<tr>
<td width="50%">

**🔓 Web 是开放的**
任何人可以用，任何 AI 可以读写，任何平台可以跑。没有授权费，没有分辨率限制，没有 `.toe` 文件只有装了 TD 的人才能打开的问题。

</td>
<td width="50%">

**🚀 部署成本是零**
一条链接，全世界任何人在任何设备上打开就能用。

</td>
</tr>
</table>

> [!IMPORTANT]
> **Web 的开放性和 AI 是天然互补的。** AI 能读所有 Web 文档、能生成所有 Web 代码、能调试所有 Web 错误。而 TD？AI 连它的节点参数文档都不一定能找全。

---

## 给正在学 TD 的学生

> [!CAUTION]
> **不要听信以前的经验了。**

你的老师可能告诉你"TD 上手快、不用写代码、艺术家都用它"。这些话在几年前是对的。但现在的情况完全不同了——AI 把写代码的门槛拉到了接近于零，而 TD 的封闭生态让它越来越难跟上。

学一门被封闭在特定软件里的技能，还是学一套开放的、就业面广的、AI 能全程辅助的技术栈？这个选择不难做。

多看看新的资讯，不然真的学了白学。

---

## 这个项目给你什么

> [!TIP]
> 这个项目不需要你从头到尾读完。**把这个仓库的链接扔给你的 AI Agent，让它根据你的需求去查就行。**

<table>
<tr>
<td width="33%">

**📖 速查表**
TD 节点 → Web 替代方案的映射表。AI 一查就知道该用什么库。

</td>
<td width="33%">

**💬 提示词模版**
让 AI 直接帮你用 Web 实现你想要的效果。

</td>
<td width="33%">

**🎨 三个 Demo**
可以直接跑的例子，你可以让 AI 参考着改。

</td>
</tr>
</table>

---

## TD → Web 常用替代方案

<details>
<summary><strong>🖼️ 图像 / Shader / 后处理（TOP）</strong></summary>

| TD 里的东西 | Web 替代 |
|---|---|
| GLSL TOP | [Three.js](https://threejs.org/) `ShaderMaterial` / [ogl](https://github.com/oframe/ogl) |
| Feedback TOP | Three.js `WebGLRenderTarget` ping-pong |
| Composite TOP / 多 pass | Three.js `EffectComposer` |
| Noise TOP | GLSL 内写 snoise / [lygia](https://lygia.xyz/) |
| Movie File In TOP | HTML `<video>` + Three.js `VideoTexture` |
| Render TOP | `WebGLRenderer.render(scene, camera)` |

</details>

<details>
<summary><strong>📐 3D 几何（SOP）</strong></summary>

| TD 里的东西 | Web 替代 |
|---|---|
| Geometry COMP + SOP | Three.js `Mesh` + `BufferGeometry` |
| Sphere / Box / Grid SOP | Three.js 内置几何体 |
| Copy SOP / Replicator | `InstancedMesh` |
| Particle SOP | `THREE.Points` + 自定义 shader |
| Transform SOP | `mesh.position / rotation / scale` |

</details>

<details>
<summary><strong>🎵 信号 / 音频（CHOP）</strong></summary>

| TD 里的东西 | Web 替代 |
|---|---|
| Audio Device In | `getUserMedia()` + `AudioContext` |
| Audio Spectrum | `AnalyserNode.getByteFrequencyData()` |
| Noise CHOP | [`simplex-noise`](https://www.npmjs.com/package/simplex-noise) |
| LFO CHOP | `Math.sin(t * freq)` |
| Timer CHOP | `performance.now()` / `requestAnimationFrame` |
| Keyframe CHOP | [GSAP](https://gsap.com/) |

</details>

<details>
<summary><strong>🎛️ 交互 / 硬件</strong></summary>

| TD 里的东西 | Web 替代 |
|---|---|
| MIDI In/Out | [`webmidi.js`](https://webmidijs.org/) |
| OSC In/Out | [`osc-js`](https://github.com/adzialocha/osc-js)（需 WebSocket relay） |
| Keyboard / Mouse / Touch | 浏览器原生事件 |
| WebSocket DAT | 原生 `WebSocket` |
| HTTP (Web Client DAT) | 原生 `fetch` |

</details>

<details>
<summary><strong>🧠 ML / 计算机视觉</strong></summary>

| TD 里的东西 | Web 替代 |
|---|---|
| MediaPipe 插件 | [MediaPipe Web](https://developers.google.com/mediapipe/solutions/guide#web)（就是 TD 插件底层用的东西） |
| ML 推理 | [TensorFlow.js](https://www.tensorflow.org/js) / [ONNX Runtime Web](https://onnxruntime.ai/) |
| OpenCV | [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)（WASM 编译版） |

</details>

> 完整映射表（含代码片段）见 [docs/mapping-table.md](./docs/mapping-table.md)

---

## 怎么用这个项目

> [!NOTE]
> 最简单的方式：**把这个仓库给你的 AI Agent 当参考资料。**

```
参考这个仓库 [仓库链接]，我想在网页里实现 [描述你想要的效果]。
```

<details>
<summary><strong>更精确的提示词模版</strong></summary>

```
我想在浏览器里实现一个效果：
  [一两句话描述]

参考这个文档里的映射表，帮我选合适的库，然后实现它。

约束：
- 语言：[JS / TS]
- 构建：[单 HTML 文件 / Vite / SvelteKit]
- 只给我最少的文件
```

> 更多提示词示例和 AI 常犯的坑，见 [docs/ai-prompt-cheatsheet.md](./docs/ai-prompt-cheatsheet.md)

</details>

---

## 三个示例

| # | 在线体验 | 源码 | 技术栈 | 难度 | 涉及 TD 能力 |
|---|---|---|---|---|---|
| 1 | [▶ 打开](https://sjwwhenever.github.io/touchdesigner_to_web_guidebook/demo1/) | [`demos/01-vanilla-audio-reactive/`](./demos/01-vanilla-audio-reactive/) | 纯 HTML + p5.js + Web Audio | 零基础 | CHOP（麦克风/频谱） |
| 2 | [▶ 打开](https://sjwwhenever.github.io/touchdesigner_to_web_guidebook/demo2/) | [`demos/02-vite-ts-shader-feedback/`](./demos/02-vite-ts-shader-feedback/) | Vite + TypeScript + Three.js + GLSL | 中级 | TOP（Feedback + GLSL） |
| 3 | [▶ 打开](https://sjwwhenever.github.io/touchdesigner_to_web_guidebook/demo3/) | [`demos/03-svelte-midi-playground/`](./demos/03-svelte-midi-playground/) | SvelteKit + Three.js + webmidi.js | 熟练 | MIDI + SOP + TOP |

---

<table>
<tr><td>

[![作者](https://img.shields.io/badge/作者-sjwwhenever-blue)](https://sjwwhenever.xyz) [![小红书](https://img.shields.io/badge/小红书-不可兼容-red)](https://sjwwhenever.xyz) [![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

</td></tr>
</table>
