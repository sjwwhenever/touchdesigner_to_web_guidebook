# touchdesigner_to_web_guidebook

> Everything TouchDesigner does, the web can do too — and with AI writing your code, learning the web stack has never been cheaper.

**中文:** [README.md](./README.md)

---

This is an open-source tutorial for **migrating from TouchDesigner (TD) to the web frontend stack**. It is not an anti-TD project. It just offers a second path.

## Who this is for

- 🎛️ **Existing TD users** who want to port their work to the browser, or need a web stack for distribution and collaboration.
- 🌱 **Beginners nudged toward TD by a teacher.** You don't actually have to start with TD. Web tech is free, open, has a larger job market, and AI can write most of the boilerplate for you.
- 🤔 **Curious learners** who want to peek at what TD-style work looks like on the web before deciding whether to commit to TD.

## Core idea

In TD you drag a wire from *Audio Device In CHOP* to *Geometry COMP*. On the web you write a few lines of JavaScript instead — but:

1. **The web ecosystem has mature libraries** for nearly every TD node category.
2. **AI-assisted coding** makes those few lines almost free to produce — as long as you know which library to ask for.
3. **Deployment cost = 0**: a web piece is a single GitHub Pages URL you can send to anyone. No installer.

So this project isn't really "here's how to write JavaScript." It's:

- 📖 [**TD concept → Web library mapping table**](./docs/mapping-table.en.md)
- 🤖 [**AI prompt cheat sheet**](./docs/ai-prompt-cheatsheet.en.md) — templates for asking AI to translate your TD idea into web code.
- 🎨 **Three runnable demos** that together cover TD's four main families (TOP / SOP / CHOP / MIDI·OSC).

## The three demos

| # | Folder | Stack | Audience | TD families |
|---|---|---|---|---|
| 1 | [`demos/01-vanilla-audio-reactive/`](./demos/01-vanilla-audio-reactive/) | Plain HTML + p5.js + Web Audio (CDN, no build) | Absolute beginner | CHOP (mic/spectrum), simple TOP/SOP |
| 2 | [`demos/02-vite-ts-shader-feedback/`](./demos/02-vite-ts-shader-feedback/) | Vite + TypeScript + Three.js + GLSL | Intermediate | TOP (Feedback + GLSL + Composite) |
| 3 | [`demos/03-svelte-midi-playground/`](./demos/03-svelte-midi-playground/) | SvelteKit + Three.js + webmidi.js | Comfortable | MIDI/OSC + SOP + TOP |

> 🟢 **Live demo**: fork this repo, enable GitHub Pages, and visit `https://<your-username>.github.io/touchdesigner_to_web_guidebook/`. A ready-to-use GitHub Actions workflow is included.

## Suggested learning path

1. Read [`docs/why-web-over-td.en.md`](./docs/why-web-over-td.en.md) so you know why this project exists.
2. Open [Demo 1](./demos/01-vanilla-audio-reactive/), talk into the mic, watch it move. Read the source (~150 lines).
3. Skim the [mapping table](./docs/mapping-table.en.md). Pick the 3 TD nodes you use most — remember which library each maps to.
4. Open [Demo 2](./demos/02-vite-ts-shader-feedback/). Run it. Tweak a few numbers in the GLSL shader.
5. Open [Demo 3](./demos/03-svelte-midi-playground/). Connect a MIDI controller (or use the fallback on-screen sliders).
6. Read the [AI prompt cheat sheet](./docs/ai-prompt-cheatsheet.en.md) and use the same templates to reimplement **your own** TD piece on the web.

## Disclaimer

**TouchDesigner is an excellent real-time visual tool**, especially for installations, live performance, and VJ work where hardware integration still matters. This project isn't here to pick a fight — it's here to tell you that, if your goal is web distribution, cross-platform collaboration, or simply expressing yourself in code rather than a node graph, **the web stack is a very real option**.

## License

[MIT](./LICENSE)
