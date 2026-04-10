# Demo 3 · Svelte + webmidi.js + Three.js Playground

**Audience**: comfortable with npm and ES modules, curious how reactive state in a web framework replaces TD's CHOP wiring.
**Stack**: [SvelteKit](https://kit.svelte.dev) + [Three.js](https://threejs.org/) + [webmidi.js](https://webmidijs.org/).

**中文:** [README.md](./README.md)

---

## Run it

```bash
cd demos/03-svelte-midi-playground
npm install
npm run dev
```

- **Have a MIDI controller?** Plug it in. Any device that sends CC works — nanoKONTROL, MIDI Fighter Twister, anything with knobs. The default mapping is **CC 16/17/18/19**.
- **No device?** The right sidebar shows four fallback sliders automatically.

## Why Svelte (not React)

**Svelte's reactive stores are the closest thing the web has to TD's CHOP mental model.** In TD:

- You change a CHOP channel value, and every downstream thing updates automatically.
- You don't write "notify my consumers" code.

Svelte's `writable` store + `$store` syntax does exactly the same thing. Four CC values → four stores:

```ts
export const rotSpeed   = writable(0.5);
export const complexity = writable(0.5);
export const hue        = writable(0.5);
export const glow       = writable(0.5);
```

Then:
- **the MIDI side** (`src/lib/midi.ts`) writes via `rotSpeed.set(value)` on every controlchange message;
- **the UI side** (`src/routes/+page.svelte`) uses `bind:value={$rotSpeed}` on a slider;
- **the Three.js side** (`src/lib/Scene.ts`) reads with `get(rotSpeed)` every frame.

**Three unrelated pieces of code share the same "channel."** Anyone writes, everyone sees — the CHOP model in maybe 10 lines of JavaScript.

Doing the same thing in React requires Context, Provider, useReducer, useEffect, bridging a non-React render loop… Svelte has none of that friction.

## What it does

The scene is a `TorusKnotGeometry` (= TD's Torus SOP) with a custom `ShaderMaterial` (= TD's GLSL TOP). Four parameters:

| Parameter | CC | Effect |
|---|---|---|
| Rotation speed | 16 | negative → positive rotation speed |
| Geometry complexity | 17 | quantized 0–7, rebuilds the knot's p/q (winding) |
| Hue | 18 | the shader's base hue |
| Glow | 19 | rim-light intensity |

## The TD network it mirrors

See [`td-comparison.md`](./td-comparison.md). Short version:

```
MIDI In CHOP ─→ Math CHOP ─→ (4 channels) ─┬→ Transform SOP (rotation)
                                            ├→ Torus SOP (p, q)
                                            └→ GLSL TOP uniforms (hue, glow)
                                                      ↓
                                                Geometry COMP → Render TOP → Out
```

## File layout

```
03-svelte-midi-playground/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── app.html              ← SvelteKit HTML shell
│   ├── routes/
│   │   ├── +layout.ts        ← prerender = true, ssr = false
│   │   └── +page.svelte      ← UI + 4 sliders + canvas
│   └── lib/
│       ├── stores.ts         ← 4 writable stores (= CHOP channels)
│       ├── midi.ts           ← webmidi.js wrapper, writes stores
│       └── Scene.ts          ← Three.js scene, reads stores
```

## Key snippets

### MIDI → store (`midi.ts`)

```ts
input.addListener('controlchange', (e) => {
  const cc = e.message.dataBytes[0];
  const value = e.message.dataBytes[1] / 127; // = Math CHOP rescale
  const setter = ccMap[cc];
  if (setter) setter(value);
});
```

### store → Three.js (`Scene.ts`)

```ts
const speed = (get(rotSpeed) - 0.5) * 4; // -2..2 rad/s
this.mesh.rotation.y += speed * dt;
this.material.uniforms.uHue.value = get(hue);
this.material.uniforms.uGlow.value = get(glow);
```

### store → slider (`+page.svelte`)

```svelte
<input type="range" min="0" max="1" step="0.001" bind:value={$rotSpeed} />
```

**Note:** none of these three pieces of code knows about the others. They just share the `rotSpeed` store. That's the power of reactive state.

## Exercises

1. **Remap CCs** to whatever your controller actually sends.
2. **Add a 5th channel**: `scale`, CC 20, wires into `mesh.scale`.
3. **Plug audio in**: bring the `AnalyserNode` from Demo 1 and have its low-band energy overwrite `rotSpeed` — now your 3D scene is both MIDI-driven and music-driven.
4. **Add OSC**: see the OSC section in the [mapping table](../../docs/mapping-table.en.md). Spin up the `osc-js` WebSocket bridge and write OSC messages into the same stores.

## Gotchas

- **Firefox**: still no Web MIDI in 2026. The code detects this and falls back to sliders.
- **No MIDI device**: same fallback. Check the status line in the sidebar.
- **SSR crash**: Three.js uses `window`. `+layout.ts` sets `ssr = false`, otherwise prerender explodes.
- **14-bit (high-res) CCs**: webmidi.js v3 has 14bit/NRPN handling; this demo only does plain 7-bit CC. See the library docs if you need more precision.
- **`build/` index is 404 after deploy**: a base-path issue. Locally `npm run preview` doesn't need `PAGES_BASE`; on GitHub Pages it does.

## Next

- Revisit the [AI prompt cheat sheet](../../docs/ai-prompt-cheatsheet.en.md) and use the same pattern to have AI port *your* TD controller mapping into this demo.
- Read [`prompts.md`](./prompts.md) for the exact prompts that generated this demo.
