# Why this project exists

**中文:** [why-web-over-td.md](./why-web-over-td.md)

---

## A familiar situation

You've been pointed at TouchDesigner by a school or a studio. Your teacher says it's "easy to pick up," "no coding required," "artists use it." All of that is **true** — but it's half the story.

The other half:

- **TD is commercial software.** The free tier is capped in resolution and features; the commercial license is not cheap as an annual subscription.
- **Distribution is painful.** Your friend has to install TD to open a `.toe` file. A web page is just a URL.
- **TD skills don't transfer well to other jobs**, while JavaScript / TypeScript is the lingua franca of the entire internet industry.
- **Node graphs look simple until they aren't.** Anyone who's shipped a large TD project knows that debugging a 400-node network can be worse than reading 400 lines of code.

More importantly: **this is 2026**. The bar for "writing a few lines of JavaScript" is not what it was in 2015. AI writes 90% of the boilerplate for you. All *you* need to know is **which library to reach for** and **roughly how it works** — and those are the two things this project is designed to give you.

## We are not bashing TD

For real: TD is still the right tool when —

- you need deep integration with hardware (cameras, LED controllers, sensor arrays, DMX lighting);
- you are doing live performance or installation work that demands low latency, rock-solid stability, and visual debugging;
- your team includes non-programmer collaborators and the node graph is the shared language;
- you need pro streaming gear like NDI, Kinect, or RealSense.

In those cases TD remains one of the best options, and **this project will not try to talk you out of it**.

But if what you need is —

- putting work in a browser so you can share or embed it;
- collaborating with web frontend engineers;
- running across phones, tablets, and desktops;
- learning a skill with broader career transfer —

then the web stack deserves a serious look.

## Is the web stack really that steep?

Ten years ago: "kinda." Today: "much gentler than people think."

Why:

1. **AI assistance**: you describe what you want, AI writes 90% of it. Your time goes into **steering and understanding**, not memorizing APIs.
2. **Browser-native superpowers**: Web Audio, WebGL / WebGPU, WebMIDI, WebSocket, getUserMedia — all of these used to need plugins; now they're native APIs.
3. **Zero install**: a browser and a text editor. Demo 1 in this repo doesn't even need npm.

The catch: AI only works if **you can tell it the right library**. That's why we built the [mapping table](./mapping-table.en.md) and the [AI prompt cheat sheet](./ai-prompt-cheatsheet.en.md).

## Our position

> **Don't pick TD because you're afraid of code. Don't pick TD because it looks cool. Pick based on your distribution target, collaborators, and learning goals.**

If, after reading the three demos, you come away thinking "the web is actually pretty smooth," we've done our job. If you come away still convinced TD fits your needs better, **that's also a good outcome** — because you'll be deciding on information, not on a single line from a teacher.
