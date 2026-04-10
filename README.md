# touchdesigner_to_web_guidebook

> TD 能做的，Web 也能做；在 AI 帮你写代码的今天，Web 学起来反而更划算。

**English:** [README.en.md](./README.en.md)

---

本项目是一份**从 TouchDesigner 迁移到 Web 前端**的开源教学材料。它不贬低 TD，只提供另一条路径。

## 这个项目适合谁

- 🎛️ **已经会 TD 的用户**——想把已有作品复刻到浏览器里，或需要 Web 技术栈进行分发和协作。
- 🌱 **零基础、被老师安利 TD 的学生**——你其实不一定要从 TD 学起；Web 栈开放、免费、就业面更广，而且有 AI 帮你写代码。
- 🤔 **好奇想学 TD 的人**——先看看 Web 里这些东西长什么样，再决定要不要进坑也不迟。

## 核心理念

在 TD 里，你拖一根线就能把 *Audio Device In CHOP* 接到 *Geometry COMP*。在 Web 里，同样的事要写几行 JavaScript——但是：

1. **Web 生态有现成的库**对应 TD 的几乎每一个大类节点；
2. **AI 辅助编程**让这几行代码的边际成本接近于零——只要你知道该让 AI 用哪个库；
3. **部署成本=0**：Web 作品可以用一条 GitHub Pages 链接分享给任何人，不需要装软件。

所以这个项目的核心不是「教你写代码」，而是：

- 📖 [**TD 概念 → Web 库 映射表**](./docs/mapping-table.md)：告诉你每个 TD 节点类别用什么 Web 库对应；
- 🤖 [**AI 提示词备忘单**](./docs/ai-prompt-cheatsheet.md)：给 AI 写提示词的模版，让它替你把 TD 思路翻译成 Web 代码；
- 🎨 **三个可运行的小型示例**，加起来覆盖 TD 的四大类能力（TOP / SOP / CHOP / MIDI·OSC）。

## 三个示例

| # | 目录 | 技术栈 | 面向人群 | 涉及 TD 能力 |
|---|---|---|---|---|
| 1 | [`demos/01-vanilla-audio-reactive/`](./demos/01-vanilla-audio-reactive/) | 纯 HTML + p5.js + Web Audio（CDN，零构建） | 零基础 | CHOP（麦克风/频谱）、简单 TOP/SOP |
| 2 | [`demos/02-vite-ts-shader-feedback/`](./demos/02-vite-ts-shader-feedback/) | Vite + TypeScript + Three.js + GLSL | 中级 | TOP（Feedback + GLSL + Composite） |
| 3 | [`demos/03-svelte-midi-playground/`](./demos/03-svelte-midi-playground/) | SvelteKit + Three.js + webmidi.js | 熟练 | MIDI/OSC + SOP + TOP |

> 🟢 **在线体验**：把仓库 fork 到你自己的 GitHub，开启 Pages 部署后访问 `https://<你的用户名>.github.io/touchdesigner_to_web_guidebook/`。本仓库包含开箱即用的 GitHub Actions workflow。

## 学习路径建议

1. 先读 [`docs/why-web-over-td.md`](./docs/why-web-over-td.md)，明白这个项目为什么存在。
2. 打开 [Demo 1](./demos/01-vanilla-audio-reactive/)，对着麦克风说话，看图形变化。读一遍源码（只有 ~150 行）。
3. 回头看 [映射表](./docs/mapping-table.md)，找你在 TD 里最常用的 3 个节点，记一下它们对应的 Web 库。
4. 打开 [Demo 2](./demos/02-vite-ts-shader-feedback/)，跑起来，尝试改一改 GLSL shader 里的数字。
5. 打开 [Demo 3](./demos/03-svelte-midi-playground/)，接上你的 MIDI 控制器（或用屏幕 slider 回退）。
6. 读 [AI 提示词备忘单](./docs/ai-prompt-cheatsheet.md)，用同样的模版让 AI 帮你实现**你自己的** TD 作品的 Web 版本。

## 免责声明

**TouchDesigner 是一个优秀的实时视觉工具**，尤其在装置、演出、VJ 等需要硬件集成的场景里至今难以替代。本项目无意制造对立——只是告诉你：如果你的目标是 Web 分发、跨平台协作、或单纯想用代码而非节点思维创作，**Web 栈是一个非常现实的选项**。

## License

[MIT](./LICENSE)
