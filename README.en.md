# TouchDesigner → Web: It's Time to Take This Seriously

<table>
<tr><td>

**An open-source guide: a quick-reference for web alternatives to common TD nodes.**
You don't need to read it yourself — hand this doc to your AI Agent and let it look things up and write code for you. Includes three live demos.

[![Author](https://img.shields.io/badge/Author-sjwwhenever-blue)](https://sjwwhenever.com) [![Xiaohongshu](https://img.shields.io/badge/Xiaohongshu-不可兼容-red)](https://sjwwhenever.com) [![中文](https://img.shields.io/badge/中文-README-green)](./README.md) [![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

</td></tr>
</table>

---

## Why I wrote this

> I spent years working on TouchDesigner projects. Then vibe coding took off and I started building all sorts of things with web tech — web apps, desktop programs, mobile apps — and I realized: TD is really limited.
>
> That's not to say TD isn't useful. It's genuinely convenient for installations, live performance, and VJ work. But the problem is, **TD's convenience is built on a closed ecosystem**, and that closedness is becoming its biggest bottleneck.

---

## TD's fundamental problem: not open enough

> TD is commercial, closed-source software. Its API is closed — you can do some scripting with Python, but performance-critical parts require C++ plugins with a steep learning curve and a narrow ecosystem. The entire extension system relies on community volunteers; the company hasn't provided a truly open platform.
>
> Recently TD got MCP (Model Context Protocol) support, which looks like embracing AI. But look closer — **that's a community third-party project, not official**. What does that tell you? It tells you the company isn't actively pushing AI integration. MCP isn't a long-term solution — if they don't fundamentally open up TD's architecture and API, community patches alone can't reverse the trend.

---

## A very telling example: MediaPipe

> [!WARNING]
> TD's MediaPipe plugin works by launching a Chromium browser under the hood, running WebAssembly + WebGL, and piping results back to TD via WebSocket. **It's essentially a web app in a wrapper.**

In the TD community, MediaPipe (face tracking, gesture recognition, pose detection) is a hugely impactful capability. Many people think it's a TD feature.

This used to make sense — after all, in TD you just drag a node and it works, no need to deal with web stuff yourself. But now? **You can just ask AI to call MediaPipe directly in a web page, done in a few sentences.** Meanwhile in TD, you still need to install plugins, configure environments, and deal with compatibility.

This isn't an isolated case. TensorFlow.js, OpenCV's WASM builds, various ML models — these capabilities that TD users rely on are all web tech underneath. TD is just a middle layer, and that middle layer is becoming redundant.

---

## Web + AI: the barrier no longer exists

> Ten years ago, choosing TD over writing code made perfect sense — coding was hard, dragging nodes was fast. But it's 2026:

<table>
<tr>
<td width="50%">

**🤖 AI writes your code**
You describe the effect you want, AI produces it. Your role is director, not programmer.

</td>
<td width="50%">

**🌐 Browser-native capabilities have exploded**
Web Audio, WebGL, WebGPU, WebMIDI, WebSocket, camera access — all built into the browser, no plugins needed.

</td>
</tr>
<tr>
<td width="50%">

**🔓 The web is open**
Anyone can use it, any AI can read and write it, any platform can run it. No license fees, no resolution limits, no `.toe` files that only open on machines with TD installed.

</td>
<td width="50%">

**🚀 Deployment cost is zero**
One link, anyone in the world opens it on any device.

</td>
</tr>
</table>

> [!IMPORTANT]
> **The web's openness and AI are natural complements.** AI can read all web documentation, generate all web code, debug all web errors. TD? AI can't even reliably find complete documentation for its node parameters.

---

## For students currently learning TD

> [!CAUTION]
> **Stop relying on outdated advice.**

Your teacher might have told you "TD is easy to pick up, no coding needed, all the artists use it." That was true a few years ago. But the situation is completely different now — AI has brought the coding barrier down to near zero, while TD's closed ecosystem makes it harder and harder to keep up.

Learn a skill locked inside proprietary software, or learn an open tech stack with broad job prospects and full AI assistance? It's not a hard choice.

Stay informed. Otherwise you'll have learned something for nothing.

---

## What this project gives you

> [!TIP]
> You don't need to read this project cover to cover. **Just hand the repo link to your AI Agent and let it look up what you need.**

<table>
<tr>
<td width="33%">

**📖 Quick-reference**
TD node → Web alternative mapping tables. AI looks it up and knows which library to use.

</td>
<td width="33%">

**💬 Prompt templates**
Have AI directly implement the effect you want using web tech.

</td>
<td width="33%">

**🎨 Three demos**
Runnable examples that you can have AI reference and modify.

</td>
</tr>
</table>

---

## TD → Web common alternatives

<details>
<summary><strong>🖼️ Image / Shader / Post-processing (TOP)</strong></summary>

| TD concept | Web alternative |
|---|---|
| GLSL TOP | [Three.js](https://threejs.org/) `ShaderMaterial` / [ogl](https://github.com/oframe/ogl) |
| Feedback TOP | Three.js `WebGLRenderTarget` ping-pong |
| Composite TOP / multi-pass | Three.js `EffectComposer` |
| Noise TOP | GLSL snoise / [lygia](https://lygia.xyz/) |
| Movie File In TOP | HTML `<video>` + Three.js `VideoTexture` |
| Render TOP | `WebGLRenderer.render(scene, camera)` |

</details>

<details>
<summary><strong>📐 3D Geometry (SOP)</strong></summary>

| TD concept | Web alternative |
|---|---|
| Geometry COMP + SOP | Three.js `Mesh` + `BufferGeometry` |
| Sphere / Box / Grid SOP | Three.js built-in geometries |
| Copy SOP / Replicator | `InstancedMesh` |
| Particle SOP | `THREE.Points` + custom shader |
| Transform SOP | `mesh.position / rotation / scale` |

</details>

<details>
<summary><strong>🎵 Signal / Audio (CHOP)</strong></summary>

| TD concept | Web alternative |
|---|---|
| Audio Device In | `getUserMedia()` + `AudioContext` |
| Audio Spectrum | `AnalyserNode.getByteFrequencyData()` |
| Noise CHOP | [`simplex-noise`](https://www.npmjs.com/package/simplex-noise) |
| LFO CHOP | `Math.sin(t * freq)` |
| Timer CHOP | `performance.now()` / `requestAnimationFrame` |
| Keyframe CHOP | [GSAP](https://gsap.com/) |

</details>

<details>
<summary><strong>🎛️ Interaction / Hardware</strong></summary>

| TD concept | Web alternative |
|---|---|
| MIDI In/Out | [`webmidi.js`](https://webmidijs.org/) |
| OSC In/Out | [`osc-js`](https://github.com/adzialocha/osc-js) (needs WebSocket relay) |
| Keyboard / Mouse / Touch | Native browser events |
| WebSocket DAT | Native `WebSocket` |
| HTTP (Web Client DAT) | Native `fetch` |

</details>

<details>
<summary><strong>🧠 ML / Computer Vision</strong></summary>

| TD concept | Web alternative |
|---|---|
| MediaPipe plugin | [MediaPipe Web](https://developers.google.com/mediapipe/solutions/guide#web) (this is what the TD plugin uses under the hood) |
| ML inference | [TensorFlow.js](https://www.tensorflow.org/js) / [ONNX Runtime Web](https://onnxruntime.ai/) |
| OpenCV | [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) (WASM build) |

</details>

> Full mapping table (with code snippets): [docs/mapping-table.en.md](./docs/mapping-table.en.md)

---

## How to use this project

> [!NOTE]
> The simplest way: **hand this repo to your AI Agent as reference material.**

```
Using this repo [repo link] as reference, I want to build [describe the effect] in a web page.
```

<details>
<summary><strong>More precise prompt template</strong></summary>

```
I want to build an effect in the browser:
  [one or two sentences describing it]

Use the mapping table in this doc to pick the right libraries, then implement it.

Constraints:
- Language: [JS / TS]
- Build: [single HTML file / Vite / SvelteKit]
- Give me the minimum number of files
```

> More prompt examples and common AI pitfalls: [docs/ai-prompt-cheatsheet.en.md](./docs/ai-prompt-cheatsheet.en.md)

</details>

---

## Three demos

| # | Folder | Stack | Difficulty | TD families covered |
|---|---|---|---|---|
| 1 | [`demos/01-vanilla-audio-reactive/`](./demos/01-vanilla-audio-reactive/) | Plain HTML + p5.js + Web Audio | Beginner | CHOP (mic/spectrum) |
| 2 | [`demos/02-vite-ts-shader-feedback/`](./demos/02-vite-ts-shader-feedback/) | Vite + TypeScript + Three.js + GLSL | Intermediate | TOP (Feedback + GLSL) |
| 3 | [`demos/03-svelte-midi-playground/`](./demos/03-svelte-midi-playground/) | SvelteKit + Three.js + webmidi.js | Comfortable | MIDI + SOP + TOP |

---

<table>
<tr><td>

[![Author](https://img.shields.io/badge/Author-sjwwhenever-blue)](https://sjwwhenever.com) [![Xiaohongshu](https://img.shields.io/badge/Xiaohongshu-不可兼容-red)](https://sjwwhenever.com) [![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

</td></tr>
</table>
