# TD concept → Web library mapping table

**中文:** [mapping-table.md](./mapping-table.md)

---

This table is the heart of the project. Each row tells you: **what a TD node/concept does, and which web library does the same thing in a browser**.

- ✅ **Implemented in this repo**: runs inside one of the demos, open and read the source.
- 📋 **Snippet only**: a minimal skeleton for you (and AI) to reference; not in a demo, but can be pasted into a blank project.
- 🔗 **Docs only**: the mapping is given, the implementation is up to your actual needs.

## TOP (images / textures / post-processing)

| TD node / concept | Web equivalent | Minimal skeleton | Status |
|---|---|---|---|
| **GLSL TOP** | [Three.js](https://threejs.org/) `ShaderMaterial` / [ogl](https://github.com/oframe/ogl) / [regl](https://regl.party/) | `new THREE.ShaderMaterial({ fragmentShader, vertexShader, uniforms })` | ✅ Demo 2 |
| **Feedback TOP** | Three.js `WebGLRenderTarget` ping-pong (two RTs alternating) | see `swap()` in Demo 2 `src/main.ts` | ✅ Demo 2 |
| **Composite TOP** / multi-pass | [Three.js `EffectComposer`](https://threejs.org/docs/#examples/en/postprocessing/EffectComposer) or manual multi-render | `composer.addPass(new ShaderPass(...))` | 🔗 |
| **Blur TOP** | `postprocessing` `BlurPass` / hand-written two-pass gaussian | `new BlurPass({ kernelSize: KernelSize.LARGE })` | 🔗 |
| **Noise TOP** | GLSL snoise / [lygia](https://lygia.xyz/) | `#include "lygia/generative/snoise.glsl"` + `snoise(uv*5.0)` | 📋 |
| **Movie File In TOP** | HTML `<video>` → Three.js `VideoTexture` | `const tex = new THREE.VideoTexture(videoEl)` | 📋 |
| **Text TOP** | canvas 2d → `CanvasTexture`, or [troika-three-text](https://github.com/protectwise/troika/tree/main/packages/troika-three-text) | `new Text()` + `text.text = 'hi'` | 📋 |
| **Render TOP** (3D scene) | Plain `WebGLRenderer.render(scene, camera)` | default Three.js usage | ✅ Demo 3 |
| **Level TOP** / tone mapping | postprocess shader or `renderer.toneMapping` | `renderer.toneMapping = THREE.ACESFilmicToneMapping` | 🔗 |

### TOP snippet: Video → Texture (Movie File In TOP)

```js
import * as THREE from 'three';

const video = document.createElement('video');
video.src = 'clip.mp4';
video.loop = true;
video.muted = true; // browsers require muted for autoplay
await video.play();

const texture = new THREE.VideoTexture(video);
material.uniforms.uMap.value = texture;
```

### TOP snippet: Noise TOP (lygia snoise)

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

## SOP (geometry / 3D)

| TD node / concept | Web equivalent | Minimal skeleton | Status |
|---|---|---|---|
| **Geometry COMP** + SOP geometry | Three.js `Mesh` + `BufferGeometry` | `new Mesh(new BoxGeometry(), new MeshStandardMaterial())` | ✅ Demo 3 |
| **Sphere / Box / Grid SOP** | Three.js built-in `SphereGeometry` / `BoxGeometry` / `PlaneGeometry` | `new SphereGeometry(1, 32, 32)` | ✅ Demo 3 |
| **Copy SOP / Replicator COMP** | `InstancedMesh` | `new InstancedMesh(geo, mat, count)` + `setMatrixAt(i, m)` per instance | 📋 |
| **Particle SOP** | `THREE.Points` + custom shader | `new Points(geometry, pointsMaterial)` | 📋 |
| **Noise SOP** (vertex deformation) | add noise offset in the vertex shader | `position.xyz += normal * snoise(position)` | 📋 |
| **Transform SOP** | `mesh.position / rotation / scale` | `mesh.rotation.y = t` | ✅ Demo 3 |
| **Line / Curve SOP** | `Line2` / `MeshLine` / Three.js `CatmullRomCurve3` | `new Line2(geo, lineMat)` | 🔗 |
| **Merge SOP** | `BufferGeometryUtils.mergeGeometries` | `mergeGeometries([a, b, c])` | 🔗 |

### SOP snippet: Replicator (InstancedMesh)

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

## CHOP (signals / audio / data)

| TD node / concept | Web equivalent | Minimal skeleton | Status |
|---|---|---|---|
| **Audio Device In CHOP** | `getUserMedia({ audio: true })` + `AudioContext` | see Demo 1 `index.html` | ✅ Demo 1 |
| **Audio Spectrum CHOP** | `AnalyserNode.getByteFrequencyData()` | `analyser.getByteFrequencyData(freq)` | ✅ Demo 1 |
| **Analyze CHOP** (RMS / peak / avg) | reduce over the `Float32Array` yourself | `arr.reduce((a,b)=>a+b)/arr.length` | ✅ Demo 1 |
| **Audio File In CHOP** | `new Audio('clip.mp3')` → `createMediaElementSource` | `ctx.createMediaElementSource(audioEl)` | 📋 |
| **Noise CHOP** (signal noise) | any Perlin/Simplex JS lib, e.g. `simplex-noise` | `noise.noise2D(t, 0)` | 📋 |
| **Math CHOP** (mix/scale) | plain JS arithmetic | `const mix = a * (1 - t) + b * t` | generic |
| **Lag CHOP / Filter CHOP** (low-pass) | exponential smoothing `x = x + (target - x) * k` | one-liner per frame | ✅ Demo 1 |
| **Timer CHOP** | `performance.now()` / `requestAnimationFrame` | `const t = performance.now() / 1000` | generic |
| **Keyframe CHOP** | [gsap](https://gsap.com/) / [d3-ease](https://d3js.org/d3-ease) / hand-written easing | `gsap.to(obj, { x: 10, duration: 1 })` | 🔗 |
| **LFO CHOP** | plain JS `Math.sin(t * freq)` | `const lfo = Math.sin(t * 2 * Math.PI * freq)` | generic |

### CHOP snippet: Audio File → Spectrum

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
  // `freq` is your CHOP channel data.
  requestAnimationFrame(tick);
}
tick();
```

---

## Interaction / hardware (MIDI / OSC / DAT)

| TD node / concept | Web equivalent | Minimal skeleton | Status |
|---|---|---|---|
| **MIDI In CHOP** | [`webmidi.js`](https://webmidijs.org/) or native `navigator.requestMIDIAccess` | `WebMidi.inputs[0].addListener('controlchange', fn)` | ✅ Demo 3 |
| **MIDI Out CHOP** | same lib, `WebMidi.outputs[0].sendControlChange()` | `output.sendControlChange(7, 100, 1)` | 📋 |
| **OSC In/Out CHOP** | [`osc-js`](https://github.com/adzialocha/osc-js) via a WebSocket relay | `const osc = new OSC(); osc.on('/x', e => ...)` | 🔗 needs backend relay |
| **Keyboard In CHOP** | native `window.addEventListener('keydown', fn)` | `e.key`, `e.code` | generic |
| **Mouse In CHOP** | native `window.addEventListener('pointermove', fn)` | `e.clientX / window.innerWidth` | ✅ Demo 2 |
| **Touch In CHOP** | native `pointerdown/move/up` (unified mouse+touch) | same | generic |
| **DAT Table** | plain JS arrays / JSON / `d3-dsv` for CSV | `d3.csvParse(text)` | 🔗 |
| **Web Client DAT** (HTTP) | native `fetch` | `await fetch(url).then(r => r.json())` | generic |
| **WebSocket DAT** | native `WebSocket` | `new WebSocket('ws://...')` | generic |

### Interaction snippet: Keyboard In CHOP

```js
const keys = new Set();
addEventListener('keydown', e => keys.add(e.code));
addEventListener('keyup',   e => keys.delete(e.code));

// Query inside the render loop:
if (keys.has('Space')) doSomething();
```

### Interaction snippet: OSC over WebSocket

> ⚠️ Browsers can't emit UDP directly. You must go through WebSocket → backend relay → OSC. The simplest relay is the Node bridge shipped with `osc-js`. This project does not include a backend by default.

```js
import OSC from 'osc-js';

const osc = new OSC({ plugin: new OSC.WebsocketClientPlugin({ port: 8080 }) });
osc.open();
osc.on('/fader/1', msg => {
  console.log('got fader', msg.args[0]);
});
```

---

## COMP (components / layout)

| TD node / concept | Web equivalent | Notes |
|---|---|---|
| **Container COMP / Panel COMP** | HTML `<div>` + CSS Flex/Grid | This is what the web natively excels at — just write HTML. |
| **Slider COMP / Button COMP** | `<input type="range">` / `<button>` | Or use [tweakpane](https://tweakpane.github.io/docs/) for a ready-made debug panel. |
| **Window COMP** (multi-window) | Multiple `<canvas>` / `window.open()` / `BroadcastChannel` to sync data | Multi-window on the web needs manual coordination. |
| **Replicator COMP** | JavaScript loop + DOM or `InstancedMesh` | See the SOP section. |
| **Base COMP / Container COMP** as encapsulation | Web Components / Svelte components / React components | Demo 3 demonstrates Svelte components. |

---

## How to use this table

1. Don't try to read it top to bottom. **Bookmark it**, come back when you need to migrate a specific TD node.
2. Feed the relevant row to your AI as context:
   > "I want to migrate TD's *Feedback TOP + Level TOP* to Three.js. The docs say the mapping is `WebGLRenderTarget` ping-pong + `ACESFilmicToneMapping`. Give me a minimal runnable example."
3. Check the [AI prompt cheat sheet](./ai-prompt-cheatsheet.en.md) for better prompting.

If a row has a better library, or a TD node is missing, please open an issue or a PR.
