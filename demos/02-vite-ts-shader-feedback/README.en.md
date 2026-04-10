# Demo 2 · Feedback shader (Three.js + GLSL)

**Audience**: you've written a bit of JavaScript, you've heard of shaders, but you've never wired a ping-pong feedback loop from scratch.
**Stack**: [Vite](https://vitejs.dev) + TypeScript + [Three.js](https://threejs.org/) r165 + hand-written GLSL fragment shader.

**中文:** [README.md](./README.md)

---

## Run it

```bash
cd demos/02-vite-ts-shader-feedback
npm install
npm run dev
```

The browser opens automatically. Move the mouse: a glowing spiral feeds back from the cursor, rotates outward, fades, and cycles hue over time. This is the canonical "Feedback TOP tutorial" case reproduced in the browser.

## What it's doing

### Core idea: ping-pong `WebGLRenderTarget`

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

Each frame:
1. read previous frame from `rtA`;
2. run `feedback.frag` (rotate + zoom + fade + inject a bright dot at the mouse);
3. write the result to `rtB`;
4. copy `rtB` to the default framebuffer with a trivial `copy.frag`;
5. swap `rtA` ↔ `rtB`, repeat.

That is **the entire Feedback TOP implementation on the web**.

### Mapping

| TD node | Where in the code |
|---|---|
| **Feedback TOP** | `rtA` / `rtB` ping-pong (`makeRT()` and the swap in `src/main.ts`) |
| **Transform TOP** (rotate+scale) | `rotate(centered, uRotation)` and `/= uZoom` in `feedback.frag` |
| **Level TOP** (multiply) | `prev * uFade` in `feedback.frag` |
| **Circle TOP + Composite TOP** (mouse dot) | `exp(-d*d*400.0) * hue` in `feedback.frag` |
| **Mouse In CHOP** | the `pointermove` listener in `main.ts` |
| **Time CHOP** (hue scroll) | `THREE.Clock` in `main.ts` |

### The GLSL is basically portable

The biggest selling point: the GLSL in [`src/feedback.frag.glsl`](./src/feedback.frag.glsl) is **almost copy-paste compatible with TD's GLSL TOP**. Drop `varying vec2 vUv;`, rename `vUv` to `vUV`, and it runs. Shader code is the lingua franca — it's the single biggest piece of "free knowledge" you bring with you from TD.

## File layout

```
02-vite-ts-shader-feedback/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html               ← just one <canvas>
└── src/
    ├── main.ts              ← Three.js boilerplate + two RTs + render loop
    ├── feedback.frag.glsl   ← Feedback TOP equivalent (the important bit)
    ├── copy.frag.glsl       ← RT-to-screen (= Null / Out TOP)
    └── passthrough.vert.glsl ← fullscreen-quad vertex shader (write once, never touch again)
```

Vite's `?raw` import loads `.glsl` files as strings — no extra glsl plugin needed.

## Exercises

1. **Flip feedback direction**: in `main.ts` change `uRotation` from `0.0025` to `-0.005`.
2. **Tweak fade**: try `uFade = 0.95` (fast decay) and `uFade = 0.998` (almost no decay).
3. **Reshape the injection**: in `feedback.frag.glsl` change `exp(-d*d*400.0)` to `exp(-d*d*50.0)` for a soft puff.
4. **Add a second injection point**: add `uniform vec2 uMouse2;`, animate it in `main.ts`.
5. **Add noise**: use the lygia snoise snippet from the [mapping table](../../docs/mapping-table.en.md) to distort UVs — you get liquid-feedback.

## Gotchas

- **Black screen**: check the browser console for GLSL compile errors.
- **`HalfFloatType` unsupported**: very old GPUs only. Fall back to `UnsignedByteType` — you'll see 8-bit banding on the fade.
- **Mouse and dot misaligned**: GL y-axis is up. The code flips with `1 - e.clientY / window.innerHeight`.
- **Vite HMR duplicates the feedback after a shader edit**: harmless, just refresh.

## Next

- Read [`td-comparison.md`](./td-comparison.md) for the full node-graph walk-through.
- Read [`prompts.md`](./prompts.md) for the exact AI prompts that produced this demo.
- Move on to [Demo 3](../03-svelte-midi-playground/) to wire these uniforms to a MIDI controller.
