# Demo 1 · Microphone-driven audio visualizer

**Audience**: absolute beginner. Never written JavaScript before? Fine.
**Stack**: plain HTML + [p5.js](https://p5js.org/) (from CDN) + the browser's native Web Audio API.
**Zero build**: no `npm`, no `package.json`, no dependencies to install. A single `index.html`.

**中文:** [README.md](./README.md)

---

## Run it

Because `getUserMedia` (the browser's mic permission API) refuses to run from `file://`, you can't just double-click `index.html`. You have to start a local server. Easiest way:

```bash
cd demos/01-vanilla-audio-reactive
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Click the "Click to start" button, grant mic permission, talk / clap / play music at the mic. You should see:

- A central circle whose radius pumps with **low-frequency energy**;
- A radial burst of lines whose lengths follow **per-bin spectrum** (TD's Audio Spectrum CHOP);
- A waveform line across the bottom (TD's Audio Device In CHOP raw signal).

## What it's actually doing

### The TD node graph

In TD the node graph for the same thing looks roughly like:

```
[Audio Device In CHOP] ──→ [Audio Spectrum CHOP] ──→ [Analyze CHOP]──┐
                                                                      ├──→ [Geometry COMP]
                                                                      ├──→ [Circle SOP]
                                                                      └──→ [Color]
```

See [`td-comparison.md`](./td-comparison.md) for the full walk-through.

### The Web mapping

| TD node | Line in the code |
|---|---|
| Audio Device In CHOP | `navigator.mediaDevices.getUserMedia({ audio: true })` |
| Entering the audio graph | `AudioContext` + `createMediaStreamSource` |
| Audio Spectrum CHOP | `AnalyserNode` + `getByteFrequencyData()` |
| Analyze CHOP (band averages) | a tiny `average()` function |
| Lag CHOP (smoothing) | one line of exponential smoothing: `x += (target - x) * k` |
| Drawing geometry | p5's `circle()` / `line()` |

**The mental shift**: in TD you drag wires; on the web you "read values out of a `Uint8Array` each frame." Once you internalize that, everything else is variations on the theme.

## How to read the source

Open [`index.html`](./index.html) and read top to bottom:

1. **HTML + CSS** (first ~20 lines): an overlay button and a canvas. Don't overthink.
2. **The `startBtn` handler** (lines ~31-48): the **entire audio pipeline**. Four lines: permission → AudioContext → Analyser → connect.
3. **The `sketch` function** (lines ~51-130): p5's `setup` and `draw`. `draw` is called ~60 times per second.
4. **`average()` helper**: averaging a slice of the spectrum is exactly what Analyze CHOP does.

~140 lines total including comments and blank lines.

## Exercises

1. **Rewire the color**: near line 75, replace `hue = frameCount * 0.3 + ...` with `hue = smoothedLow * 360` and watch the hue breathe with the low band.
2. **Add a new band**: the code uses low / mid / high. Add a "sub" band (bins 0-4) that drives a single giant circle.
3. **Drop p5**: redo everything with the raw Canvas 2D API (`canvas.getContext('2d')`). You'll discover p5 saves maybe a dozen lines.
4. **Ask AI to port it to Three.js**: use the template in [AI prompt cheat sheet](../../docs/ai-prompt-cheatsheet.en.md) to ask AI for a 3D version. Compare the code size.

## Gotchas

- **Mic permission not appearing?** Probably opened with `file://`. Has to be `http://localhost`.
- **Howling feedback?** Shouldn't happen — the code deliberately does **not** connect `analyser` to `ctx.destination`. If you did, unconnect it.
- **Doesn't work on mobile?** iOS requires HTTPS for `getUserMedia`. Push to GitHub Pages and it'll work.

## Next

- Browse the [mapping table](../../docs/mapping-table.en.md) for other CHOP nodes you know.
- Move on to [Demo 2](../02-vite-ts-shader-feedback/) to see how shaders work on the web.
