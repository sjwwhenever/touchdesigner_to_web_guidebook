# AI prompt cheat sheet

**中文:** [ai-prompt-cheatsheet.md](./ai-prompt-cheatsheet.md)

---

> This is the single most important thing we want you to take home. In an era where AI writes 90% of your code, **"knowing which library to aim AI at"** matters more than **"knowing how to write it yourself."**

The templates below assume you've read the [mapping table](./mapping-table.en.md) first.

## 1. Universal template (copy verbatim)

```
I want to migrate a TouchDesigner effect to the browser.

The TD node chain is:
  [node1] → [node2] → [node3]
The effect is:
  [one or two sentences]

Please implement the same effect in the browser using [Three.js / p5.js / Svelte + webmidi.js / other].

Constraints:
- Language: [JS / TS]
- Build: [no build tool, single HTML file / Vite / SvelteKit]
- Target browser: latest Chrome
- Give me one or two files, not a whole project skeleton
- Do not add libraries I did not ask for
```

Why this template works:

1. **Explicit input and output** — the AI doesn't have to guess.
2. **Explicit library** — the AI won't pitch whatever it heard about last week.
3. **Explicit build depth** — "no build tool" forces native APIs + CDN, which is great for teaching.
4. **"Give me one file"** — drastically reduces the chance of AI hallucinating an entire monorepo.

## 2. Filled-in examples by TD family

### Example 1 · CHOP (audio reactive)

```
I want to migrate a TouchDesigner effect to the browser.

The TD node chain is:
  Audio Device In CHOP → Audio Spectrum CHOP → take first 16 bins → Circle SOP radius
The effect is:
  A circle whose radius reacts in real time to the low-frequency energy from the microphone.

Please implement the same effect in the browser using p5.js + the native Web Audio API.

Constraints:
- Language: JS
- Build: no build tool, single HTML file, load p5 from a CDN
- Target browser: latest Chrome
- Give me one index.html
- Include a "Start" button so the microphone permission is requested after a user gesture (browser requirement)
```

See [`demos/01-vanilla-audio-reactive/`](../demos/01-vanilla-audio-reactive/).

---

### Example 2 · TOP (Feedback + GLSL)

```
I want to migrate a TouchDesigner effect to the browser.

The TD node chain is:
  Feedback TOP → Transform TOP (slight rotation + scale) → Level TOP → loop back
  + mouse position injects a bright dot into the feedback
The effect is:
  The classic TD feedback-loop visual — a glow that spirals outward from the center.

Please implement this with Vite + TypeScript + Three.js. The key is using two WebGLRenderTargets for ping-pong.

Constraints:
- Language: TypeScript
- Build: Vite
- Target browser: latest Chrome
- Deliverables: package.json, vite.config.ts, index.html, src/main.ts, src/feedback.frag.glsl
- Use a recent Three.js (r160+); do not use deprecated APIs beyond .setSize
- Put the fragment shader in a standalone .glsl file, not inline strings
```

See [`demos/02-vite-ts-shader-feedback/`](../demos/02-vite-ts-shader-feedback/).

---

### Example 3 · MIDI + SOP/TOP (hardware-driven 3D scene)

```
I want to migrate a TouchDesigner effect to the browser.

The TD node chain is:
  MIDI In CHOP (a knob controller, CC 16~19)
  → Math CHOP normalized to [0,1]
  → drives Geometry COMP Transform SOP rotation, scale, and shader color
The effect is:
  A 3D scene (a few meshes) where four knobs control rotation speed, geometry complexity, shader hue, and glow intensity.

Please implement with SvelteKit + Three.js + webmidi.js.

Constraints:
- Language: TypeScript
- Build: SvelteKit (latest, adapter-static)
- Target browser: latest Chrome
- If no MIDI device is detected, fall back to four <input type="range"> sliders on screen
- Deliverables: +page.svelte, Scene.ts (Three.js wrapper), midi.ts (webmidi.js wrapper)
- Expose MIDI values through a Svelte store so Scene.ts can read them reactively
```

See [`demos/03-svelte-midi-playground/`](../demos/03-svelte-midi-playground/).

---

## 3. Common AI mistakes (pitfall list)

When you ask AI for TD-migration code, do **not** trust the first draft. Run it; when it breaks, paste the exact error back and ask for a fix. Typical failures:

### Three.js
- **WebGLRenderTarget API drift**: post-r150 semantics for clone/set changed. AI mixes r120 and r160 code. Require `import * as THREE from 'three'` and the latest API.
- **Forgetting `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`**: blurry or flickery output on retina.
- **Color space**: new Three.js defaults to `SRGBColorSpace`; legacy `encoding = sRGBEncoding` will warn.
- **`requestAnimationFrame` losing `this`**: AI forgets `bind` inside classes.

### Web Audio
- **Not gated on a user gesture**: `AudioContext` must be created or `resume()`d after a click/key. Symptom: mic permission pops but `analyser` is all zeros.
- **`getUserMedia` needs https or localhost**: opening `file://` won't work. Use `python3 -m http.server` or a Vite dev server.
- **`fftSize` must be a power of two**: 256/512/1024/2048/4096. Anything else throws.

### webmidi.js
- **v2 vs v3 API differ a lot**: v3 is `WebMidi.inputs[0].addListener('controlchange', fn)`; v2 was `addListener('controlchange', 'all', fn)`. Always specify v3.
- **Firefox does not support Web MIDI** (still). Ask AI for feature-detection + fallback.
- **No device connected → `inputs.length === 0`**: write a fallback UI.

### p5.js
- **Global mode vs instance mode**: AI mixing the two causes weird scope bugs. Pick one and say so.
- **Mic needs `p5.AudioIn` from `p5.sound`**: default `p5.min.js` does not include sound. Load `p5.sound.min.js` separately.

### SvelteKit
- **Importing `three` at the top of `+page.svelte` crashes SSR**: Three.js depends on `window`. Guard with `onMount` or `$effect`, or use `browser` from `$app/environment`.
- **`adapter-static` needs `prerender = true`**: otherwise it errors.
- **Svelte 5 runes** (`$state`, `$derived`, `$effect`) **are incompatible with Svelte 4's `$:` syntax**. Ask which version first.

---

## 4. When the AI-generated code doesn't run

Standard debugging protocol:

1. **Paste the full error verbatim** (don't paraphrase).
2. **Include the exact code version** (or a commit hash).
3. **State what you've already checked** ("I confirmed `node_modules/three` is r160.2").
4. **Ask for minimal changes**: "Only fix what causes this error, don't rewrite the file."

Two or three iterations usually gets you there. If five iterations don't, the AI is probably missing context — go back to step 1 of the template and rewrite the requirements.

---

## 5. The meta-lesson

> **You are not learning how to write code. You are learning how to be a web-literate AI director.**

Knowing what's possible, knowing which library to aim at, knowing how to validate the result — those three beat syntactic fluency every time. The mapping table gives you the first two. This cheat sheet gives you the third.
